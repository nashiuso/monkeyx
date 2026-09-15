import { el } from "./elements.js";
import { round2 } from "../utils/math.js";

// shared decorative shapes reused by eyes, extras and patterns so the
// geometry stays identical everywhere they appear

function n(v: number): string {
  return String(round2(v));
}

// four-point sparkle star centered on (x, y)
export function star(x: number, y: number, r: number, fill: string): string {
  const q = r * 0.22;
  return el("path", {
    d: `M ${n(x)} ${n(y - r)} Q ${n(x + q)} ${n(y - q)} ${n(x + r)} ${n(y)} Q ${n(x + q)} ${n(y + q)} ${n(x)} ${n(y + r)} Q ${n(x - q)} ${n(y + q)} ${n(x - r)} ${n(y)} Q ${n(x - q)} ${n(y - q)} ${n(x)} ${n(y - r)} Z`,
    fill,
  });
}

// five-point star (used for star pupils); outer radius r, inner r*0.44
export function star5(x: number, y: number, r: number, fill: string): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.44;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(
      `${n(x + radius * Math.cos(angle))} ${n(y + radius * Math.sin(angle))}`,
    );
  }
  return el("polygon", { points: points.join(" "), fill });
}

// small heart centered roughly on (x, y); s scales the shape
export function heart(x: number, y: number, s: number, fill: string): string {
  const d = [
    `M ${n(x)} ${n(y + 3 * s)}`,
    `C ${n(x - s)} ${n(y)} ${n(x - 6 * s)} ${n(y - s)} ${n(x - 6 * s)} ${n(y - 5 * s)}`,
    `C ${n(x - 6 * s)} ${n(y - 8 * s)} ${n(x - 3 * s)} ${n(y - 9 * s)} ${n(x)} ${n(y - 6 * s)}`,
    `C ${n(x + 3 * s)} ${n(y - 9 * s)} ${n(x + 6 * s)} ${n(y - 8 * s)} ${n(x + 6 * s)} ${n(y - 5 * s)}`,
    `C ${n(x + 6 * s)} ${n(y - s)} ${n(x + s)} ${n(y)} ${n(x)} ${n(y + 3 * s)}`,
    "Z",
  ].join(" ");
  return el("path", { d, fill });
}

// eighth note (used by the notes extra)
export function note(x: number, y: number, s: number, fill: string): string {
  return (
    el("ellipse", {
      cx: x,
      cy: y,
      rx: 2.6 * s,
      ry: 2 * s,
      fill,
      transform: `rotate(-18 ${n(x)} ${n(y)})`,
    }) +
    el("path", {
      d: `M ${n(x + 2.2 * s)} ${n(y - 0.6 * s)} L ${n(x + 2.2 * s)} ${n(y - 8 * s)} L ${n(x + 4.4 * s)} ${n(y - 7 * s)} L ${n(x + 4.4 * s)} ${n(y - 1 * s)} Z`,
      fill,
    })
  );
}
