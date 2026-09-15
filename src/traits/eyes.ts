import { el } from "../svg/elements.js";
import { star5, heart } from "../svg/shapes.js";
import { f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const EYES_IDS = [
  "dot",
  "ring",
  "happy",
  "sleepy",
  "wink",
  "wide",
  "side",
  "star",
  "heart",
  "lash",
] as const;
export type EyesId = (typeof EYES_IDS)[number];

// a dimensional open eye: socket shading, sclera, iris/pupil hierarchy,
// dual highlights and a soft upper-lid line. the alive look comes from the
// highlight pair, not from size.
function openEye(
  ctx: RenderContext,
  ex: number,
  y: number,
  scale: number,
  pupilShiftX: number,
): string {
  const { palette } = ctx;
  const rx = 9.5 * scale;
  const ry = 10.5 * scale;
  const irisR = 6.6 * scale;
  const px = ex + pupilShiftX;
  return (
    // eye socket
    el("ellipse", {
      cx: ex,
      cy: y + 1,
      rx: rx + 1.5,
      ry: ry + 0.5,
      fill: palette.faceDeep,
      opacity: 0.28,
    }) +
    // sclera
    el("ellipse", { cx: ex, cy: y, rx, ry, fill: "#fdf6ea" }) +
    // iris + pupil
    el("circle", {
      cx: px,
      cy: y + 0.5 * scale,
      r: irisR,
      fill: palette.iris,
    }) +
    el("circle", {
      cx: px,
      cy: y + 0.5 * scale,
      r: irisR * 0.48,
      fill: "#201409",
    }) +
    // highlights
    el("circle", {
      cx: px - 2.2 * scale,
      cy: y - 1.8 * scale,
      r: 2 * scale,
      fill: "#fdf6ea",
      opacity: 0.95,
    }) +
    el("circle", {
      cx: px + 2.4 * scale,
      cy: y + 3.2 * scale,
      r: 0.9 * scale,
      fill: "#fdf6ea",
      opacity: 0.7,
    }) +
    // upper lid
    el("path", {
      d: `M ${f(ex - rx * 0.95)} ${f(y - ry * 0.42)} Q ${f(ex)} ${f(y - ry * 1.05)} ${f(ex + rx * 0.95)} ${f(y - ry * 0.42)}`,
      fill: "none",
      stroke: palette.faceDeep,
      "stroke-width": 1.6 * ctx.line(1),
      "stroke-linecap": "round",
      opacity: 0.55,
    })
  );
}

// a deliberately simple dark eye (no sclera) — the 'dot' style
function dotEye(ctx: RenderContext, ex: number, y: number): string {
  return (
    el("circle", { cx: ex, cy: y, r: 4.8, fill: ctx.palette.iris }) +
    el("circle", {
      cx: ex - 1.6,
      cy: y - 1.7,
      r: 1.6,
      fill: "#fdf6ea",
      opacity: 0.9,
    })
  );
}

// closed-eye arc: happy bends up, sleepy lids droop down
function arcEye(
  ctx: RenderContext,
  ex: number,
  y: number,
  bendUp: boolean,
): string {
  const dir = bendUp ? -1 : 1;
  const d = `M ${f(ex - 6.8)} ${f(y + 2.8 * dir)} Q ${f(ex)} ${f(y - 5.5 * dir)} ${f(ex + 6.8)} ${f(y + 2.8 * dir)}`;
  return el("path", {
    d,
    fill: "none",
    stroke: ctx.palette.iris,
    "stroke-width": ctx.line(3.4),
    "stroke-linecap": "round",
  });
}

function lashes(
  ctx: RenderContext,
  ex: number,
  top: number,
  dir: number,
): string {
  return (
    el("path", {
      d: `M ${f(ex + dir * 5)} ${f(top + 3)} L ${f(ex + dir * 8)} ${f(top)}`,
      stroke: ctx.palette.iris,
      "stroke-width": 1.7,
      "stroke-linecap": "round",
      fill: "none",
    }) +
    el("path", {
      d: `M ${f(ex + dir * 6.5)} ${f(top + 6)} L ${f(ex + dir * 10)} ${f(top + 4.5)}`,
      stroke: ctx.palette.iris,
      "stroke-width": 1.7,
      "stroke-linecap": "round",
      fill: "none",
    })
  );
}

function renderEye(
  ctx: RenderContext,
  ex: number,
  y: number,
  id: EyesId,
  left: boolean,
): string {
  const shift = id === "side" ? (left ? 2.6 : 2.6) : 0;
  switch (id) {
    case "dot":
      return dotEye(ctx, ex, y);
    case "ring":
      return openEye(ctx, ex, y, 0.86, 0);
    case "wide":
      return openEye(ctx, ex, y, 1.12, 0);
    case "side":
      return openEye(ctx, ex, y, 0.95, shift);
    case "star":
      return openEye(ctx, ex, y, 0.98, 0) + star5(ex, y + 0.3, 3.6, "#ffd166");
    case "heart":
      return (
        openEye(ctx, ex, y, 0.98, 0) +
        heart(ex, y + 1.2, 1.15, ctx.colors.heart)
      );
    case "happy":
      return arcEye(ctx, ex, y, true);
    case "sleepy":
      // half-closed: open eye under a heavy lowered lid
      return (
        openEye(ctx, ex, y, 1, 0) +
        el("path", {
          d: `M ${f(ex - 10)} ${f(y - 1.5)} Q ${f(ex)} ${f(y - 4.5)} ${f(ex + 10)} ${f(y - 1.5)} L ${f(ex + 10)} ${f(y - 9)} L ${f(ex - 10)} ${f(y - 9)} Z`,
          fill: ctx.palette.face,
          opacity: 0.96,
        }) +
        el("path", {
          d: `M ${f(ex - 10)} ${f(y - 1.5)} Q ${f(ex)} ${f(y - 4.5)} ${f(ex + 10)} ${f(y - 1.5)}`,
          fill: "none",
          stroke: ctx.palette.faceDeep,
          "stroke-width": 1.6,
          "stroke-linecap": "round",
          opacity: 0.7,
        })
      );
    case "wink":
      return left ? arcEye(ctx, ex, y, true) : dotEye(ctx, ex, y);
    case "lash":
      return arcEye(ctx, ex, y, true) + lashes(ctx, ex, y - 1, left ? -1 : 1);
  }
}

export function renderEyes(ctx: RenderContext, id: EyesId): string {
  const { anchors } = ctx;
  // subtle per-avatar jitter keeps repeated trait picks from feeling cloned
  const dx = anchors.eyeDx + ctx.rng.range(-1.5, 1.5);
  const y = anchors.eyeY + ctx.rng.range(-1, 1);
  const { cx } = anchors;
  return (
    renderEye(ctx, cx - dx, y, id, true) + renderEye(ctx, cx + dx, y, id, false)
  );
}

defineFamily<EyesId>({
  id: "eyes",
  label: "Eyes",
  salt: 12,
  traits: [
    { id: "dot", label: "Dot" },
    { id: "ring", label: "Ring" },
    { id: "happy", label: "Happy" },
    { id: "sleepy", label: "Sleepy" },
    { id: "wink", label: "Wink" },
    { id: "wide", label: "Wide" },
    { id: "side", label: "Side glance" },
    { id: "star", label: "Star" },
    { id: "heart", label: "Heart" },
    { id: "lash", label: "Lashed" },
  ],
  hooks: { main: (ctx, id) => renderEyes(ctx, id) },
});
