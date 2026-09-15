import type { Rng } from "../seed/rng.js";
import type { Anchors } from "../monkey/geometry.js";
import type { Palette } from "../monkey/palettes.js";
import type { TraitSelection } from "./select.js";

// resolved colors for a single avatar render
export interface AvatarColors {
  readonly ink: string;
  readonly white: string;
  readonly accent: string;
  readonly hair: string;
  readonly background: string;
  readonly backgroundLight: string;
  readonly star: string;
  readonly heart: string;
  readonly tongue: string;
  readonly blush: string;
}

// everything a trait renderer needs; renderers never touch global state
export interface RenderContext {
  // family-scoped rng for continuous jitter (independent of trait picks)
  readonly rng: Rng;
  readonly palette: Palette;
  readonly anchors: Anchors;
  // per-avatar namespace prefix, derived from the seed hash
  readonly prefix: string;
  readonly colors: AvatarColors;
  // the full resolved selection; renderers may read sibling traits to adapt
  readonly selection: TraitSelection;
  // active animation presets and their speed multiplier
  readonly animations: ReadonlySet<string>;
  readonly speed: number;
  // stroke width scaled by the active style's line weight
  readonly line: (base: number) => number;
  // renderers push per-avatar css (e.g. an arm pivot) consumed by the style block
  readonly extraCss: string[];
  // ---- v3 depth system ----
  // style depth factor: 1 = full dimensional rendering, <1 flatter, >1 richer
  readonly depth: number;
  // D3: whether this style renders the capuchin cap on the crown
  readonly cap: boolean;
  // gradient id helpers (namespaced per avatar, resolved from this render's palette)
  readonly grad: (name: string) => string;
}
