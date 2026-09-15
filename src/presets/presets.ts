import type { TraitFamilyId } from "../traits/registry.js";
import type { BackgroundStyleId } from "../monkey/background.js";

export const PRESET_IDS = [
  "default",
  "minimal",
  "playful",
  "monochrome",
] as const;
export type PresetId = (typeof PRESET_IDS)[number];

// presets shape selection probabilities, never override explicit options.
// styles (the visual design families) are a separate dimension.
export interface PresetDefinition {
  readonly id: PresetId;
  readonly label: string;
  readonly description: string;
  // multiplies the "none" weight of the given families during selection
  readonly noneWeights: Partial<Record<TraitFamilyId, number>>;
  // restricted background styles, or null for all
  readonly backgroundStyles: readonly BackgroundStyleId[] | null;
  // forced fur palette, or null for any
  readonly forcedPalette: string | null;
}

export const PRESETS: Record<PresetId, PresetDefinition> = {
  default: {
    id: "default",
    label: "Default",
    description: "balanced mix of every trait family",
    noneWeights: {},
    backgroundStyles: null,
    forcedPalette: null,
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description:
      "clean monkeys without clothing, accessories or busy backgrounds",
    noneWeights: { clothing: 2.5, accessory: 1.5, extra: 1.5, pattern: 2 },
    backgroundStyles: ["flat", "ring"],
    forcedPalette: null,
  },
  playful: {
    id: "playful",
    label: "Playful",
    description: "more clothing, accessories and decorations",
    noneWeights: { clothing: 0.4, accessory: 0.3, extra: 0.4, pattern: 0.7 },
    backgroundStyles: null,
    forcedPalette: null,
  },
  monochrome: {
    id: "monochrome",
    label: "Monochrome",
    description: "grayscale fur palette for neutral contexts",
    noneWeights: {},
    backgroundStyles: null,
    forcedPalette: "graphite",
  },
};

export function getPreset(id: string): PresetDefinition | undefined {
  return (PRESETS as Record<string, PresetDefinition | undefined>)[id];
}
