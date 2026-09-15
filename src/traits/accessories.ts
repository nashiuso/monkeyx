import { el } from "../svg/elements.js";
import { f } from "../monkey/shapes.js";
import { shade, mixHex } from "../monkey/palettes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const ACCESSORY_IDS = [
  "none",
  "round-glasses",
  "square-glasses",
  "sunglasses",
  "beanie",
  "cap",
  "crown",
  "bow",
  "flower",
  "headphones",
  "headband",
  "bandana",
] as const;
export type AccessoryId = (typeof ACCESSORY_IDS)[number];

// hard headwear hides randomly-picked hair (resolved in selection)
export const HAIR_SUPPRESSORS: readonly AccessoryId[] = [
  "beanie",
  "cap",
  "crown",
  "bandana",
];

// accessories physically attach to the anatomy: glasses ride the face
// plate, headwear sits on the crown, cups wrap the ears.

const accent = (ctx: RenderContext): string => ctx.colors.accent;
const accentDark = (ctx: RenderContext): string => shade(accent(ctx), -0.28);
const metal = "#3a3f4a";

function glassesBridgesAndArms(ctx: RenderContext, y: number): string {
  const a = ctx.anchors;
  const { cx } = a;
  const dx = a.eyeDx;
  return (
    el("path", {
      d: `M ${f(cx - dx + 11)} ${f(y - 2)} Q ${f(cx)} ${f(y - 5)} ${f(cx + dx - 11)} ${f(y - 2)}`,
      fill: "none",
      stroke: metal,
      "stroke-width": 2,
      "stroke-linecap": "round",
    }) +
    el("path", {
      d: `M ${f(cx - dx - 11)} ${f(y - 2)} L ${f(cx - a.earDx + 8)} ${f(y - 4)}`,
      stroke: metal,
      "stroke-width": 2,
      "stroke-linecap": "round",
    }) +
    el("path", {
      d: `M ${f(cx + dx + 11)} ${f(y - 2)} L ${f(cx + a.earDx - 8)} ${f(y - 4)}`,
      stroke: metal,
      "stroke-width": 2,
      "stroke-linecap": "round",
    })
  );
}

