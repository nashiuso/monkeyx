import type { Seed128 } from "../seed/hash.js";
import { createRng, deriveSeed } from "../seed/rng.js";
import type { Rng } from "../seed/rng.js";
import {
  ACCENTS,
  AUTO_BACKGROUNDS,
  DARK_BACKGROUNDS,
  HAIR_NEUTRALS,
  PALETTES,
  paletteById,
} from "../monkey/palettes.js";
import type { Palette } from "../monkey/palettes.js";
import type { BackgroundStyleId } from "../monkey/background.js";
import { BACKGROUND_STYLE_IDS } from "../monkey/background.js";
import type { PresetDefinition } from "../presets/presets.js";
import type { StyleDefinition } from "../style/styles.js";
import { familyById, SALT } from "./families.js";
import { resolveHair } from "./constraints.js";
import { EXPRESSIONS, EXPRESSION_IDS } from "./expression.js";
import type { ExpressionId } from "./expression.js";
import type { HeadId } from "./head.js";
import type { EarsId } from "./ears.js";
import type { EyesId } from "./eyes.js";
import type { BrowsId } from "./brows.js";
import type { NoseId } from "./nose.js";
import type { MouthId } from "./mouth.js";
import type { HairId } from "./hair.js";
import type { PatternId } from "./patterns.js";
import type { BodyId } from "./body.js";
import type { ArmsId } from "./arms.js";
import type { LegsId } from "./legs.js";
import type { TailId } from "./tail.js";
import type { ClothingId } from "./clothing.js";
import type { AccessoryId } from "./accessories.js";
import type { ExtraId } from "./extras.js";

// fully resolved visual identity of one avatar
export interface TraitSelection {
  readonly expression: ExpressionId;
  readonly head: HeadId;
  readonly ears: EarsId;
  readonly eyes: EyesId;
  readonly brows: BrowsId;
  readonly nose: NoseId;
  readonly mouth: MouthId;
  readonly hair: HairId;
  readonly pattern: PatternId;
  readonly body: BodyId;
  readonly arms: ArmsId;
  readonly legs: LegsId;
  readonly tail: TailId;
  readonly clothing: ClothingId;
  readonly accessory: AccessoryId;
  readonly extra: ExtraId;
  readonly palette: Palette;
  readonly backgroundStyle: BackgroundStyleId;
  readonly backgroundColor: string;
  readonly accent: string;
  readonly hairColor: string;
}

// user-provided trait constraints; values are validated in options.ts
export interface TraitOverrides {
  readonly expression?: ExpressionId;
  readonly palette?: string;
  readonly accent?: string;
  readonly head?: string;
  readonly ears?: string;
  readonly eyes?: string;
  readonly brows?: string;
  readonly nose?: string;
  readonly mouth?: string;
  readonly hair?: string;
  readonly pattern?: string;
  readonly body?: string;
  readonly arms?: string;
  readonly legs?: string;
  readonly tail?: string;
  readonly clothing?: string;
  readonly accessory?: string;
  readonly extra?: string;
}

// registry-driven selection: each family picks from its own independent
// random stream, constrained by the expression archetype and shaped by the
// preset and style weight tables. overrides always win.
export function selectTraits(
  seed: Seed128,
  preset: PresetDefinition,
  style: StyleDefinition,
  o: TraitOverrides,
): TraitSelection {
  const stream = (salt: number): Rng => createRng(deriveSeed(seed, salt));

  const expression =
    o.expression ?? stream(SALT.expression).pick(EXPRESSION_IDS);
  const archetype = EXPRESSIONS[expression];

  // archetype-constrained picks bypass the family registry lists
  const pickConstrained = <T extends string>(
    familyId: Parameters<typeof familyById>[0],
    ids: readonly T[],
    ovr?: string,
  ): T => {
    if (ovr !== undefined) return ovr as T;
    return stream(familyById(familyId).salt).pick(ids);
  };

  // registry-driven pick with preset/style weight shaping
  const pickFamily = (
    familyId: Parameters<typeof familyById>[0],
    ovr?: string,
  ): string => {
    if (ovr !== undefined) return ovr;
    const family = familyById(familyId);
    const presetNone = preset.noneWeights[family.id];
    const styleNone = style.noneWeights[family.id];
    if (presetNone === undefined && styleNone === undefined) {
      return stream(family.salt).pick(family.traits.map((t) => t.id));
    }
    const noneMult = (presetNone ?? 1) * (styleNone ?? 1);
    const entries = family.traits.map((t): readonly [string, number] => [
      t.id,
      t.id === "none" ? (t.weight ?? 1) * noneMult : (t.weight ?? 1),
    ]);
    return stream(family.salt).weighted(entries);
  };

  const headId = pickFamily("head", o.head) as HeadId;
  const ears = pickFamily("ears", o.ears) as EarsId;
  const eyes = pickConstrained("eyes", archetype.eyes, o.eyes) as EyesId;
  const brows = pickConstrained("brows", archetype.brows, o.brows) as BrowsId;
  const nose = pickFamily("nose", o.nose) as NoseId;
  const mouth = pickConstrained("mouth", archetype.mouth, o.mouth) as MouthId;
  const hair = pickFamily("hair", o.hair) as HairId;
  const pattern = pickFamily("pattern", o.pattern) as PatternId;
  const body = pickFamily("body", o.body) as BodyId;
  const arms = pickFamily("arms", o.arms) as ArmsId;
  const legs = pickFamily("legs", o.legs) as LegsId;
  const tail = pickFamily("tail", o.tail) as TailId;
  const clothing = pickFamily("clothing", o.clothing) as ClothingId;
  const accessory = pickFamily("accessory", o.accessory) as AccessoryId;
  const extra = pickFamily("extra", o.extra) as ExtraId;

  // compatibility: hard headwear hides random hair; pinned hair wins
  const hairFinal = resolveHair(hair, accessory, o.hair !== undefined);

  // palette: preset force > user > style whitelist > all
  const paletteId =
    preset.forcedPalette ??
    o.palette ??
    stream(SALT.palette).pick(style.palettes ?? PALETTES.map((p) => p.id));
  const palette = paletteById(paletteId) ?? PALETTES[0]!;

  // background: intersection of preset and style whitelists
  let bgIds: readonly BackgroundStyleId[] =
    style.backgrounds ?? BACKGROUND_STYLE_IDS;
  if (preset.backgroundStyles !== null) {
    const filtered = bgIds.filter((id) =>
      preset.backgroundStyles!.includes(id),
    );
    if (filtered.length > 0) bgIds = filtered;
  }
  const backgroundStyle = stream(SALT.backgroundStyle).pick(bgIds);
  const backgroundColor = stream(SALT.backgroundColor).pick(
    style.dark ? DARK_BACKGROUNDS : AUTO_BACKGROUNDS,
  );
  const accent = o.accent ?? stream(SALT.accent).pick(style.accents ?? ACCENTS);

  const hairRng = stream(SALT.hairColor);
  const hairColor =
    hairRng.weighted([
      ["natural", 7],
      ["accent", 3],
    ] as const) === "natural"
      ? hairRng.pick(HAIR_NEUTRALS)
      : hairRng.pick(ACCENTS);

  return {
    expression,
    head: headId,
    ears,
    eyes,
    brows,
    nose,
    mouth,
    hair: hairFinal,
    pattern,
    body,
    arms,
    legs,
    tail,
    clothing,
    accessory,
    extra,
    palette,
    backgroundStyle,
    backgroundColor,
    accent,
    hairColor,
  };
}
