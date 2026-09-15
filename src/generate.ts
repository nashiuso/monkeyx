import { ValidationError } from "./errors.js";
import { normalizeSeed } from "./seed/normalize.js";
import { hashSeed, seedFingerprint, GENERATION_VERSION } from "./seed/hash.js";
import { normalizeOptions } from "./options.js";
import type { GenerateOptions } from "./options.js";
import { selectTraits } from "./traits/select.js";
import { listTraits } from "./traits/families.js";
import type { TraitFamilyId } from "./traits/families.js";
import { renderMonkey } from "./monkey/compose.js";
import { ANIMATION_IDS } from "./animation/animations.js";
import type { AnimationId } from "./animation/animations.js";
import { PRESET_IDS } from "./presets/presets.js";
import { STYLE_IDS } from "./style/styles.js";
import { PALETTE_IDS } from "./monkey/palettes.js";
import { VERSION } from "./version.js";

// rich generation result for advanced consumers (debuggers, galleries, demos)
export interface MonkeyDetail {
  /** seed exactly as provided by the caller */
  readonly seed: string;
  /** normalized seed actually used for hashing */
  readonly normalizedSeed: string;
  /** 8-char hex fingerprint, also used as the svg id namespace */
  readonly fingerprint: string;
  /** generation algorithm version that produced this avatar */
  readonly version: number;
  /** serialized svg markup */
  readonly svg: string;
  /** selected traits in fixed family order */
  readonly traits: Readonly<Record<TraitFamilyId | "expression", string>>;
  /** fur palette id */
  readonly palette: string;
  /** active animation presets, empty when static */
  readonly animation: readonly AnimationId[];
  /** animation speed multiplier */
  readonly speed: number;
  /** background mode: auto | transparent | solid | gradient */
  readonly background: string;
  /** utf-8 byte length of the svg */
  readonly bytes: number;
}

const FAMILY_ORDER: readonly (TraitFamilyId | "expression")[] = [
  "expression",
  "head",
  "ears",
  "eyes",
  "brows",
  "nose",
  "mouth",
  "hair",
  "pattern",
  "body",
  "arms",
  "legs",
  "tail",
  "clothing",
  "accessory",
  "extra",
];

function traitRecord(
  selection: ReturnType<typeof selectTraits>,
): MonkeyDetail["traits"] {
  const record = {} as Record<TraitFamilyId | "expression", string>;
  for (const key of FAMILY_ORDER) {
    record[key] = selection[key];
  }
  return record;
}

// generate and return full details for a seed
export function generateDetail(
  seed: string,
  options?: GenerateOptions,
): MonkeyDetail {
  if (typeof seed !== "string") {
    throw new ValidationError("invalid-seed", "seed must be a string");
  }
  const normalized = normalizeSeed(seed);
  const resolved = normalizeOptions(options);
  const seed128 = hashSeed(normalized);
  const selection = selectTraits(
    seed128,
    resolved.preset,
    resolved.style,
    resolved.overrides,
  );
  const svg = renderMonkey({
    seed128,
    normalizedSeed: normalized,
    selection,
    style: resolved.style,
    animations: new Set(resolved.animation.ids),
    speed: resolved.animation.speed,
    size: resolved.size,
    title: resolved.title,
    desc: resolved.desc,
    decorative: resolved.decorative,
    background: resolved.background,
  });
  return {
    seed,
    normalizedSeed: normalized,
    fingerprint: seedFingerprint(seed128),
    version: GENERATION_VERSION,
    svg,
    traits: traitRecord(selection),
    palette: selection.palette.id,
    animation: resolved.animation.ids,
    speed: resolved.animation.speed,
    background:
      resolved.background.mode === "none"
        ? "transparent"
        : resolved.background.mode,
    bytes: new TextEncoder().encode(svg).length,
  };
}

// generate an svg string for a seed — the primary api
export function generate(seed: string, options?: GenerateOptions): string {
  return generateDetail(seed, options).svg;
}

// callable api: monkeyx("seed") or monkeyx.generate("seed")
export interface MonkeyxApi {
  (seed: string, options?: GenerateOptions): string;
  generate(seed: string, options?: GenerateOptions): string;
  details(seed: string, options?: GenerateOptions): MonkeyDetail;
  traits(): ReturnType<typeof listTraits>;
  animations(): typeof ANIMATION_IDS;
  presets(): typeof PRESET_IDS;
  styles(): typeof STYLE_IDS;
  palettes(): typeof PALETTE_IDS;
  version: string;
  generationVersion: number;
}

const call = (seed: string, options?: GenerateOptions): string =>
  generate(seed, options);

export const monkeyx: MonkeyxApi = Object.assign(call, {
  generate,
  details: generateDetail,
  traits: listTraits,
  animations: () => ANIMATION_IDS,
  presets: () => PRESET_IDS,
  styles: () => STYLE_IDS,
  palettes: () => PALETTE_IDS,
  version: VERSION,
  generationVersion: GENERATION_VERSION,
});
