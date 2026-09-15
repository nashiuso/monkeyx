import { ValidationError } from "./errors.js";
import { ANIMATION_IDS, findLevelConflict } from "./animation/animations.js";
import type { AnimationId } from "./animation/animations.js";
import { PRESET_IDS, getPreset } from "./presets/presets.js";
import type { PresetId, PresetDefinition } from "./presets/presets.js";
import { STYLE_IDS, styleById } from "./style/styles.js";
import type { StyleId } from "./style/styles.js";
import type { StyleDefinition } from "./style/styles.js";
import { TRAIT_FAMILY_IDS, familyInfo } from "./traits/families.js";
import type { TraitFamilyId } from "./traits/families.js";
import { EXPRESSION_IDS } from "./traits/expression.js";
import type { ExpressionId } from "./traits/expression.js";
import { PALETTE_IDS } from "./monkey/palettes.js";
import type { TraitOverrides } from "./traits/select.js";

// public generation options — intentionally small, strictly validated
export interface GenerateOptions {
  /** named generation preset: "default" | "minimal" | "playful" | "monochrome" */
  preset?: PresetId;
  /** visual design family: "classic" | "soft" | "bold" | "tiny" | "paper" | "retro" | "night" | "neon" */
  style?: StyleId;
  /** rendered width/height in px; the viewBox stays 256x256 */
  size?: number;
  /**
   * animation: a preset id, a list of composable presets, or
   * { preset, speed }. static output is the default.
   */
  animation?:
    | AnimationId
    | readonly AnimationId[]
    | {
        readonly preset: AnimationId | readonly AnimationId[];
        readonly speed?: number;
      };
  /** force a fur palette id, e.g. "cocoa" */
  palette?: string;
  /** override the accent color used for clothing/accessories, e.g. "#de5b5b" */
  accent?: string;
  /** force an expression archetype */
  expression?: ExpressionId;
  /** "auto" | "transparent" | "none" | "#hex" | { from: "#hex", to: "#hex" } */
  background?:
    | "auto"
    | "transparent"
    | "none"
    | string
    | { readonly from: string; readonly to: string };
  /** accessible title (defaults to a seed-derived label) */
  title?: string;
  /** accessible description */
  desc?: string;
  /** mark the svg decorative: aria-hidden, no title/desc */
  decorative?: boolean;
  /** trait overrides — one optional id per family */
  head?: string;
  ears?: string;
  eyes?: string;
  brows?: string;
  nose?: string;
  mouth?: string;
  hair?: string;
  pattern?: string;
  body?: string;
  arms?: string;
  legs?: string;
  tail?: string;
  clothing?: string;
  accessory?: string;
  extra?: string;
}

export interface ResolvedAnimation {
  readonly ids: readonly AnimationId[];
  readonly speed: number;
}

export interface ResolvedBackground {
  readonly mode: "auto" | "none" | "transparent" | "solid" | "gradient";
  readonly color?: string;
  readonly from?: string;
  readonly to?: string;
}

