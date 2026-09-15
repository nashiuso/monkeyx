import { el } from "../svg/elements.js";
import { headPath, tuftPath, f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const HAIR_IDS = [
  "none",
  "tuft",
  "curly",
  "afro",
  "mohawk",
  "fringe",
  "buns",
  "long",
  "ponytail",
  "topknot",
  "wild",
  "bob",
] as const;
export type HairId = (typeof HAIR_IDS)[number];

// hair extends the dark cap zone into a real hair system. the hair color
// comes from the selection (natural or accent-tinted); masses use the
// per-avatar hair gradient for depth.
//
// layering: the `back` hook draws masses that fall behind the body
// (long, ponytail, bob); `main` draws everything on the skull and the
// front face frame (fringes, buns, spines, side locks).

const hairFill = (ctx: RenderContext): string => ctx.grad("hair");

// a fringe band across the forehead with a scalloped lower edge
function fringe(ctx: RenderContext, edgeY: number): string {
  const a = ctx.anchors;
  const { cx, headRx: rx } = a;
  const hairline = a.faceCy - a.faceRy - 2;
  // follow the cap hairline on top, scallop across the brow line
  const p = (t: number): number => cx - rx + 6 + (rx * 2 - 12) * t;
  return el("path", {
    d: [
      `M ${f(cx - rx + 4)} ${f(hairline + 4)}`,
      `C ${f(p(0.1))} ${f(hairline - 6)} ${f(p(0.3))} ${f(hairline - 9)} ${f(p(0.5))} ${f(hairline - 8)}`,
      `C ${f(p(0.7))} ${f(hairline - 9)} ${f(p(0.9))} ${f(hairline - 6)} ${f(cx + rx - 4)} ${f(hairline + 4)}`,
      `C ${f(cx + rx * 0.62)} ${f(edgeY)} ${f(cx + rx * 0.3)} ${f(edgeY + 5)} ${f(cx + rx * 0.12)} ${f(edgeY - 2)}`,
      `C ${f(cx)} ${f(edgeY + 4)} ${f(cx - rx * 0.2)} ${f(edgeY + 4)} ${f(cx - rx * 0.38)} ${f(edgeY - 2)}`,
      `C ${f(cx - rx * 0.62)} ${f(edgeY + 5)} ${f(cx - rx + 4)} ${f(edgeY - 6)} ${f(cx - rx + 4)} ${f(hairline + 4)}`,
      "Z",
    ].join(" "),
    fill: hairFill(ctx),
  });
}

function renderHairBack(ctx: RenderContext, id: HairId): string {
  const a = ctx.anchors;
  const { cx, headRx: rx, cy } = a;
  switch (id) {
    case "long": {
      // two masses falling behind the shoulders
      const mass = (side: number): string =>
        el("path", {
          d: [
            `M ${f(cx + side * rx * 0.6)} ${f(cy - rx * 0.5)}`,
            `C ${f(cx + side * (rx + 12))} ${f(cy - rx * 0.1)} ${f(cx + side * (rx + 14))} ${f(cy + 30)} ${f(cx + side * (rx + 8))} ${f(cy + 66)}`,
            `C ${f(cx + side * (rx + 4))} ${f(cy + 76)} ${f(cx + side * (rx - 6))} ${f(cy + 78)} ${f(cx + side * (rx - 12))} ${f(cy + 70)}`,
            `C ${f(cx + side * rx * 0.8)} ${f(cy + 40)} ${f(cx + side * rx * 0.72)} ${f(cy + 8)} ${f(cx + side * rx * 0.6)} ${f(cy - rx * 0.5)}`,
            "Z",
          ].join(" "),
          fill: hairFill(ctx),
        });
      return mass(-1) + mass(1);
    }
    case "ponytail":
      return el("path", {
        d: [
          `M ${f(cx + rx - 6)} ${f(cy - rx * 0.55)}`,
          `C ${f(cx + rx + 16)} ${f(cy - 8)} ${f(cx + rx + 18)} ${f(cy + 28)} ${f(cx + rx + 8)} ${f(cy + 52)}`,
          `C ${f(cx + rx + 4)} ${f(cy + 60)} ${f(cx + rx - 2)} ${f(cy + 60)} ${f(cx + rx - 4)} ${f(cy + 52)}`,
          `C ${f(cx + rx + 2)} ${f(cy + 26)} ${f(cx + rx - 2)} ${f(cy - 6)} ${f(cx + rx - 14)} ${f(cy - rx * 0.3)}`,
          "Z",
        ].join(" "),
        fill: hairFill(ctx),
      });
    case "bob":
      // helmet behind the face, framing the skull down to the jaw
      return el("path", {
        d: [
          headPath(cx, cy, rx + 8, a.headRy + 6),
          `M ${f(cx)} ${f(cy + a.headRy - 4)}`,
          `C ${f(cx - (rx + 8) * 0.5)} ${f(cy + a.headRy * 0.7)} ${f(cx - (rx + 8))} ${f(cy + a.headRy * 0.1)} ${f(cx - (rx + 8))} ${f(cy - a.headRy * 0.35)}`,
          `C ${f(cx - (rx + 8))} ${f(cy - a.headRy * 0.8)} ${f(cx - (rx + 8) * 0.6)} ${f(cy - a.headRy - 6)} ${f(cx)} ${f(cy - a.headRy - 6)}`,
          `C ${f(cx + (rx + 8) * 0.6)} ${f(cy - a.headRy - 6)} ${f(cx + (rx + 8))} ${f(cy - a.headRy * 0.8)} ${f(cx + (rx + 8))} ${f(cy - a.headRy * 0.35)}`,
          `C ${f(cx + (rx + 8))} ${f(cy + a.headRy * 0.1)} ${f(cx + (rx + 8) * 0.5)} ${f(cy + a.headRy * 0.7)} ${f(cx)} ${f(cy + a.headRy - 4)}`,
          "Z",
        ].join(" "),
        fill: hairFill(ctx),
        fillRule: "evenodd",
      });
    default:
      return "";
  }
}

function renderHairFront(ctx: RenderContext, id: HairId): string {
  const a = ctx.anchors;
  const { cx, headRx: rx, headTop, cy } = a;
  const hairline = a.faceCy - a.faceRy - 2;
  const fill = hairFill(ctx);

  switch (id) {
    case "none":
      return "";
    case "tuft":
      return el("path", { d: tuftPath(cx, headTop + 4, 9, 7, 3), fill });
    case "curly": {
      const bumps: [number, number, number][] = [
        [cx - rx * 0.52, cy - rx * 0.5, 9.5],
        [cx - rx * 0.18, cy - rx * 0.72, 10.5],
        [cx + rx * 0.18, cy - rx * 0.72, 10.5],
        [cx + rx * 0.52, cy - rx * 0.5, 9.5],
      ];
      return bumps
        .map(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill }))
        .join("");
    }
    case "afro": {
      const bumps: [number, number, number][] = [
        [cx - rx * 0.62, cy - rx * 0.42, 13],
        [cx - rx * 0.28, cy - rx * 0.78, 14],
        [cx + rx * 0.1, cy - rx * 0.86, 14],
        [cx + rx * 0.48, cy - rx * 0.72, 13],
        [cx + rx * 0.7, cy - rx * 0.38, 11],
        [cx - rx * 0.82, cy - rx * 0.1, 10],
      ];
      return bumps
        .map(([x, y, r]) => el("circle", { cx: x, cy: y, r, fill }))
        .join("");
    }
    case "mohawk":
      return el("path", {
        d: [
          `M ${f(cx - 9)} ${f(hairline + 2)}`,
          `C ${f(cx - 9)} ${f(hairline - 14)} ${f(cx - 5)} ${f(headTop - 4)} ${f(cx - 4)} ${f(headTop - 12)}`,
          `C ${f(cx - 2)} ${f(headTop - 2)} ${f(cx + 1)} ${f(headTop + 2)} ${f(cx + 1)} ${f(headTop - 14)}`,
          `C ${f(cx + 3)} ${f(headTop + 2)} ${f(cx + 6)} ${f(headTop - 4)} ${f(cx + 6)} ${f(headTop - 12)}`,
          `C ${f(cx + 7)} ${f(headTop - 2)} ${f(cx + 9)} ${f(hairline - 12)} ${f(cx + 9)} ${f(hairline + 2)}`,
          "Z",
        ].join(" "),
        fill,
      });
    case "fringe":
      return fringe(ctx, hairline + 4);
    case "buns":
      return (
        el("circle", { cx: cx - rx * 0.72, cy: cy - rx * 0.62, r: 11, fill }) +
        el("circle", { cx: cx + rx * 0.72, cy: cy - rx * 0.62, r: 11, fill }) +
        el("circle", {
          cx: cx - rx * 0.72,
          cy: cy - rx * 0.62,
          r: 4.5,
          fill: ctx.palette.furDark,
          opacity: 0.5,
        }) +
        el("circle", {
          cx: cx + rx * 0.72,
          cy: cy - rx * 0.62,
          r: 4.5,
          fill: ctx.palette.furDark,
          opacity: 0.5,
        })
      );
    case "long": {
      // side locks framing the face (front of the shoulders)
      const lock = (side: number): string =>
        el("path", {
          d: [
            `M ${f(cx + side * rx * 0.86)} ${f(hairline - 4)}`,
            `C ${f(cx + side * (rx + 4))} ${f(cy + 6)} ${f(cx + side * (rx + 2))} ${f(cy + 34)} ${f(cx + side * rx * 0.7)} ${f(cy + 44)}`,
            `C ${f(cx + side * rx * 0.62)} ${f(cy + 48)} ${f(cx + side * rx * 0.58)} ${f(cy + 44)} ${f(cx + side * rx * 0.62)} ${f(cy + 38)}`,
            `C ${f(cx + side * rx * 0.8)} ${f(cy + 24)} ${f(cx + side * rx * 0.92)} ${f(cy)} ${f(cx + side * rx * 0.9)} ${f(hairline + 6)}`,
            "Z",
          ].join(" "),
          fill,
        });
      return fringe(ctx, hairline + 3) + lock(-1) + lock(1);
    }
    case "ponytail":
      // the tie knot; the tail mass lives in the back layer
      return (
        el("path", {
          d: tuftPath(cx - 8, headTop + 6, 14, 8, 3),
          fill,
        }) +
        el("ellipse", {
          cx: cx + rx - 10,
          cy: cy - rx * 0.45,
          rx: 6,
          ry: 5,
          fill: ctx.colors.accent,
        })
      );
    case "topknot":
      return (
        el("circle", { cx, cy: headTop - 8, r: 12, fill }) +
        el("path", {
          d: `M ${f(cx - 7)} ${f(headTop - 2)} C ${f(cx - 3)} ${f(headTop - 8)} ${f(cx + 3)} ${f(headTop - 8)} ${f(cx + 7)} ${f(headTop - 2)} Z`,
          fill: ctx.palette.furDark,
          opacity: 0.4,
        })
      );
    case "wild": {
      // spiky burst around the crown; per-seed jitter keeps each one unique
      const spikes: string[] = [];
      const n = 7;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const ang = ((-150 + t * 120 + ctx.rng.range(-7, 7)) * Math.PI) / 180;
        const lenJitter = ctx.rng.range(0.75, 1.25);
        const bx = cx + Math.cos(ang) * rx * 0.82;
        const by = cy + Math.sin(ang) * rx * 0.82 - 4;
        const tx = cx + Math.cos(ang) * (rx + (14 + (i % 2) * 6) * lenJitter);
        const ty =
          cy + Math.sin(ang) * (rx * 0.9 + (12 + (i % 2) * 5) * lenJitter) - 4;
        const px = -Math.sin(ang) * 5.5;
        const py = Math.cos(ang) * 5.5;
        spikes.push(
          el("path", {
            d: `M ${f(bx - px)} ${f(by - py)} L ${f(tx)} ${f(ty)} L ${f(bx + px)} ${f(by + py)} Z`,
            fill,
          }),
        );
      }
      return spikes.join("");
    }
    case "bob":
      // straight fringe edge completing the helmet from the back layer
      return fringe(ctx, hairline + 5);
  }
}

defineFamily<HairId>({
  id: "hair",
  label: "Hair",
  salt: 16,
  traits: [
    { id: "none", label: "None", weight: 1.2 },
    { id: "tuft", label: "Tuft", weight: 1.5 },
    { id: "curly", label: "Curly" },
    { id: "afro", label: "Afro" },
    { id: "mohawk", label: "Mohawk" },
    { id: "fringe", label: "Fringe" },
    { id: "buns", label: "Buns" },
    { id: "long", label: "Long" },
    { id: "ponytail", label: "Ponytail" },
    { id: "topknot", label: "Topknot" },
    { id: "wild", label: "Wild" },
    { id: "bob", label: "Bob" },
  ],
  hooks: {
    back: (ctx, id) => renderHairBack(ctx, id),
    main: (ctx, id) => renderHairFront(ctx, id),
  },
});
