import { el } from "../svg/elements.js";
import { f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const MOUTH_IDS = [
  "smile",
  "grin",
  "laugh",
  "smirk",
  "neutral",
  "ooh",
  "gasp",
  "frown",
  "tongue",
  "pout",
  "yum",
  "grin-wide",
] as const;
export type MouthId = (typeof MOUTH_IDS)[number];

// mouths are filled, tapered forms (not flat strokes) so they keep weight
// at avatar scale and read as part of a dimensional face.
export function renderMouth(ctx: RenderContext, id: MouthId): string {
  const { anchors, colors } = ctx;
  const { cx } = anchors;
  const my = anchors.mouthY + ctx.rng.range(-1, 1);
  const ink = colors.ink;

  const crescent = (w: number, d: number, depth: number): string =>
    el("path", {
      d: `M ${f(cx - w)} ${f(my + d)} Q ${f(cx)} ${f(my + d + depth)} ${f(cx + w)} ${f(my + d)} Q ${f(cx)} ${f(my + d + depth * 0.55)} ${f(cx - w)} ${f(my + d)} Z`,
      fill: ink,
      opacity: 0.85,
    });

  const teeth = (w: number, y: number, h: number): string =>
    el("rect", {
      x: cx - w,
      y,
      width: w * 2,
      height: h,
      rx: h / 2,
      fill: colors.white,
    });

  const tongue = (cy: number, rx: number, ry: number): string =>
    el("ellipse", { cx, cy, rx, ry, fill: colors.tongue });

  switch (id) {
    case "smile":
      return crescent(8.5, 0, 8.5);
    case "grin":
      return (
        el("path", {
          d: `M ${f(cx - 10)} ${f(my - 1)} Q ${f(cx)} ${f(my + 10)} ${f(cx + 10)} ${f(my - 1)} Z`,
          fill: ink,
          opacity: 0.88,
        }) + teeth(5.5, my - 0.5, 3.2)
      );
    case "grin-wide":
      return (
        el("path", {
          d: `M ${f(cx - 13)} ${f(my - 2)} Q ${f(cx)} ${f(my + 11)} ${f(cx + 13)} ${f(my - 2)} Z`,
          fill: ink,
          opacity: 0.88,
        }) +
        teeth(8, my - 1.5, 3.6) +
        tongue(my + 6, 3.8, 2.3)
      );
    case "laugh":
      return (
        el("path", {
          d: `M ${f(cx - 10.5)} ${f(my - 2)} Q ${f(cx)} ${f(my + 14)} ${f(cx + 10.5)} ${f(my - 2)} Z`,
          fill: ink,
          opacity: 0.88,
        }) +
        teeth(6, my - 1.5, 3.6) +
        tongue(my + 7.5, 4.6, 2.8)
      );
    case "smirk":
      return el("path", {
        d: `M ${f(cx - 7.5)} ${f(my + 2)} Q ${f(cx + 1)} ${f(my + 6.5)} ${f(cx + 8.5)} ${f(my - 2)} Q ${f(cx + 1.5)} ${f(my + 3.5)} ${f(cx - 7.5)} ${f(my + 2)} Z`,
        fill: ink,
        opacity: 0.85,
      });
    case "neutral":
      return el("path", {
        d: `M ${f(cx - 5.5)} ${f(my + 1)} Q ${f(cx)} ${f(my + 2.2)} ${f(cx + 5.5)} ${f(my + 1)}`,
        stroke: ink,
        "stroke-width": ctx.line(2.6),
        "stroke-linecap": "round",
        fill: "none",
        opacity: 0.85,
      });
    case "ooh":
      return el("ellipse", {
        cx,
        cy: my + 1,
        rx: 3.6,
        ry: 4.2,
        fill: ink,
        opacity: 0.9,
      });
    case "gasp":
      return (
        el("ellipse", {
          cx,
          cy: my + 1,
          rx: 4.8,
          ry: 5.6,
          fill: ink,
          opacity: 0.9,
        }) + tongue(my + 4.6, 2.8, 1.8)
      );
    case "frown":
      return el("path", {
        d: `M ${f(cx - 7.5)} ${f(my + 2.5)} Q ${f(cx)} ${f(my - 3)} ${f(cx + 7.5)} ${f(my + 2.5)} Q ${f(cx)} ${f(my - 0.6)} ${f(cx - 7.5)} ${f(my + 2.5)} Z`,
        fill: ink,
        opacity: 0.85,
      });
    case "pout":
      return (
        el("path", {
          d: `M ${f(cx - 5.5)} ${f(my)} Q ${f(cx)} ${f(my - 3)} ${f(cx + 5.5)} ${f(my)} Q ${f(cx)} ${f(my - 0.8)} ${f(cx - 5.5)} ${f(my)} Z`,
          fill: ink,
          opacity: 0.85,
        }) +
        el("ellipse", {
          cx,
          cy: my + 3.6,
          rx: 2.6,
          ry: 1.8,
          fill: colors.tongue,
          opacity: 0.85,
        })
      );
    case "tongue":
      return (
        crescent(8.5, -0.5, 7) +
        el("path", {
          d: `M ${f(cx + 1)} ${f(my + 5.5)} C ${f(cx + 1)} ${f(my + 10)} ${f(cx + 7)} ${f(my + 10)} ${f(cx + 7)} ${f(my + 5.8)} C ${f(cx + 7)} ${f(my + 3.5)} ${f(cx + 4.5)} ${f(my + 3)} ${f(cx + 1)} ${f(my + 5.5)} Z`,
          fill: colors.tongue,
        }) +
        el("path", {
          d: `M ${f(cx + 4)} ${f(my + 4.8)} L ${f(cx + 4)} ${f(my + 8.5)}`,
          stroke: ink,
          "stroke-width": 0.8,
          opacity: 0.35,
          "stroke-linecap": "round",
        })
      );
    case "yum":
      return (
        crescent(7, 0.5, 6) +
        el("path", {
          d: `M ${f(cx - 2)} ${f(my + 5.5)} C ${f(cx - 2)} ${f(my + 9.5)} ${f(cx + 4)} ${f(my + 9.5)} ${f(cx + 4)} ${f(my + 6)} C ${f(cx + 4)} ${f(my + 3.8)} ${f(cx + 1.5)} ${f(my + 3.2)} ${f(cx - 2)} ${f(my + 5.5)} Z`,
          fill: colors.tongue,
        })
      );
  }
}

defineFamily<MouthId>({
  id: "mouth",
  label: "Mouth",
  salt: 15,
  traits: [
    { id: "smile", label: "Smile", weight: 1.6 },
    { id: "grin", label: "Grin" },
    { id: "laugh", label: "Laugh" },
    { id: "smirk", label: "Smirk" },
    { id: "neutral", label: "Neutral", weight: 0.8 },
    { id: "ooh", label: "Ooh" },
    { id: "frown", label: "Frown" },
    { id: "tongue", label: "Tongue out" },
    { id: "gasp", label: "Gasp" },
    { id: "pout", label: "Pout" },
    { id: "yum", label: "Yum" },
    { id: "grin-wide", label: "Big grin" },
  ],
  hooks: { main: (ctx, id) => renderMouth(ctx, id) },
});