// internally resolved, fully validated options
export interface ResolvedOptions {
  preset: PresetDefinition;
  style: StyleDefinition;
  size: number | undefined;
  animation: ResolvedAnimation;
  background: ResolvedBackground;
  title: string | undefined;
  desc: string | undefined;
  decorative: boolean;
  overrides: TraitOverrides;
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/;
const MAX_LABEL_LENGTH = 300;
const MIN_SPEED = 0.25;
const MAX_SPEED = 4;

const OPTION_KEYS: ReadonlySet<string> = new Set([
  "preset",
  "style",
  "size",
  "animation",
  "palette",
  "accent",
  "expression",
  "background",
  "title",
  "desc",
  "decorative",
  ...TRAIT_FAMILY_IDS,
]);

function invalid(message: string): ValidationError {
  return new ValidationError("invalid-option", message);
}

function checkTraitValue(family: TraitFamilyId, value: string): void {
  const info = familyInfo(family);
  if (!info.traits.includes(value)) {
    throw new ValidationError(
      "unknown-trait",
      `unknown ${family} trait "${value}". valid traits: ${info.traits.join(", ")}`,
    );
  }
}

function animationIdOrThrow(value: unknown, what: string): AnimationId {
  if (typeof value !== "string" || !ANIMATION_IDS.includes(value as never)) {
    throw new ValidationError(
      "unknown-animation",
      `unknown animation ${what} "${String(value)}". valid animations: ${ANIMATION_IDS.join(", ")}`,
    );
  }
  return value as AnimationId;
}

// normalize every accepted animation option shape into ids + speed
function normalizeAnimation(value: unknown): ResolvedAnimation {
  let rawPresets: unknown;
  let speed = 1;
  if (typeof value === "string" || Array.isArray(value)) {
    rawPresets = value;
  } else if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    const keys = Object.keys(value);
    if (
      keys.length === 0 ||
      keys.some((k) => k !== "preset" && k !== "speed")
    ) {
      throw invalid("animation object must be { preset, speed? }");
    }
    rawPresets = (value as { preset: unknown }).preset;
    const rawSpeed = (value as { speed?: unknown }).speed;
    if (rawSpeed !== undefined) {
      if (
        typeof rawSpeed !== "number" ||
        !Number.isFinite(rawSpeed) ||
        rawSpeed < MIN_SPEED ||
        rawSpeed > MAX_SPEED
      ) {
        throw invalid(
          `animation speed must be a number between ${MIN_SPEED} and ${MAX_SPEED}`,
        );
      }
      speed = rawSpeed;
    }
  } else {
    throw invalid(
      "animation must be a preset id, an array of ids, or { preset, speed? }",
    );
  }

  const ids = (Array.isArray(rawPresets) ? rawPresets : [rawPresets]).map(
    (entry, i) =>
      animationIdOrThrow(
        entry,
        Array.isArray(rawPresets) ? `at index ${i}` : "",
      ),
  );

  const unique = [...new Set(ids)];
  const conflict = findLevelConflict(unique);
  if (conflict.length === 2) {
    throw invalid(
      `animations "${conflict[0]}" and "${conflict[1]}" both animate the same part; combine presets that target different parts (e.g. "idle" + "blink" + "tail")`,
    );
  }
  return { ids: unique, speed };
}

function normalizeBackground(value: unknown): ResolvedBackground {
  if (value === "auto") return { mode: "auto" };
  if (value === "transparent" || value === "none")
    return { mode: "transparent" };
  if (typeof value === "string") {
    if (!HEX.test(value)) {
      throw invalid(
        'background must be "auto", "transparent", "none" or a hex color like "#f4eee3"',
      );
    }
    return { mode: "solid", color: value.toLowerCase() };
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const keys = Object.keys(value);
    if (keys.length !== 2 || !("from" in value) || !("to" in value)) {
      throw invalid(
        'background object must be exactly { from: "#hex", to: "#hex" }',
      );
    }
    const from = (value as { from: unknown }).from;
    const to = (value as { to: unknown }).to;
    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      !HEX.test(from) ||
      !HEX.test(to)
    ) {
      throw invalid(
        "background gradient colors must be hex strings like #f4eee3",
      );
    }
    return { mode: "gradient", from: from.toLowerCase(), to: to.toLowerCase() };
  }
  throw invalid(
    'background must be "auto", "transparent", "none", a hex color, or { from, to }',
  );
}

function validateLabel(key: "title" | "desc", value: unknown): string {
  if (typeof value !== "string") {
    throw invalid(`${key} must be a string`);
  }
  if (value.length > MAX_LABEL_LENGTH) {
    throw invalid(`${key} must be at most ${MAX_LABEL_LENGTH} characters`);
  }
  return value;
}

