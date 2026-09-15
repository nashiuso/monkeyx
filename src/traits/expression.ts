import type { EyesId } from "./eyes.js";
import type { BrowsId } from "./brows.js";
import type { MouthId } from "./mouth.js";

// expression archetypes constrain eyes + brows + mouth to compatible
// subsets, so generated faces stay emotionally coherent
export const EXPRESSION_IDS = [
  "happy",
  "chill",
  "cheeky",
  "grumpy",
  "surprised",
  "sleepy",
] as const;
export type ExpressionId = (typeof EXPRESSION_IDS)[number];

export interface ExpressionArchetype {
  readonly eyes: readonly EyesId[];
  readonly brows: readonly BrowsId[];
  readonly mouth: readonly MouthId[];
}

export const EXPRESSIONS: Record<ExpressionId, ExpressionArchetype> = {
  happy: {
    eyes: ["dot", "ring", "happy", "wide", "star", "heart", "lash"],
    brows: ["none", "soft", "raised", "thick"],
    mouth: ["smile", "grin", "laugh", "tongue", "grin-wide", "yum"],
  },
  chill: {
    eyes: ["dot", "ring", "sleepy", "happy", "side", "lash"],
    brows: ["none", "soft", "thick"],
    mouth: ["smile", "smirk", "neutral", "yum"],
  },
  cheeky: {
    eyes: ["wink", "dot", "ring", "side", "heart"],
    brows: ["raised", "soft", "serious", "curious"],
    mouth: ["smirk", "grin", "tongue", "yum", "grin-wide"],
  },
  grumpy: {
    eyes: ["dot", "sleepy", "ring", "side"],
    brows: ["serious", "uni", "worried", "thick"],
    mouth: ["frown", "neutral", "pout"],
  },
  surprised: {
    eyes: ["wide", "ring", "dot", "star"],
    brows: ["raised", "worried", "curious"],
    mouth: ["ooh", "gasp", "smile"],
  },
  sleepy: {
    eyes: ["sleepy", "lash"],
    brows: ["soft", "none", "worried"],
    mouth: ["neutral", "smile", "ooh", "pout"],
  },
};
