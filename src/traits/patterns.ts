import { el } from "../svg/elements.js";
import { f } from "../monkey/shapes.js";
import { earCenters } from "./ears.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const PATTERN_IDS = [
  "none",
  "saddle",
  "mask",
  "crown",
  "streak",
  "points",
  "dapple",
] as const;
export type PatternId = (typeof PATTERN_IDS)[number];

// fur patterns overlay the skull and torso with deeper or lighter fur.
// head overlays sit between the skull/cap and the face plate so the plate
// always stays clean; body overlays sit on the torso under the arms.

export function renderPatternHead(ctx: RenderContext, id: PatternId): string {
  if (id === "none") return "";
  const a = ctx.anchors;
  const { cx, headRx: rx, headTop } = a;
  const hairline = a.faceCy - a.faceRy - 2;

  switch (id) {
    case "saddle":
      // deep band flowing across the crown, above the hairline
      return el("path", {
        d: [
          `M ${f(cx - rx + 3)} ${f(hairline - 6)}`,
          `C ${f(cx - rx * 0.5)} ${f(headTop + 4)} ${f(cx + rx * 0.5)} ${f(headTop + 4)} ${f(cx + rx - 3)} ${f(hairline - 6)}`,
          `C ${f(cx + rx * 0.55)} ${f(hairline - 16)} ${f(cx - rx * 0.55)} ${f(hairline - 16)} ${f(cx - rx + 3)} ${f(hairline - 6)}`,
          "Z",
        ].join(" "),
        fill: ctx.palette.furDark,
        opacity: 0.85,
      });
    case "mask":
      // dark cheek masses framing the face plate (plate renders on top)
      return (
        el("circle", {
          cx: cx - 15,
          cy: a.faceCy - 8,
          r: 20,
          fill: ctx.palette.furDark,
          opacity: 0.9,
        }) +
        el("circle", {
          cx: cx + 15,
          cy: a.faceCy - 8,
          r: 20,
          fill: ctx.palette.furDark,
          opacity: 0.9,
        })
      );
    case "crown":
      // wide dark crown arc hugging the skull top
      return el("path", {
        d: [
          `M ${f(cx - rx + 2)} ${f(hairline + 2)}`,
          `C ${f(cx - rx * 0.6)} ${f(headTop - 2)} ${f(cx + rx * 0.6)} ${f(headTop - 2)} ${f(cx + rx - 2)} ${f(hairline + 2)}`,
          `C ${f(cx + rx * 0.4)} ${f(headTop + 12)} ${f(cx - rx * 0.4)} ${f(headTop + 12)} ${f(cx - rx + 2)} ${f(hairline + 2)}`,
          "Z",
        ].join(" "),
        fill: ctx.palette.furDark,
        opacity: 0.85,
      });
    case "streak":
      // light blaze down the forehead, over the cap
      return el("path", {
        d: [
          `M ${f(cx - 5)} ${f(headTop + 2)}`,
          `Q ${f(cx)} ${f(headTop - 1)} ${f(cx + 5)} ${f(headTop + 2)}`,
          `L ${f(cx + 7.5)} ${f(hairline - 2)}`,
          `Q ${f(cx)} ${f(hairline + 2)} ${f(cx - 7.5)} ${f(hairline - 2)}`,
          "Z",
        ].join(" "),
        fill: ctx.palette.faceLight,
        opacity: 0.9,
      });
    case "points":
      return renderPoints(ctx);
    default:
      return "";
  }
}

// torso-side pattern overlays, drawn under the arms
export function renderPatternBody(ctx: RenderContext, id: PatternId): string {
  if (id !== "saddle" && id !== "dapple") return "";
  const a = ctx.anchors;
  const { cx } = a;
  const top = a.torsoTop;

  if (id === "saddle") {
    // dark shoulder wrap
    return el("path", {
      d: [
        `M ${f(cx - a.shoulderW - 1)} ${f(top + 17)}`,
        `Q ${f(cx)} ${f(top - 3)} ${f(cx + a.shoulderW + 1)} ${f(top + 17)}`,
        `L ${f(cx + a.shoulderW + 1)} ${f(top + 27)}`,
        `Q ${f(cx)} ${f(top + 8)} ${f(cx - a.shoulderW - 1)} ${f(top + 27)}`,
        "Z",
      ].join(" "),
      fill: ctx.palette.furDark,
      opacity: 0.8,
    });
  }
  // dapple: two soft side spots
  return (
    el("ellipse", {
      cx: cx - a.shoulderW + 7,
      cy: top + 27,
      rx: 7,
      ry: 10,
      fill: ctx.palette.furDark,
      opacity: 0.4,
    }) +
    el("ellipse", {
      cx: cx + a.shoulderW - 7,
      cy: top + 35,
      rx: 6,
      ry: 9,
      fill: ctx.palette.furDark,
      opacity: 0.4,
    })
  );
}

// dark ear-tip overlays for the points pattern, positioned from the ears
// family geometry so they always land on the actual ears
export function renderPoints(ctx: RenderContext): string {
  const centers = earCenters(ctx, ctx.selection.ears);
  const tip = ([x, y]: readonly [number, number]): string =>
    el("circle", {
      cx: x,
      cy: y,
      r: 8,
      fill: ctx.palette.furDark,
      opacity: 0.85,
    });
  return tip(centers[0]!) + tip(centers[1]!);
}

defineFamily<PatternId>({
  id: "pattern",
  label: "Fur pattern",
  salt: 24,
  traits: [
    { id: "none", label: "None", weight: 2.5 },
    { id: "saddle", label: "Saddle" },
    { id: "mask", label: "Mask" },
    { id: "crown", label: "Crown" },
    { id: "streak", label: "Streak" },
    { id: "points", label: "Points" },
    { id: "dapple", label: "Dapple" },
  ],
  hooks: {
    body: (ctx, id) => renderPatternBody(ctx, id),
    head: (ctx, id) => renderPatternHead(ctx, id),
  },
});