// strict validation: unknown keys and values fail loudly, nothing is coerced.
// options are re-assembled onto a fresh object, so prototype pollution
// attempts (e.g. a parsed "__proto__" key) are rejected, never merged
export function normalizeOptions(options?: GenerateOptions): ResolvedOptions {
  const resolved: ResolvedOptions = {
    preset: getPreset("default")!,
    style: styleById("classic")!,
    size: undefined,
    animation: { ids: [], speed: 1 },
    background: { mode: "auto" },
    title: undefined,
    desc: undefined,
    decorative: false,
    overrides: {},
  };
  if (options === undefined) return resolved;

  if (
    typeof options !== "object" ||
    options === null ||
    Array.isArray(options)
  ) {
    throw invalid("options must be an object");
  }

  // whitelist walk: unknown own keys (including "__proto__" from parsed json)
  // are rejected outright
  for (const key of Object.keys(options)) {
    if (!OPTION_KEYS.has(key)) {
      throw new ValidationError("unknown-option", `unknown option "${key}"`);
    }
  }

  const record = options as Record<string, unknown>;

  if (record["preset"] !== undefined) {
    const id = record["preset"];
    if (typeof id !== "string" || !PRESET_IDS.includes(id as never)) {
      throw new ValidationError(
        "unknown-preset",
        `unknown preset "${String(id)}". valid presets: ${PRESET_IDS.join(", ")}`,
      );
    }
    resolved.preset = getPreset(id)!;
  }

  if (record["style"] !== undefined) {
    const id = record["style"];
    const def = typeof id === "string" ? styleById(id) : undefined;
    if (def === undefined) {
      throw new ValidationError(
        "unknown-option",
        `unknown style "${String(id)}". valid styles: ${STYLE_IDS.join(", ")}`,
      );
    }
    resolved.style = def;
  }

  if (record["size"] !== undefined) {
    const size = record["size"];
    if (
      typeof size !== "number" ||
      !Number.isInteger(size) ||
      size < 16 ||
      size > 1024
    ) {
      throw invalid("size must be an integer between 16 and 1024");
    }
    resolved.size = size;
  }

  if (record["animation"] !== undefined) {
    resolved.animation = normalizeAnimation(record["animation"]);
  }

  if (record["palette"] !== undefined) {
    const id = record["palette"];
    if (typeof id !== "string" || !PALETTE_IDS.includes(id)) {
      throw new ValidationError(
        "unknown-palette",
        `unknown palette "${String(id)}". valid palettes: ${PALETTE_IDS.join(", ")}`,
      );
    }
    resolved.overrides = { ...resolved.overrides, palette: id };
  }

  if (record["accent"] !== undefined) {
    const hex = record["accent"];
    if (typeof hex !== "string" || !HEX.test(hex)) {
      throw invalid('accent must be a hex color like "#de5b5b"');
    }
    resolved.overrides = { ...resolved.overrides, accent: hex.toLowerCase() };
  }

  if (record["expression"] !== undefined) {
    const id = record["expression"];
    if (typeof id !== "string" || !EXPRESSION_IDS.includes(id as never)) {
      throw new ValidationError(
        "unknown-trait",
        `unknown expression "${String(id)}". valid expressions: ${EXPRESSION_IDS.join(", ")}`,
      );
    }
    resolved.overrides = {
      ...resolved.overrides,
      expression: id as ExpressionId,
    };
  }

  if (record["background"] !== undefined) {
    resolved.background = normalizeBackground(record["background"]);
  }

  if (record["title"] !== undefined)
    resolved.title = validateLabel("title", record["title"]);
  if (record["desc"] !== undefined)
    resolved.desc = validateLabel("desc", record["desc"]);
  if (record["decorative"] !== undefined) {
    if (typeof record["decorative"] !== "boolean")
      throw invalid("decorative must be a boolean");
    resolved.decorative = record["decorative"];
  }

  // trait family overrides
  for (const family of TRAIT_FAMILY_IDS) {
    const value = record[family];
    if (value === undefined) continue;
    if (typeof value !== "string") {
      throw invalid(`${family} must be a string trait id`);
    }
    checkTraitValue(family, value);
    resolved.overrides = { ...resolved.overrides, [family]: value };
  }

  return resolved;
}
