import { el } from "../svg/elements.js";
import { browPath } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const BROWS_IDS = [
  "none",
  "soft",
  "raised",
  "serious",
  "uni",
  "worried",
  "thick",
  "curious",
] as const;
export type BrowsId = (typeof BROWS_IDS)[number];

// tapered crescent brows over the eye sockets. innerDip > 0 drops the inner
// ends (stern), < 0 raises them (worried); lift raises the whole brow.
export function renderBrows(ctx: RenderContext, id: BrowsId): string {
  if (id === "none") return "";
  const { anchors, palette } = ctx;
  const { cx } = anchors;
  const dx = anchors.eyeDx;
  const y = anchors.browY + ctx.rng.range(-1, 1);
  const fill = palette.furDark;

  const one = (
    side: number,
    lift: number,
    arch: number,
    tMid: number,
    tEnd: number,
    innerDip = 0,
  ): string => {
    const ex = cx + side * dx;
    const x1 = ex - side * 8.5; // inner end (near the nose)
    const x2 = ex + side * 8.5; // outer end
    return el("path", {
      d: browPath(x1, y - lift + innerDip, x2, y - lift, arch, tMid, tEnd),
      fill,
    });
  };

  switch (id) {
    case "soft":
      return one(-1, 0, 4.5, 3, 1.4) + one(1, 0, 4.5, 3, 1.4);
    case "raised":
      return one(-1, 3.5, 6.5, 3, 1.5) + one(1, 3.5, 6.5, 3, 1.5);
    case "serious":
      return one(-1, 0, 3, 3.4, 1.6, 3) + one(1, 0, 3, 3.4, 1.6, 3);
    case "worried":
      return one(-1, 1, 3.5, 2.8, 1.3, -2.5) + one(1, 1, 3.5, 2.8, 1.3, -2.5);
    case "thick":
      return one(-1, 0.5, 4, 5.5, 2.4) + one(1, 0.5, 4, 5.5, 2.4);
    case "curious":
      // left raised, right soft
      return one(-1, 3.5, 6.5, 3, 1.5) + one(1, 0, 4.5, 3, 1.4);
    case "uni":
      return el("path", {
        d: browPath(cx - 15, y - 1, cx + 15, y - 1, 3, 4.4, 2.2),
        fill,
      });
  }
}

defineFamily<BrowsId>({
  id: "brows",
  label: "Eyebrows",
  salt: 13,
  traits: [
    { id: "none", label: "None", weight: 1.4 },
    { id: "soft", label: "Soft" },
    { id: "raised", label: "Raised" },
    { id: "serious", label: "Serious" },
    { id: "uni", label: "Unibrow" },
    { id: "worried", label: "Worried" },
    { id: "thick", label: "Thick" },
    { id: "curious", label: "Curious" },
  ],
  hooks: { main: (ctx, id) => renderBrows(ctx, id) },
});
