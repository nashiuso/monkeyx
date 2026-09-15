import { el } from "../svg/elements.js";
import { mixHex, shade } from "./palettes.js";
import type { Palette } from "./palettes.js";

// per-avatar gradient definitions — the entire depth system of the renderer.
// every major mass (skull, torso, limbs, face plate, belly, ears, hair,
// clothing) is shaded by one restrained radial gradient lit from the upper
// left. depth scales how far the stops push toward their light/dark tones,
// so styles can flatten or enrich the same character without new geometry.

export interface DefsOptions {
  readonly palette: Palette;
  readonly accent: string;
  readonly hairColor: string;
  readonly depth: number;
  readonly prefix: string;
  // neon style: emit an accent glow gradient
  readonly glow: boolean;
}

// pull a tonal stop toward its extreme by the depth factor
function stopTone(mid: string, target: string, depth: number): string {
  const t = Math.min(1, Math.max(0, depth));
  return mixHex(mid, target, t);
}

export function buildDefs(o: DefsOptions): string {
  const p = o.palette;
  const d = o.depth;
  const id = (name: string): string => `${o.prefix}-${name}`;

  const furRadial = (cid: string, cyd: string): string =>
    el(
      "radialGradient",
      {
        id: id(cid),
        cx: `${cid === "torso" ? 44 : 40}%`,
        cy: `${cyd}%`,
        r: cid === "torso" ? "95%" : "90%",
      },
      el("stop", {
        offset: "0%",
        "stop-color": stopTone(p.fur, p.furLight, d),
      }) +
        el("stop", {
          offset: cid === "torso" ? "62%" : "58%",
          "stop-color": p.fur,
        }) +
        el("stop", {
          offset: "100%",
          "stop-color": stopTone(p.fur, p.furDeep, d),
        }),
    );

  const defs = [
    furRadial("fur", "26"),
    furRadial("torso", "22"),
    el(
      "radialGradient",
      { id: id("limb"), cx: "42%", cy: "28%", r: "92%" },
      el("stop", { offset: "0%", "stop-color": p.fur }) +
        el("stop", {
          offset: "100%",
          "stop-color": stopTone(p.fur, p.furDark, d),
        }),
    ),
    el(
      "radialGradient",
      { id: id("face"), cx: "50%", cy: "36%", r: "82%" },
      el("stop", {
        offset: "0%",
        "stop-color": stopTone(p.face, p.faceLight, d),
      }) +
        el("stop", { offset: "68%", "stop-color": p.face }) +
        el("stop", {
          offset: "100%",
          "stop-color": stopTone(p.face, p.faceDeep, d),
        }),
    ),
    el(
      "radialGradient",
      { id: id("belly"), cx: "46%", cy: "32%", r: "85%" },
      el("stop", { offset: "0%", "stop-color": p.belly }) +
        el("stop", { offset: "100%", "stop-color": shade(p.belly, -0.1) }),
    ),
    el(
      "radialGradient",
      { id: id("ear"), cx: "42%", cy: "38%", r: "85%" },
      el("stop", { offset: "0%", "stop-color": p.fur }) +
        el("stop", {
          offset: "100%",
          "stop-color": stopTone(p.fur, p.furDark, d),
        }),
    ),
    el(
      "radialGradient",
      { id: id("hair"), cx: "42%", cy: "26%", r: "90%" },
      el("stop", {
        offset: "0%",
        "stop-color": mixHex(o.hairColor, "#ffffff", 0.16 * d),
      }) +
        el("stop", {
          offset: "100%",
          "stop-color": shade(o.hairColor, -0.14 * d),
        }),
    ),
    el(
      "radialGradient",
      { id: id("cloth"), cx: "45%", cy: "25%", r: "95%" },
      el("stop", {
        offset: "0%",
        "stop-color": mixHex(o.accent, "#ffffff", 0.16),
      }) +
        el("stop", { offset: "55%", "stop-color": o.accent }) +
        el("stop", { offset: "100%", "stop-color": shade(o.accent, -0.22) }),
    ),
  ];

  if (o.glow) {
    defs.push(
      el(
        "radialGradient",
        { id: id("glow"), cx: "50%", cy: "50%", r: "50%" },
        el("stop", {
          offset: "0%",
          "stop-color": o.accent,
          "stop-opacity": 0.5,
        }) +
          el("stop", {
            offset: "100%",
            "stop-color": o.accent,
            "stop-opacity": 0,
          }),
      ),
    );
  }

  return el("defs", {}, defs.join(""));
}
