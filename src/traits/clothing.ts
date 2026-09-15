import { el } from "../svg/elements.js";
import { tubePath, f } from "../monkey/shapes.js";
import { shade, mixHex } from "../monkey/palettes.js";
import { armJoints } from "./arms.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const CLOTHING_IDS = [
  "none",
  "tee",
  "hoodie",
  "vest",
  "scarf",
  "overalls",
  "sweater",
  "jacket",
  "dress",
  "cape",
] as const;
export type ClothingId = (typeof CLOTHING_IDS)[number];

// clothing follows the torso silhouette and the actual arm direction so
// garments read as constructed fabric: necklines, sleeve caps, seams,
// hems and straps — never flat rectangles.

const cloth = (ctx: RenderContext): string => ctx.grad("cloth");
const clothDark = (ctx: RenderContext): string =>
  shade(ctx.colors.accent, -0.24);
const clothLight = (ctx: RenderContext): string =>
  mixHex(ctx.colors.accent, "#ffffff", 0.18);
const trim = (ctx: RenderContext): string => shade(ctx.colors.accent, -0.38);

// torso-following garment with a neckline dip and (optional) hem flare
function garment(
  ctx: RenderContext,
  opts: {
    hem: number;
    neckW: number;
    neckDip: number;
    flare?: number;
    inset?: number;
  },
): string {
  const a = ctx.anchors;
  const { cx } = a;
  const sw = a.shoulderW + 3;
  const hw = a.hipW + 3;
  const top = a.torsoTop;
  const hem = opts.hem;
  const flare = opts.flare ?? 0;
  const hl = sw;
  const hr = hw + flare;
  const nw = opts.neckW;
  return el("path", {
    d: [
      `M ${f(cx - hl)} ${f(top + 15)}`,
      `C ${f(cx - hl)} ${f(top + 3)} ${f(cx - sw * 0.52)} ${f(top - 1)} ${f(cx - nw)} ${f(top + 2)}`,
      `C ${f(cx - nw * 0.35)} ${f(top + opts.neckDip)} ${f(cx + nw * 0.35)} ${f(top + opts.neckDip)} ${f(cx + nw)} ${f(top + 2)}`,
      `C ${f(cx + sw * 0.52)} ${f(top - 1)} ${f(cx + hw)} ${f(top + 3)} ${f(cx + hr)} ${f(top + 15)}`,
      `C ${f(cx + hr + 2)} ${f(top + 34)} ${f(cx + hr + 1)} ${f(hem - 12)} ${f(cx + hw + 3 + flare)} ${f(hem)}`,
      `Q ${f(cx)} ${f(hem + 5)} ${f(cx - hw - 3 - flare)} ${f(hem)}`,
      `C ${f(cx - hr - 1)} ${f(hem - 12)} ${f(cx - hl - 2)} ${f(top + 34)} ${f(cx - hl)} ${f(top + 15)}`,
      "Z",
    ].join(" "),
    fill: cloth(ctx),
  });
}

// a sleeve cap following the real arm direction (shoulder → 45% to elbow)
function sleeve(
  ctx: RenderContext,
  side: number,
  fraction: number,
  width: number,
): string {
  const joints = armJoints(ctx, ctx.selection.arms);
  const arm = side === -1 ? joints.left : joints.right;
  const [s, e] = [arm[0], arm[1]];
  const mid: [number, number] = [
    s[0] + (e[0] - s[0]) * fraction,
    s[1] + (e[1] - s[1]) * fraction,
  ];
  return el("path", {
    d: tubePath([s, mid], width, width - 2.5),
    fill: cloth(ctx),
  });
}

function neckline(ctx: RenderContext, neckW: number, neckDip: number): string {
  const a = ctx.anchors;
  const { cx } = a;
  const top = a.torsoTop;
  return el("path", {
    d: `M ${f(cx - neckW)} ${f(top + 2)} C ${f(cx - neckW * 0.35)} ${f(top + neckDip)} ${f(cx + neckW * 0.35)} ${f(top + neckDip)} ${f(cx + neckW)} ${f(top + 2)}`,
    fill: "none",
    stroke: trim(ctx),
    "stroke-width": 2,
    "stroke-linecap": "round",
    opacity: 0.7,
  });
}

