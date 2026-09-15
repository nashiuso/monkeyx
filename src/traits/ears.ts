import { el } from "../svg/elements.js";
import { earPath } from "../monkey/shapes.js";
import { mixHex } from "../monkey/palettes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const EARS_IDS = [
  "round",
  "big",
  "small",
  "tall",
  "fluffy",
  "low",
] as const;
export type EarsId = (typeof EARS_IDS)[number];

interface EarGeom {
  readonly dx: number;
  readonly cy: number;
  readonly r: number;
  readonly tall: boolean;
  readonly fluffy: boolean;
}

// ear geometry per variant; every size overlaps the skull naturally
function earGeom(ctx: RenderContext, id: EarsId): EarGeom {
  const { anchors: a } = ctx;
  switch (id) {
    case "round":
      return {
        dx: a.earDx,
        cy: a.earCy,
        r: a.earR,
        tall: false,
        fluffy: false,
      };
    case "big":
      return {
        dx: a.earDx - 4,
        cy: a.earCy,
        r: a.earR + 6,
        tall: false,
        fluffy: false,
      };
    case "small":
      return {
        dx: a.earDx + 3,
        cy: a.earCy,
        r: a.earR - 3,
        tall: false,
        fluffy: false,
      };
    case "tall":
      return {
        dx: a.earDx - 1,
        cy: a.earCy - 2,
        r: a.earR + 3,
        tall: true,
        fluffy: false,
      };
    case "fluffy":
      return {
        dx: a.earDx - 2,
        cy: a.earCy,
        r: a.earR + 4,
        tall: false,
        fluffy: true,
      };
    case "low":
      return {
        dx: a.earDx,
        cy: a.earCy + 11,
        r: a.earR - 1,
        tall: false,
        fluffy: false,
      };
  }
}

function outer(ctx: RenderContext, g: EarGeom, side: number): string {
  const cx = ctx.anchors.cx + side * g.dx;
  if (g.tall) {
    return el("ellipse", {
      cx,
      cy: g.cy,
      rx: g.r * 0.62,
      ry: g.r,
      fill: ctx.grad("ear"),
    });
  }
  return el("path", { d: earPath(cx, g.cy, g.r, side), fill: ctx.grad("ear") });
}

function inner(ctx: RenderContext, g: EarGeom, side: number): string {
  const cx = ctx.anchors.cx + side * g.dx;
  if (g.fluffy) {
    // inner fur: three soft rays
    const rays: string[] = [];
    for (const [ox, oy, rr] of [
      [-4, -3, 3.4],
      [3.5, -4, 3],
      [0, 4, 3.2],
    ] as const) {
      rays.push(
        el("circle", {
          cx: cx + ox,
          cy: g.cy + oy,
          r: rr,
          fill: ctx.palette.inner,
        }),
      );
    }
    return rays.join("");
  }
  const ry = g.tall ? g.r * 0.52 : g.r * 0.6;
  const rx = g.tall ? g.r * 0.62 * 0.52 : g.r * 0.52;
  // soft inner ear: light base + subtle warm center, never a ring
  return (
    el("ellipse", {
      cx: cx + side * 1,
      cy: g.cy,
      rx,
      ry,
      fill: ctx.palette.inner,
    }) +
    el("ellipse", {
      cx: cx + side * 1.3,
      cy: g.cy + 0.8,
      rx: rx * 0.52,
      ry: ry * 0.5,
      fill: mixHex(ctx.palette.inner, ctx.palette.faceDeep, 0.45),
      opacity: 0.55,
    })
  );
}

export function renderEars(ctx: RenderContext, id: EarsId): string {
  const g = earGeom(ctx, id);
  return (
    outer(ctx, g, -1) + inner(ctx, g, -1) + outer(ctx, g, 1) + inner(ctx, g, 1)
  );
}

// ear centers, used by the points pattern and earrings
export function earCenters(
  ctx: RenderContext,
  id: EarsId,
): readonly (readonly [number, number])[] {
  const g = earGeom(ctx, id);
  const { cx } = ctx.anchors;
  return [
    [cx - g.dx, g.cy],
    [cx + g.dx, g.cy],
  ];
}

defineFamily<EarsId>({
  id: "ears",
  label: "Ears",
  salt: 11,
  traits: [
    { id: "round", label: "Round" },
    { id: "big", label: "Big" },
    { id: "small", label: "Small" },
    { id: "tall", label: "Tall" },
    { id: "fluffy", label: "Fluffy" },
    { id: "low", label: "Low" },
  ],
  hooks: { main: (ctx, id) => renderEars(ctx, id) },
});
