import { el } from "../svg/elements.js";
import { headPath, facePlatePath, capPath, f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const HEAD_IDS = [
  "round",
  "soft",
  "wide",
  "tall",
  "boulder",
  "narrow",
] as const;
export type HeadId = (typeof HEAD_IDS)[number];

// head rendering: organic skull with dimensional fur, the dark capuchin cap
// (the base hair zone — hair traits extend it), the two-lobe face plate,
// and soft cheek fur at the muzzle corners.
export function renderHeadShape(ctx: RenderContext): string {
  const { palette, anchors: a } = ctx;
  const flatness = ctx.selection.head === "boulder" ? 1 : 0;
  const skull = el("path", {
    d: headPath(a.cx, a.cy, a.headRx, a.headRy, flatness),
    fill: ctx.grad("fur"),
  });

  // the cap sits on the crown; its hairline runs just above the face-plate
  // lobes. styles with `cap: false` (paper) omit it: the crown reads as bare
  // fur with a soft crown shading, not as a deleted element
  const hairline = a.faceCy - a.faceRy - 2;
  const cap = ctx.cap
    ? el("path", {
        d: capPath(a.cx, a.headRx, a.headTop - (flatness ? 4 : 0), hairline),
        fill: palette.furDark,
      })
    : crownShade(ctx, a, flatness);

  // restrained specular sweep on the cranium (depth cue, kept subtle)
  const sheen = el("ellipse", {
    cx: a.cx - a.headRx * 0.32,
    cy: a.headTop + a.headRy * 0.32,
    rx: a.headRx * 0.3,
    ry: a.headRy * 0.14,
    fill: "#ffffff",
    opacity: 0.1 * ctx.depth,
  });

  return skull + cap + sheen;
}

// cap-less crowns (paper): a soft, natural crown shade in the palette's deep
// fur — the species marking softened into a print-style two-tone, so the top
// of the head reads as designed rather than removed
function crownShade(
  ctx: RenderContext,
  a: RenderContext["anchors"],
  flatness: number,
): string {
  const { cx, headRx: rx, headTop, faceCy, faceRy } = a;
  const hairline = faceCy - faceRy - 2;
  const topY = headTop - (flatness ? 4 : 0);
  const L = cx - rx + 3;
  const R = cx + rx - 3;
  const side = topY + (hairline - topY) * 0.5;
  const low = topY + (hairline - topY) * 0.78;
  const p = (t: number): number => L + (R - L) * t;
  const d = [
    `M ${f(cx)} ${f(topY)}`,
    `C ${f(cx - rx * 0.6)} ${f(topY)} ${f(L)} ${f(side)} ${f(L)} ${f(low)}`,
    `C ${f(p(0.1))} ${f(low + 6)} ${f(p(0.24))} ${f(low - 4)} ${f(p(0.38))} ${f(low + 2)}`,
    `C ${f(p(0.5))} ${f(low + 6)} ${f(p(0.62))} ${f(low - 4)} ${f(p(0.74))} ${f(low + 1)}`,
    `C ${f(p(0.87))} ${f(low + 5)} ${f(R - 1)} ${f(low)} ${f(R)} ${f(low - 2)}`,
    `C ${f(R)} ${f(side)} ${f(cx + rx * 0.6)} ${f(topY)} ${f(cx)} ${f(topY)}`,
    "Z",
  ].join(" ");
  return el("path", { d, fill: ctx.palette.furDeep, opacity: 0.35 });
}

// the two-lobe face patch with muzzle — the monkeyx signature marking
export function renderFacePatch(ctx: RenderContext): string {
  const { anchors: a } = ctx;
  const plate = el("path", {
    d: facePlatePath(a.faceCx, a.faceCy, a.faceRx, a.faceRy),
    fill: ctx.grad("face"),
  });

  // soft cheek tufts hugging the muzzle corners
  const tuft = (side: number): string => {
    const x = a.faceCx + side * a.faceRx * 0.96;
    const y = a.faceCy + a.faceRy * 0.18;
    const w = 7.5;
    const h = 6;
    const parts = [
      `M ${f(x - side * w * 0.15)} ${f(y - h * 0.6)}`,
      `C ${f(x - side * w)} ${f(y - h * 0.75)} ${f(x - side * w * 1.35)} ${f(y - h * 0.1)} ${f(x - side * w * 1.15)} ${f(y + h * 0.3)}`,
      `C ${f(x - side * w * 1.55)} ${f(y + h * 0.45)} ${f(x - side * w * 1.6)} ${f(y + h * 1.0)} ${f(x - side * w * 1.15)} ${f(y + h * 1.1)}`,
      `C ${f(x - side * w * 1.35)} ${f(y + h * 1.6)} ${f(x - side * w * 0.8)} ${f(y + h * 1.9)} ${f(x - side * w * 0.4)} ${f(y + h * 1.55)}`,
      `C ${f(x - side * w * 0.55)} ${f(y + h * 0.9)} ${f(x - side * w * 0.35)} ${f(y + h * 0.3)} ${f(x - side * w * 0.15)} ${f(y - h * 0.6)}`,
      "Z",
    ];
    return el("path", { d: parts.join(" "), fill: ctx.palette.fur });
  };
  return plate + tuft(-1) + tuft(1);
}

defineFamily<HeadId>({
  id: "head",
  label: "Head shape",
  salt: 10,
  traits: [
    { id: "round", label: "Round" },
    { id: "soft", label: "Soft" },
    { id: "wide", label: "Wide" },
    { id: "tall", label: "Tall" },
    { id: "boulder", label: "Boulder" },
    { id: "narrow", label: "Narrow" },
  ],
  hooks: {
    main: (ctx) => renderHeadShape(ctx),
    face: (ctx) => renderFacePatch(ctx),
  },
});
