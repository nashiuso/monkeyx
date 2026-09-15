import { el } from "../svg/elements.js";
import { f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const BODY_IDS = [
  "slim",
  "stocky",
  "oval",
  "slouch",
  "plump",
  "lanky",
] as const;
export type BodyId = (typeof BODY_IDS)[number];

// torso silhouette parameterized from the anchors: rounded shoulders
// flowing into the hips, with a dimensional fur gradient and a lighter
// belly patch. the head overlaps the top of the torso (short integrated neck).
export function torsoPath(
  cx: number,
  top: number,
  sw: number,
  hw: number,
  bottom: number,
): string {
  const h = bottom - top;
  return [
    `M ${f(cx)} ${f(top)}`,
    `C ${f(cx - sw * 0.62)} ${f(top)} ${f(cx - sw * 0.92)} ${f(top + h * 0.12)} ${f(cx - sw)} ${f(top + h * 0.3)}`,
    `C ${f(cx - sw - 3)} ${f(top + h * 0.49)} ${f(cx - sw - 1)} ${f(top + h * 0.68)} ${f(cx - hw * 0.8)} ${f(top + h * 0.83)}`,
    `C ${f(cx - hw * 0.55)} ${f(bottom - h * 0.13)} ${f(cx - hw * 0.3)} ${f(bottom)} ${f(cx)} ${f(bottom)}`,
    `C ${f(cx + hw * 0.3)} ${f(bottom)} ${f(cx + hw * 0.55)} ${f(bottom - h * 0.13)} ${f(cx + hw * 0.8)} ${f(top + h * 0.83)}`,
    `C ${f(cx + sw + 1)} ${f(top + h * 0.68)} ${f(cx + sw + 3)} ${f(top + h * 0.49)} ${f(cx + sw)} ${f(top + h * 0.3)}`,
    `C ${f(cx + sw * 0.92)} ${f(top + h * 0.12)} ${f(cx + sw * 0.62)} ${f(top)} ${f(cx)} ${f(top)}`,
    "Z",
  ].join(" ");
}

export function renderBody(ctx: RenderContext): string {
  const a = ctx.anchors;
  const torso = el("path", {
    d: torsoPath(a.cx, a.torsoTop, a.shoulderW, a.hipW, a.torsoBottom),
    fill: ctx.grad("torso"),
  });
  const belly = el("ellipse", {
    cx: a.cx,
    cy: a.bellyCy,
    rx: a.bellyRx,
    ry: a.bellyRy,
    fill: ctx.grad("belly"),
  });
  // chest fur: two small tufts at the neck, softening the jaw/torso junction
  const tuft = (side: number): string => {
    const x = a.cx + side * 7;
    const y = a.torsoTop + 6;
    return el("path", {
      d: `M ${f(x)} ${f(y)} C ${f(x + side * 1.5)} ${f(y + 5)} ${f(x + side * 3.5)} ${f(y + 8)} ${f(x + side * 5.5)} ${f(y + 9)} C ${f(x + side * 4)} ${f(y + 11)} ${f(x + side * 0.5)} ${f(y + 10.5)} ${f(x - side * 1.5)} ${f(y + 7)} C ${f(x - side * 2.2)} ${f(y + 5)} ${f(x - side * 1.5)} ${f(y + 2)} ${f(x)} ${f(y)} Z`,
      fill: ctx.palette.belly,
      opacity: 0.92,
    });
  };
  return torso + belly + tuft(-1) + tuft(1);
}

defineFamily<BodyId>({
  id: "body",
  label: "Body type",
  salt: 20,
  traits: [
    { id: "slim", label: "Slim" },
    { id: "stocky", label: "Stocky" },
    { id: "oval", label: "Oval" },
    { id: "slouch", label: "Slouch" },
    { id: "plump", label: "Plump" },
    { id: "lanky", label: "Lanky" },
  ],
  hooks: { main: (ctx) => renderBody(ctx) },
});
