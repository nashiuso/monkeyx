// monkeyx styles v3 — design families implemented as render modifiers on
// the same anatomy, never as duplicate renderers.
//
// depth:   how far gradient stops push toward their light/dark tones
//          (1 = full dimensional rendering, lower = flatter, >1 = richer)
// glow:    neon style — emit the accent glow gradient for luminous details
//
// a style may also scope palettes/accents/backgrounds, scale facial line
// weight, shrink the composition and shape selection weights.
// explicit user options always win.

export const STYLE_IDS = [
  "classic",
  "soft",
  "bold",
  "tiny",
  "paper",
  "retro",
  "night",
  "neon",
] as const;

export type StyleId = (typeof STYLE_IDS)[number];

import type { TraitFamilyId } from "../traits/registry.js";
import type { BackgroundStyleId } from "../monkey/background.js";
import { ACCENTS, MUTED_ACCENTS, NEON_ACCENTS } from "../monkey/palettes.js";

export interface StyleDefinition {
  readonly id: StyleId;
  readonly label: string;
  readonly description: string;
  // palette whitelist, or null for all
  readonly palettes: readonly string[] | null;
  // accent pool, or null for the default set
  readonly accents: readonly string[] | null;
  // facial stroke multiplier
  readonly lineWidth: number;
  // dimensional rendering intensity
  readonly depth: number;
  // composition scale for the whole character
  readonly scale: number;
  // multiplies the "none" weight of the given families during selection
  readonly noneWeights: Partial<Record<TraitFamilyId, number>>;
  // background style whitelist, or null for all
  readonly backgrounds: readonly BackgroundStyleId[] | null;
  // pick from dark background tints
  readonly dark: boolean;
  // neon: accent glow gradient available to renderers
  readonly glow: boolean;
  // D3 (2026-09-14): the capuchin cap is part of the core visual language;
  // styles may deliberately omit it (paper) for a cleaner illustration
  // silhouette. never a user-facing trait — style-driven only.
  readonly cap: boolean;
}

export const STYLES: Record<StyleId, StyleDefinition> = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "the signature dimensional monkeyx look",
    palettes: null,
    accents: null,
    lineWidth: 1,
    depth: 1,
    scale: 1,
    noneWeights: {},
    backgrounds: null,
    dark: false,
    glow: false,
    cap: true,
  },
  soft: {
    id: "soft",
    label: "Soft",
    description: "gentle, plush rendering with softened depth",
    palettes: null,
    accents: null,
    lineWidth: 0.92,
    depth: 0.7,
    scale: 1,
    noneWeights: { extra: 1.4 },
    backgrounds: null,
    dark: false,
    glow: false,
    cap: true,
  },
  bold: {
    id: "bold",
    label: "Bold",
    description: "heavy facial ink and saturated fur",
    palettes: ["cocoa", "ginger", "charcoal", "slate", "rust", "plum"],
    accents: null,
    lineWidth: 1.32,
    depth: 0.9,
    scale: 1,
    noneWeights: {},
    backgrounds: ["flat", "gradient"],
    dark: false,
    glow: false,
    cap: true,
  },
  tiny: {
    id: "tiny",
    label: "Tiny",
    description: "a small, simplified companion — collectible scale",
    palettes: null,
    accents: null,
    lineWidth: 1.08,
    depth: 0.85,
    scale: 0.78,
    noneWeights: { clothing: 3, accessory: 3, extra: 3, pattern: 2, hair: 1.6 },
    backgrounds: ["flat"],
    dark: false,
    glow: false,
    cap: true,
  },
  paper: {
    id: "paper",
    label: "Paper",
    description: "muted inks, flat color and a bare fur crown",
    palettes: ["graphite", "snow", "sand", "fog", "slate"],
    accents: MUTED_ACCENTS,
    lineWidth: 1.12,
    depth: 0.3,
    scale: 1,
    noneWeights: { extra: 2, pattern: 1.6 },
    backgrounds: ["flat"],
    dark: false,
    glow: false,
    cap: false,
  },
  retro: {
    id: "retro",
    label: "Retro",
    description: "warm vintage tones, half-dimensioned",
    palettes: ["cocoa", "honey", "sand", "ginger", "moss", "rust", "olive"],
    accents: MUTED_ACCENTS,
    lineWidth: 1,
    depth: 0.55,
    scale: 1,
    noneWeights: {},
    backgrounds: ["flat", "rays"],
    dark: false,
    glow: false,
    cap: true,
  },
  night: {
    id: "night",
    label: "Night",
    description: "deep fur tones and rich shadow on dark grounds",
    palettes: ["charcoal", "slate", "graphite", "plum", "fog"],
    accents: null,
    lineWidth: 0.96,
    depth: 1.12,
    scale: 1,
    noneWeights: {},
    backgrounds: ["flat", "gradient"],
    dark: true,
    glow: false,
    cap: true,
  },
  neon: {
    id: "neon",
    label: "Neon",
    description: "electric accents after dark, restrained glow",
    palettes: ["charcoal", "graphite", "plum", "slate"],
    accents: NEON_ACCENTS,
    lineWidth: 1.14,
    depth: 0.95,
    scale: 1,
    noneWeights: { extra: 0.4 },
    backgrounds: ["flat", "gradient"],
    dark: true,
    glow: true,
    cap: true,
  },
};

// default accent pool reference (kept here so styles own their pools)
export const DEFAULT_ACCENTS = ACCENTS;

export function styleById(id: string): StyleDefinition | undefined {
  return (STYLES as Record<string, StyleDefinition | undefined>)[id];
}
