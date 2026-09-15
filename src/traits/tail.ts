import { el } from "../svg/elements.js";
import { tubePath, f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const TAIL_IDS = [
  "curl",
  "hook",
  "spiral",
  "wag",
  "double",
  "fluffy",
  "question",
] as const;
export type TailId = (typeof TAIL_IDS)[number];

// tails are tapered tubes rooted at the lower right of the torso (drawn
// behind the body) with a rounded tip tuft; the curve is the character cue.
interface TailShape {
  readonly joints: readonly (readonly [number, number])[];
  readonly w0: number;
  readonly w1: number;
  // tip tuft: center + size + tilt
  readonly tuft?: readonly [number, number, number, number, number];
  // extra dot (question mark)
  readonly dot?: readonly [number, number];
}

function tailShape(ctx: RenderContext, id: TailId): TailShape {
  const a = ctx.anchors;
  const sx = a.cx + a.hipW * 0.72;
  const sy = a.torsoBottom - 16;
  switch (id) {
    case "curl":
      return {
        joints: [
          [sx, sy],
          [sx + 28, sy - 7],
          [sx + 37, sy - 29],
          [sx + 32, sy - 47],
        ],
        w0: 10,
        w1: 4,
        tuft: [sx + 31, sy - 50, 5.5, 6.5, -28],
      };
    case "hook":
      return {
        joints: [
          [sx, sy],
          [sx + 30, sy - 9],
          [sx + 38, sy - 33],
          [sx + 29, sy - 51],
        ],
        w0: 9.5,
        w1: 3.5,
      };
    case "spiral":
      return {
        joints: [
          [sx, sy],
          [sx + 30, sy - 8],
          [sx + 36, sy - 33],
          [sx + 18, sy - 45],
          [sx + 6, sy - 33],
        ],
        w0: 9,
        w1: 3,
      };
    case "wag":
      return {
        joints: [
          [sx, sy],
          [sx + 24, sy + 3],
          [sx + 36, sy - 11],
          [sx + 37, sy - 30],
        ],
        w0: 9.5,
        w1: 4,
      };
    case "double":
      return {
        joints: [
          [sx, sy],
          [sx + 28, sy - 8],
          [sx + 22, sy - 29],
          [sx + 34, sy - 45],
        ],
        w0: 9,
        w1: 3.5,
      };
    case "fluffy":
      return {
        joints: [
          [sx, sy],
          [sx + 24, sy - 9],
          [sx + 32, sy - 29],
        ],
        w0: 13,
        w1: 8,
        tuft: [sx + 33, sy - 33, 8, 9, -18],
      };
    case "question":
      return {
        joints: [
          [sx, sy],
          [sx + 28, sy - 9],
          [sx + 36, sy - 35],
          [sx + 24, sy - 51],
        ],
        w0: 9,
        w1: 3.5,
        dot: [sx + 25, sy - 62],
      };
  }
}

export function renderTail(ctx: RenderContext, id: TailId): string {
  const t = tailShape(ctx, id);
  const fill = ctx.palette.furDark;
  const tube = el("path", { d: tubePath(t.joints, t.w0, t.w1), fill });
  let tip = "";
  if (t.tuft) {
    const [tx, ty, rx, ry, rot] = t.tuft;
    tip = el("ellipse", {
      cx: tx,
      cy: ty,
      rx,
      ry,
      fill,
      transform: `rotate(${rot} ${f(tx)} ${f(ty)})`,
    });
  }
  if (t.dot) {
    tip += el("circle", { cx: t.dot[0], cy: t.dot[1], r: 3.2, fill });
  }
  return tube + tip;
}

defineFamily<TailId>({
  id: "tail",
  label: "Tail",
  salt: 19,
  traits: [
    { id: "curl", label: "Curl" },
    { id: "hook", label: "Hook" },
    { id: "spiral", label: "Spiral" },
    { id: "wag", label: "Wag" },
    { id: "double", label: "Double bend" },
    { id: "fluffy", label: "Fluffy" },
    { id: "question", label: "Question" },
  ],
  hooks: { main: (ctx, id) => renderTail(ctx, id) },
});