export function renderAccessory(ctx: RenderContext, id: AccessoryId): string {
  const a = ctx.anchors;
  const { cx, headRx: rx, headTop } = a;
  const eyeY = a.eyeY;
  const dx = a.eyeDx;
  const hairline = a.faceCy - a.faceRy - 2;

  switch (id) {
    case "none":
      return "";
    case "round-glasses":
      return (
        el("circle", {
          cx: cx - dx,
          cy: eyeY,
          r: 11.5,
          fill: "#ffffff",
          opacity: 0.16,
        }) +
        el("circle", {
          cx: cx + dx,
          cy: eyeY,
          r: 11.5,
          fill: "#ffffff",
          opacity: 0.16,
        }) +
        el("circle", {
          cx: cx - dx,
          cy: eyeY,
          r: 11.5,
          fill: "none",
          stroke: metal,
          "stroke-width": 2.4,
        }) +
        el("circle", {
          cx: cx + dx,
          cy: eyeY,
          r: 11.5,
          fill: "none",
          stroke: metal,
          "stroke-width": 2.4,
        }) +
        glassesBridgesAndArms(ctx, eyeY)
      );
    case "square-glasses":
      return (
        el("rect", {
          x: cx - dx - 11,
          y: eyeY - 9,
          width: 22,
          height: 18,
          rx: 5,
          fill: "#ffffff",
          opacity: 0.16,
        }) +
        el("rect", {
          x: cx + dx - 11,
          y: eyeY - 9,
          width: 22,
          height: 18,
          rx: 5,
          fill: "#ffffff",
          opacity: 0.16,
        }) +
        el("rect", {
          x: cx - dx - 11,
          y: eyeY - 9,
          width: 22,
          height: 18,
          rx: 5,
          fill: "none",
          stroke: metal,
          "stroke-width": 2.4,
        }) +
        el("rect", {
          x: cx + dx - 11,
          y: eyeY - 9,
          width: 22,
          height: 18,
          rx: 5,
          fill: "none",
          stroke: metal,
          "stroke-width": 2.4,
        }) +
        glassesBridgesAndArms(ctx, eyeY)
      );
    case "sunglasses":
      return (
        el("rect", {
          x: cx - dx - 12,
          y: eyeY - 9.5,
          width: 24,
          height: 19,
          rx: 6,
          fill: "#20242e",
          opacity: 0.94,
        }) +
        el("rect", {
          x: cx + dx - 12,
          y: eyeY - 9.5,
          width: 24,
          height: 19,
          rx: 6,
          fill: "#20242e",
          opacity: 0.94,
        }) +
        el("path", {
          d: `M ${f(cx - dx - 8)} ${f(eyeY - 6)} L ${f(cx - dx + 4)} ${f(eyeY - 6)}`,
          stroke: "#5a6478",
          "stroke-width": 1.4,
          "stroke-linecap": "round",
          opacity: 0.8,
        }) +
        el("path", {
          d: `M ${f(cx + dx - 8)} ${f(eyeY - 6)} L ${f(cx + dx + 4)} ${f(eyeY - 6)}`,
          stroke: "#5a6478",
          "stroke-width": 1.4,
          "stroke-linecap": "round",
          opacity: 0.8,
        }) +
        glassesBridgesAndArms(ctx, eyeY)
      );
    case "beanie": {
      const dome = el("path", {
        d: [
          `M ${f(cx - rx + 2)} ${f(hairline + 4)}`,
          `C ${f(cx - rx)} ${f(headTop + 8)} ${f(cx - rx * 0.55)} ${f(headTop - 3)} ${f(cx)} ${f(headTop - 3)}`,
          `C ${f(cx + rx * 0.55)} ${f(headTop - 3)} ${f(cx + rx)} ${f(headTop + 8)} ${f(cx + rx - 2)} ${f(hairline + 4)}`,
          `C ${f(cx + rx * 0.5)} ${f(hairline - 2)} ${f(cx - rx * 0.5)} ${f(hairline - 2)} ${f(cx - rx + 2)} ${f(hairline + 4)}`,
          "Z",
        ].join(" "),
        fill: accent(ctx),
      });
      const band = el("path", {
        d: [
          `M ${f(cx - rx + 1)} ${f(hairline + 2)}`,
          `C ${f(cx - rx * 0.5)} ${f(hairline - 4)} ${f(cx + rx * 0.5)} ${f(hairline - 4)} ${f(cx + rx - 1)} ${f(hairline + 2)}`,
          `L ${f(cx + rx - 2)} ${f(hairline + 10)}`,
          `C ${f(cx + rx * 0.5)} ${f(hairline + 4)} ${f(cx - rx * 0.5)} ${f(hairline + 4)} ${f(cx - rx + 2)} ${f(hairline + 10)}`,
          "Z",
        ].join(" "),
        fill: accentDark(ctx),
      });
      const pompom = el("circle", {
        cx,
        cy: headTop - 6,
        r: 7,
        fill: mixHex(accent(ctx), "#ffffff", 0.3),
      });
      return dome + band + pompom;
    }
    case "cap": {
      const dome = el("path", {
        d: [
          `M ${f(cx - rx + 2)} ${f(hairline + 2)}`,
          `C ${f(cx - rx)} ${f(headTop + 6)} ${f(cx - rx * 0.5)} ${f(headTop - 4)} ${f(cx)} ${f(headTop - 4)}`,
          `C ${f(cx + rx * 0.5)} ${f(headTop - 4)} ${f(cx + rx)} ${f(headTop + 6)} ${f(cx + rx - 2)} ${f(hairline + 2)}`,
          `C ${f(cx + rx * 0.5)} ${f(hairline - 4)} ${f(cx - rx * 0.5)} ${f(hairline - 4)} ${f(cx - rx + 2)} ${f(hairline + 2)}`,
          "Z",
        ].join(" "),
        fill: accent(ctx),
      });
      // brim sweeping to the character's right
      const brim = el("path", {
        d: [
          `M ${f(cx + 2)} ${f(hairline - 1)}`,
          `C ${f(cx + rx * 0.7)} ${f(hairline - 3)} ${f(cx + rx + 16)} ${f(hairline + 2)} ${f(cx + rx + 15)} ${f(hairline + 9)}`,
          `C ${f(cx + rx + 14)} ${f(hairline + 13)} ${f(cx + rx * 0.6)} ${f(hairline + 9)} ${f(cx + 4)} ${f(hairline + 6)}`,
          "Z",
        ].join(" "),
        fill: accentDark(ctx),
      });
      const button = el("circle", {
        cx,
        cy: headTop - 3,
        r: 2.6,
        fill: accentDark(ctx),
      });
      return dome + brim + button;
    }
    case "crown": {
      const gold = "#e8b64c";
      const goldDark = "#c2912f";
      const y = hairline - 6;
      const w = rx * 0.62;
      return (
        el("path", {
          d: [
            `M ${f(cx - w)} ${f(y + 14)}`,
            `L ${f(cx - w)} ${f(y)}`,
            `L ${f(cx - w * 0.55)} ${f(y + 7)}`,
            `L ${f(cx - w * 0.25)} ${f(y - 8)}`,
            `L ${f(cx)} ${f(y + 2)}`,
            `L ${f(cx + w * 0.25)} ${f(y - 8)}`,
            `L ${f(cx + w * 0.55)} ${f(y + 7)}`,
            `L ${f(cx + w)} ${f(y)}`,
            `L ${f(cx + w)} ${f(y + 14)}`,
            "Z",
          ].join(" "),
          fill: gold,
        }) +
        el("rect", {
          x: cx - w,
          y: y + 9.5,
          width: w * 2,
          height: 4.5,
          rx: 2,
          fill: goldDark,
        }) +
        el("circle", { cx, cy: y + 11.5, r: 1.8, fill: accent(ctx) })
      );
    }
    case "bow": {
      const bx = cx - rx * 0.55;
      const by = headTop + 12;
      return (
        el("path", {
          d: `M ${f(bx)} ${f(by)} C ${f(bx - 14)} ${f(by - 10)} ${f(bx - 20)} ${f(by + 2)} ${f(bx - 4)} ${f(by + 6)} Z`,
          fill: accent(ctx),
        }) +
        el("path", {
          d: `M ${f(bx)} ${f(by)} C ${f(bx + 14)} ${f(by - 10)} ${f(bx + 20)} ${f(by + 2)} ${f(bx + 4)} ${f(by + 6)} Z`,
          fill: accent(ctx),
        }) +
        el("circle", { cx: bx, cy: by + 1.5, r: 4.2, fill: accentDark(ctx) })
      );
    }
    case "flower": {
      const fx = cx + rx * 0.62;
      const fy = headTop + 14;
      const petal = "#f2b8c6";
      let petals = "";
      for (let i = 0; i < 5; i++) {
        const ang = (i * 72 - 90) * (Math.PI / 180);
        petals += el("circle", {
          cx: fx + Math.cos(ang) * 5.5,
          cy: fy + Math.sin(ang) * 5.5,
          r: 4.6,
          fill: petal,
        });
      }
      return petals + el("circle", { cx: fx, cy: fy, r: 3.4, fill: "#f7e08a" });
    }
    case "headphones": {
      const band = el("path", {
        d: `M ${f(cx - a.earDx)} ${f(a.earCy - 8)} C ${f(cx - rx * 0.7)} ${f(headTop - 14)} ${f(cx + rx * 0.7)} ${f(headTop - 14)} ${f(cx + a.earDx)} ${f(a.earCy - 8)}`,
        fill: "none",
        stroke: metal,
        "stroke-width": 5,
        "stroke-linecap": "round",
      });
      const cup = (side: number): string => {
        const ex = cx + side * a.earDx;
        return (
          el("rect", {
            x: ex - 8,
            y: a.earCy - 12,
            width: 16,
            height: 24,
            rx: 7,
            fill: metal,
          }) +
          el("rect", {
            x: ex - 4.5,
            y: a.earCy - 8,
            width: 9,
            height: 16,
            rx: 4.5,
            fill: mixHex(metal, "#ffffff", 0.22),
          })
        );
      };
      return band + cup(-1) + cup(1);
    }
    case "headband": {
      const y = hairline + 2;
      return (
        el("path", {
          d: [
            `M ${f(cx - rx + 4)} ${f(y)}`,
            `C ${f(cx - rx * 0.5)} ${f(y - 6)} ${f(cx + rx * 0.5)} ${f(y - 6)} ${f(cx + rx - 4)} ${f(y)}`,
            `L ${f(cx + rx - 5)} ${f(y + 8)}`,
            `C ${f(cx + rx * 0.5)} ${f(y + 2)} ${f(cx - rx * 0.5)} ${f(y + 2)} ${f(cx - rx + 5)} ${f(y + 8)}`,
            "Z",
          ].join(" "),
          fill: accent(ctx),
        }) +
        el("circle", {
          cx: cx + rx - 8,
          cy: y + 2,
          r: 3,
          fill: accentDark(ctx),
        })
      );
    }
    case "bandana": {
      const y = hairline - 1;
      return (
        el("path", {
          d: [
            `M ${f(cx - rx + 2)} ${f(y)}`,
            `C ${f(cx - rx * 0.5)} ${f(y - 8)} ${f(cx + rx * 0.5)} ${f(y - 8)} ${f(cx + rx - 2)} ${f(y)}`,
            `L ${f(cx + rx - 3)} ${f(y + 11)}`,
            `C ${f(cx + rx * 0.5)} ${f(y + 3)} ${f(cx - rx * 0.5)} ${f(y + 3)} ${f(cx - rx + 3)} ${f(y + 11)}`,
            "Z",
          ].join(" "),
          fill: accent(ctx),
        }) +
        el("path", {
          d: `M ${f(cx + rx - 4)} ${f(y + 4)} C ${f(cx + rx + 8)} ${f(y + 8)} ${f(cx + rx + 10)} ${f(y + 20)} ${f(cx + rx + 4)} ${f(y + 28)} C ${f(cx + rx + 2)} ${f(y + 18)} ${f(cx + rx - 2)} ${f(y + 12)} ${f(cx + rx - 6)} ${f(y + 10)} Z`,
          fill: accentDark(ctx),
        }) +
        el("circle", {
          cx: cx + rx - 5,
          cy: y + 5,
          r: 3.2,
          fill: accentDark(ctx),
        })
      );
    }
  }
}

defineFamily<AccessoryId>({
  id: "accessory",
  label: "Accessory",
  salt: 22,
  traits: [
    { id: "none", label: "None", weight: 1.5 },
    { id: "round-glasses", label: "Round glasses" },
    { id: "square-glasses", label: "Square glasses" },
    { id: "sunglasses", label: "Sunglasses" },
    { id: "beanie", label: "Beanie" },
    { id: "cap", label: "Cap" },
    { id: "crown", label: "Crown" },
    { id: "bow", label: "Bow" },
    { id: "flower", label: "Flower" },
    { id: "headphones", label: "Headphones" },
    { id: "headband", label: "Headband" },
    { id: "bandana", label: "Bandana" },
  ],
  hooks: { main: (ctx, id) => renderAccessory(ctx, id) },
});
