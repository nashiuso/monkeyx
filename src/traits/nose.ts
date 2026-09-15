import { el } from "../svg/elements.js";
import { heart } from "../svg/shapes.js";
import { f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const NOSE_IDS = ["dots", "oval", "wide", "heart"] as const;
export type NoseId = (typeof NOSE_IDS)[number];

// the nose sits on the muzzle above every mouth, tying expressions together.
// a subtle tonal bridge + readable nostrils — never a flat blob.
export function renderNose(ctx: RenderContext, id: NoseId): string {
  const { anchors, palette } = ctx;
  const { cx } = anchors;
  const y = anchors.noseY + ctx.rng.range(-0.6, 0.6);
  const ink = ctx.colors.ink;

  const bridge = (rx: number): string =>
    el("path", {
      d: `M ${f(cx - rx)} ${f(y - 4)} Q ${f(cx)} ${f(y - 6)} ${f(cx + rx)} ${f(y - 4)} Q ${f(cx)} ${f(y - 2.5)} ${f(cx - rx)} ${f(y - 4)} Z`,
      fill: palette.faceDeep,
      opacity: 0.5,
    });

  const nostrils = (dx: number, rx: number, ry: number): string =>
    el("ellipse", { cx: cx - dx, cy: y, rx, ry, fill: ink, opacity: 0.75 }) +
    el("ellipse", { cx: cx + dx, cy: y, rx, ry, fill: ink, opacity: 0.75 });

  switch (id) {
    case "dots":
      return bridge(3.5) + nostrils(4.2, 1.9, 2.4);
    case "oval":
      return (
        bridge(3) +
        el("ellipse", {
          cx,
          cy: y + 1.5,
          rx: 3,
          ry: 3.8,
          fill: palette.faceDeep,
          opacity: 0.65,
        }) +
        el("ellipse", {
          cx: cx - 1.4,
          cy: y + 2,
          rx: 1.2,
          ry: 1.5,
          fill: ink,
          opacity: 0.7,
        }) +
        el("ellipse", {
          cx: cx + 1.4,
          cy: y + 2,
          rx: 1.2,
          ry: 1.5,
          fill: ink,
          opacity: 0.7,
        })
      );
    case "wide":
      return bridge(6) + nostrils(5.5, 2.3, 2);
    case "heart":
      return bridge(3) + heart(cx, y + 0.5, 0.85, palette.faceDeep);
  }
}

defineFamily<NoseId>({
  id: "nose",
  label: "Nose",
  salt: 23,
  traits: [
    { id: "dots", label: "Dots", weight: 2 },
    { id: "oval", label: "Oval" },
    { id: "wide", label: "Wide" },
    { id: "heart", label: "Heart" },
  ],
  hooks: { main: (ctx, id) => renderNose(ctx, id) },
});