function renderClothing(ctx: RenderContext, id: ClothingId): string {
  const a = ctx.anchors;
  const { cx } = a;
  const top = a.torsoTop;
  const bottom = a.torsoBottom;
  switch (id) {
    case "none":
      return "";
    case "tee": {
      const g = garment(ctx, { hem: bottom - 8, neckW: 15, neckDip: 8 });
      const sl = sleeve(ctx, -1, 0.42, 16) + sleeve(ctx, 1, 0.42, 16);
      return g + sl + neckline(ctx, 15, 8);
    }
    case "sweater": {
      const g = garment(ctx, { hem: bottom - 3, neckW: 13, neckDip: 7 });
      const sl = sleeve(ctx, -1, 0.85, 15.5) + sleeve(ctx, 1, 0.85, 15.5);
      // ribbed hem band
      const hem = el("path", {
        d: `M ${f(cx - a.hipW - 3)} ${f(bottom - 8)} Q ${f(cx)} ${f(bottom - 2)} ${f(cx + a.hipW + 3)} ${f(bottom - 8)} L ${f(cx + a.hipW + 3)} ${f(bottom - 1)} Q ${f(cx)} ${f(bottom + 5)} ${f(cx - a.hipW - 3)} ${f(bottom - 1)} Z`,
        fill: clothDark(ctx),
      });
      return g + sl + hem + neckline(ctx, 13, 7);
    }
    case "hoodie": {
      const g = garment(ctx, { hem: bottom - 2, neckW: 12, neckDip: 6 });
      const sl = sleeve(ctx, -1, 0.88, 15.5) + sleeve(ctx, 1, 0.88, 15.5);
      // hood mass framing the neck
      const hood = el("path", {
        d: `M ${f(cx - 22)} ${f(top + 4)} C ${f(cx - 24)} ${f(top + 16)} ${f(cx - 12)} ${f(top + 20)} ${f(cx)} ${f(top + 20)} C ${f(cx + 12)} ${f(top + 20)} ${f(cx + 24)} ${f(top + 16)} ${f(cx + 22)} ${f(top + 4)} C ${f(cx + 12)} ${f(top + 10)} ${f(cx - 12)} ${f(top + 10)} ${f(cx - 22)} ${f(top + 4)} Z`,
        fill: clothDark(ctx),
      });
      const strings =
        el("path", {
          d: `M ${f(cx - 6)} ${f(top + 16)} L ${f(cx - 7)} ${f(top + 27)}`,
          stroke: clothLight(ctx),
          "stroke-width": 1.6,
          "stroke-linecap": "round",
        }) +
        el("path", {
          d: `M ${f(cx + 6)} ${f(top + 16)} L ${f(cx + 7)} ${f(top + 27)}`,
          stroke: clothLight(ctx),
          "stroke-width": 1.6,
          "stroke-linecap": "round",
        });
      // kangaroo pocket
      const pocket = el("path", {
        d: `M ${f(cx - 14)} ${f(a.bellyCy - 4)} L ${f(cx - 12)} ${f(a.bellyCy + 14)} Q ${f(cx)} ${f(a.bellyCy + 17)} ${f(cx + 12)} ${f(a.bellyCy + 14)} L ${f(cx + 14)} ${f(a.bellyCy - 4)} Q ${f(cx)} ${f(a.bellyCy + 1)} ${f(cx - 14)} ${f(a.bellyCy - 4)} Z`,
        fill: clothDark(ctx),
        opacity: 0.85,
      });
      return g + sl + hood + strings + pocket;
    }
    case "vest": {
      const g = garment(ctx, { hem: bottom - 6, neckW: 17, neckDip: 11 });
      // armhole seams (no sleeves)
      const armhole = (side: number): string =>
        el("path", {
          d: `M ${f(cx + side * (a.shoulderW - 4))} ${f(top + 8)} C ${f(cx + side * (a.shoulderW + 2))} ${f(top + 18)} ${f(cx + side * (a.shoulderW + 2))} ${f(top + 30)} ${f(cx + side * (a.shoulderW - 2))} ${f(top + 38)}`,
          fill: "none",
          stroke: trim(ctx),
          "stroke-width": 1.6,
          opacity: 0.6,
        });
      const pocketLine = el("path", {
        d: `M ${f(cx - 12)} ${f(a.bellyCy - 2)} L ${f(cx + 12)} ${f(a.bellyCy - 2)}`,
        stroke: trim(ctx),
        "stroke-width": 1.4,
        opacity: 0.5,
        "stroke-linecap": "round",
      });
      return g + armhole(-1) + armhole(1) + pocketLine + neckline(ctx, 17, 11);
    }
    case "jacket": {
      const g = garment(ctx, { hem: bottom - 4, neckW: 14, neckDip: 9 });
      // open front: fur shows through the center gap
      const gap = el("path", {
        d: `M ${f(cx - 4)} ${f(top + 9)} C ${f(cx - 5)} ${f(top + 30)} ${f(cx - 5)} ${f(bottom - 14)} ${f(cx - 4.5)} ${f(bottom - 4)} L ${f(cx + 4.5)} ${f(bottom - 4)} C ${f(cx + 5)} ${f(bottom - 14)} ${f(cx + 5)} ${f(top + 30)} ${f(cx + 4)} ${f(top + 9)} Z`,
        fill: ctx.grad("torso"),
      });
      const collar =
        el("path", {
          d: `M ${f(cx - 14)} ${f(top + 2)} L ${f(cx - 3)} ${f(top + 12)} L ${f(cx - 10)} ${f(top + 16)} Z`,
          fill: clothLight(ctx),
        }) +
        el("path", {
          d: `M ${f(cx + 14)} ${f(top + 2)} L ${f(cx + 3)} ${f(top + 12)} L ${f(cx + 10)} ${f(top + 16)} Z`,
          fill: clothLight(ctx),
        });
      const edge =
        el("path", {
          d: `M ${f(cx - 4.5)} ${f(top + 10)} L ${f(cx - 5)} ${f(bottom - 4)}`,
          stroke: trim(ctx),
          "stroke-width": 1.4,
          opacity: 0.7,
        }) +
        el("path", {
          d: `M ${f(cx + 4.5)} ${f(top + 10)} L ${f(cx + 5)} ${f(bottom - 4)}`,
          stroke: trim(ctx),
          "stroke-width": 1.4,
          opacity: 0.7,
        });
      const sl = sleeve(ctx, -1, 0.8, 15.5) + sleeve(ctx, 1, 0.8, 15.5);
      return g + gap + collar + edge + sl;
    }
    case "overalls": {
      const hem = bottom - 2;
      // bib panel
      const bib = el("path", {
        d: [
          `M ${f(cx - 16)} ${f(top + 20)}`,
          `L ${f(cx - 17)} ${f(hem - 4)}`,
          `Q ${f(cx)} ${f(hem + 2)} ${f(cx + 17)} ${f(hem - 4)}`,
          `L ${f(cx + 16)} ${f(top + 20)}`,
          `Q ${f(cx)} ${f(top + 14)} ${f(cx - 16)} ${f(top + 20)}`,
          "Z",
        ].join(" "),
        fill: cloth(ctx),
      });
      const pocket = el("path", {
        d: `M ${f(cx - 8)} ${f(a.bellyCy - 2)} L ${f(cx + 8)} ${f(a.bellyCy - 2)} L ${f(cx + 7)} ${f(a.bellyCy + 8)} Q ${f(cx)} ${f(a.bellyCy + 10)} ${f(cx - 7)} ${f(a.bellyCy + 8)} Z`,
        fill: clothDark(ctx),
        opacity: 0.8,
      });
      // shoulder straps
      const strap = (side: number): string =>
        el("path", {
          d: `M ${f(cx + side * 12)} ${f(top + 5)} L ${f(cx + side * 16)} ${f(top + 22)} L ${f(cx + side * 22)} ${f(top + 22)} L ${f(cx + side * 18)} ${f(top + 4)} Z`,
          fill: cloth(ctx),
        });
      const buttons =
        el("circle", {
          cx: cx - 13,
          cy: top + 22,
          r: 2.2,
          fill: clothLight(ctx),
        }) +
        el("circle", {
          cx: cx + 13,
          cy: top + 22,
          r: 2.2,
          fill: clothLight(ctx),
        });
      return bib + strap(-1) + strap(1) + buttons + pocket;
    }
    case "scarf": {
      // wrapped band under the jaw
      const band = el("path", {
        d: [
          `M ${f(cx - 24)} ${f(top - 1)}`,
          `C ${f(cx - 10)} ${f(top + 9)} ${f(cx + 10)} ${f(top + 9)} ${f(cx + 24)} ${f(top - 1)}`,
          `L ${f(cx + 24)} ${f(top + 12)}`,
          `C ${f(cx + 10)} ${f(top + 22)} ${f(cx - 10)} ${f(top + 22)} ${f(cx - 24)} ${f(top + 12)}`,
          "Z",
        ].join(" "),
        fill: cloth(ctx),
      });
      const fold = el("path", {
        d: `M ${f(cx - 24)} ${f(top + 5)} C ${f(cx - 10)} ${f(top + 14)} ${f(cx + 10)} ${f(top + 14)} ${f(cx + 24)} ${f(top + 5)}`,
        fill: "none",
        stroke: trim(ctx),
        "stroke-width": 1.4,
        opacity: 0.5,
      });
      // hanging tail with fringe
      const tail = el("path", {
        d: `M ${f(cx + 8)} ${f(top + 12)} L ${f(cx + 17)} ${f(top + 12)} L ${f(cx + 18)} ${f(top + 44)} L ${f(cx + 9)} ${f(top + 44)} Z`,
        fill: cloth(ctx),
      });
      const fringe =
        el("path", {
          d: `M ${f(cx + 10.5)} ${f(top + 44)} L ${f(cx + 10.5)} ${f(top + 48)}`,
          stroke: trim(ctx),
          "stroke-width": 1.2,
          opacity: 0.6,
        }) +
        el("path", {
          d: `M ${f(cx + 13.5)} ${f(top + 44)} L ${f(cx + 13.5)} ${f(top + 49)}`,
          stroke: trim(ctx),
          "stroke-width": 1.2,
          opacity: 0.6,
        }) +
        el("path", {
          d: `M ${f(cx + 16.5)} ${f(top + 44)} L ${f(cx + 16.5)} ${f(top + 48)}`,
          stroke: trim(ctx),
          "stroke-width": 1.2,
          opacity: 0.6,
        });
      return band + fold + tail + fringe;
    }
    case "dress": {
      const g = garment(ctx, {
        hem: a.groundY - 3,
        neckW: 14,
        neckDip: 8,
        flare: 12,
      });
      const sl = sleeve(ctx, -1, 0.4, 15) + sleeve(ctx, 1, 0.4, 15);
      const hemline = el("path", {
        d: `M ${f(cx - a.hipW - 12)} ${f(a.groundY - 6)} Q ${f(cx)} ${f(a.groundY - 1)} ${f(cx + a.hipW + 12)} ${f(a.groundY - 6)}`,
        fill: "none",
        stroke: trim(ctx),
        "stroke-width": 1.6,
        opacity: 0.6,
      });
      return g + sl + hemline + neckline(ctx, 14, 8);
    }
    case "cape":
      // the cape body lives in the back layer; front shows collar + clasp
      return (
        el("path", {
          d: `M ${f(cx - 18)} ${f(top + 2)} C ${f(cx - 8)} ${f(top + 8)} ${f(cx + 8)} ${f(top + 8)} ${f(cx + 18)} ${f(top + 2)} L ${f(cx + 14)} ${f(top + 12)} C ${f(cx + 6)} ${f(top + 16)} ${f(cx - 6)} ${f(top + 16)} ${f(cx - 14)} ${f(top + 12)} Z`,
          fill: clothDark(ctx),
        }) + el("circle", { cx, cy: top + 9, r: 3.4, fill: clothLight(ctx) })
      );
  }
}

