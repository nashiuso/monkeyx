import { el } from "../svg/elements.js";
import { star, heart, note } from "../svg/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const EXTRA_IDS = [
  "none",
  "blush",
  "freckles",
  "sparkles",
  "hearts",
  "notes",
  "bubbles",
] as const;
export type ExtraId = (typeof EXTRA_IDS)[number];

// sparkles render behind the monkey, before any body parts
export function renderExtraBack(ctx: RenderContext, id: ExtraId): string {
  if (id !== "sparkles") return "";
  const c = ctx.colors.star;
  return star(56, 62, 8, c) + star(198, 46, 6.5, c) + star(184, 100, 4.5, c);
}

// blush and freckles sit on the face plate
export function renderExtraFace(ctx: RenderContext, id: ExtraId): string {
  const a = ctx.anchors;
  const { cx, cy } = a;
  switch (id) {
    case "blush":
      return (
        el("ellipse", {
          cx: cx - a.faceRx * 0.72,
          cy: a.faceCy + a.faceRy * 0.32,
          rx: 6.5,
          ry: 4,
          fill: ctx.colors.blush,
          opacity: 0.55,
        }) +
        el("ellipse", {
          cx: cx + a.faceRx * 0.72,
          cy: a.faceCy + a.faceRy * 0.32,
          rx: 6.5,
          ry: 4,
          fill: ctx.colors.blush,
          opacity: 0.55,
        })
      );
    case "freckles": {
      const dot = (x: number, y: number): string =>
        el("circle", {
          cx: x,
          cy: y,
          r: 1.2,
          fill: ctx.palette.faceDeep,
          opacity: 0.85,
        });
      return (
        dot(cx - 21, cy + 11) +
        dot(cx - 17, cy + 14) +
        dot(cx - 22, cy + 16) +
        dot(cx + 21, cy + 11) +
        dot(cx + 17, cy + 14) +
        dot(cx + 22, cy + 16)
      );
    }
    default:
      return "";
  }
}

// hearts, notes and bubbles float beside the head (front layer)
export function renderExtraFront(ctx: RenderContext, id: ExtraId): string {
  const a = ctx.anchors;
  const { cx, headTop, headRx: rx, cy } = a;
  switch (id) {
    case "hearts":
      return (
        heart(cx + rx + 12, headTop + 10, 1.3, ctx.colors.heart) +
        heart(cx + rx + 24, headTop + 26, 0.95, ctx.colors.heart)
      );
    case "notes":
      return (
        note(cx + rx + 14, headTop + 14, 1, "#3a3f4a") +
        note(cx + rx + 26, headTop + 30, 0.75, "#3a3f4a")
      );
    case "bubbles": {
      const ring = (x: number, y: number, r: number, op: number): string =>
        el("circle", {
          cx: x,
          cy: y,
          r,
          fill: "none",
          stroke: "#8fb6d9",
          "stroke-width": 1.4,
          opacity: op,
        });
      return (
        ring(cx + rx + 14, cy - 6, 5, 0.8) +
        ring(cx + rx + 24, cy - 20, 3.5, 0.65) +
        ring(cx + rx + 20, cy - 34, 2.5, 0.5)
      );
    }
    default:
      return "";
  }
}

defineFamily<ExtraId>({
  id: "extra",
  label: "Extra",
  salt: 25,
  traits: [
    { id: "none", label: "None", weight: 1.6 },
    { id: "blush", label: "Blush" },
    { id: "freckles", label: "Freckles" },
    { id: "sparkles", label: "Sparkles" },
    { id: "hearts", label: "Hearts" },
    { id: "notes", label: "Music notes" },
    { id: "bubbles", label: "Bubbles" },
  ],
  hooks: {
    back: (ctx, id) => renderExtraBack(ctx, id),
    face: (ctx, id) => renderExtraFace(ctx, id),
    front: (ctx, id) => renderExtraFront(ctx, id),
  },
});
