import { el } from "../svg/elements.js";
import { round2 } from "../utils/math.js";
import type { RenderContext } from "../traits/types.js";

export const BACKGROUND_STYLE_IDS = [
  "flat",
  "gradient",
  "rays",
  "ring",
  "dots",
] as const;
export type BackgroundStyleId = (typeof BACKGROUND_STYLE_IDS)[number];

function n(v: number): string {
  return String(round2(v));
}

function flatRect(color: string): string {
  return el("rect", { x: 0, y: 0, width: 256, height: 256, fill: color });
}

// decorative background behind the monkey; uses the palette's deep shade at
// low opacity so every style stays subtle on any tint
export function renderBackground(
  ctx: RenderContext,
  style: BackgroundStyleId,
): string {
  const bg = ctx.colors.background;
  const deco = { fill: ctx.palette.furDeep, opacity: 0.09 } as const;

  switch (style) {
    case "flat":
      return flatRect(bg);
    case "gradient":
      return (
        el(
          "defs",
          {},
          el(
            "radialGradient",
            { id: `${ctx.prefix}-bg`, cx: "50%", cy: "40%", r: "75%" },
            el("stop", {
              offset: "0%",
              "stop-color": ctx.colors.backgroundLight,
            }),
            el("stop", { offset: "100%", "stop-color": bg }),
          ),
        ) +
        el("rect", {
          x: 0,
          y: 0,
          width: 256,
          height: 256,
          fill: `url(#${ctx.prefix}-bg)`,
        })
      );
    case "rays": {
      const cx = 128;
      const cy = 108;
      const r = 320;
      const offset = ctx.rng.range(-20, 20);
      const rays: string[] = [];
      for (let i = 0; i < 6; i++) {
        const mid = (-90 + i * 60 + offset) * (Math.PI / 180);
        const a0 = mid - 0.19;
        const a1 = mid + 0.19;
        rays.push(
          el("path", {
            d: `M ${n(cx)} ${n(cy)} L ${n(cx + r * Math.cos(a0))} ${n(cy + r * Math.sin(a0))} L ${n(cx + r * Math.cos(a1))} ${n(cy + r * Math.sin(a1))} Z`,
            ...deco,
          }),
        );
      }
      return flatRect(bg) + rays.join("");
    }
    case "ring":
      return (
        flatRect(bg) +
        el("circle", {
          cx: 128,
          cy: 112,
          r: 62,
          fill: "none",
          stroke: ctx.palette.furDeep,
          "stroke-width": 10,
          opacity: 0.09,
        }) +
        el("circle", {
          cx: 128,
          cy: 112,
          r: 92,
          fill: "none",
          stroke: ctx.palette.furDeep,
          "stroke-width": 10,
          opacity: 0.07,
        })
      );
    case "dots": {
      const dots: string[] = [];
      for (let iy = 0; iy < 7; iy++) {
        for (let ix = 0; ix < 7; ix++) {
          dots.push(
            el("circle", {
              cx: 21 + ix * 36,
              cy: 21 + iy * 36,
              r: 3.2,
              ...deco,
            }),
          );
        }
      }
      return flatRect(bg) + dots.join("");
    }
  }
}