function renderCapeBack(ctx: RenderContext): string {
  const a = ctx.anchors;
  const { cx } = a;
  const top = a.torsoTop;
  return el("path", {
    d: [
      `M ${f(cx - a.shoulderW - 2)} ${f(top + 6)}`,
      `C ${f(cx - a.shoulderW - 16)} ${f(top + 40)} ${f(cx - a.hipW - 22)} ${f(a.groundY - 26)} ${f(cx - a.hipW - 26)} ${f(a.groundY - 4)}`,
      `Q ${f(cx)} ${f(a.groundY + 4)} ${f(cx + a.hipW + 26)} ${f(a.groundY - 4)}`,
      `C ${f(cx + a.hipW + 22)} ${f(a.groundY - 26)} ${f(cx + a.shoulderW + 16)} ${f(top + 40)} ${f(cx + a.shoulderW + 2)} ${f(top + 6)}`,
      `C ${f(cx + a.shoulderW * 0.5)} ${f(top + 16)} ${f(cx - a.shoulderW * 0.5)} ${f(top + 16)} ${f(cx - a.shoulderW - 2)} ${f(top + 6)}`,
      "Z",
    ].join(" "),
    fill: shade(ctx.colors.accent, -0.14),
  });
}

defineFamily<ClothingId>({
  id: "clothing",
  label: "Clothing",
  salt: 21,
  traits: [
    { id: "none", label: "None", weight: 1.3 },
    { id: "tee", label: "Tee" },
    { id: "hoodie", label: "Hoodie" },
    { id: "vest", label: "Vest" },
    { id: "scarf", label: "Scarf" },
    { id: "overalls", label: "Overalls" },
    { id: "sweater", label: "Sweater" },
    { id: "jacket", label: "Jacket" },
    { id: "dress", label: "Dress" },
    { id: "cape", label: "Cape" },
  ],
  hooks: {
    main: (ctx, id) => renderClothing(ctx, id),
    back: (ctx) =>
      ctx.selection.clothing === "cape" ? renderCapeBack(ctx) : "",
  },
});
