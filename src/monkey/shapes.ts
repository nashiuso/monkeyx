// reusable organic path builders — the shared geometry vocabulary of the
// visual system. every renderer composes characters from these primitives
// so that curves, junctions and proportions stay consistent across traits.
// all functions are pure: coordinates in → path data out.

export const f = (v: number): string => String(Math.round(v * 100) / 100);

export type Pt = readonly [number, number];

// organic skull silhouette: broad cranium tapering to a softened jaw
export function headPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  flatness = 0,
): string {
  const top = cy - ry + flatness * 4;
  return [
    `M ${f(cx)} ${f(top)}`,
    `C ${f(cx + rx * 0.62)} ${f(top + flatness * 2)} ${f(cx + rx)} ${f(cy - ry * 0.62)} ${f(cx + rx)} ${f(cy - ry * 0.18)}`,
    `C ${f(cx + rx)} ${f(cy + ry * 0.28)} ${f(cx + rx * 0.72)} ${f(cy + ry * 0.72)} ${f(cx + rx * 0.5)} ${f(cy + ry * 0.94)}`,
    `C ${f(cx + rx * 0.3)} ${f(cy + ry)} ${f(cx - rx * 0.3)} ${f(cy + ry)} ${f(cx - rx * 0.5)} ${f(cy + ry * 0.94)}`,
    `C ${f(cx - rx * 0.72)} ${f(cy + ry * 0.72)} ${f(cx - rx)} ${f(cy + ry * 0.28)} ${f(cx - rx)} ${f(cy - ry * 0.18)}`,
    `C ${f(cx - rx)} ${f(cy - ry * 0.62)} ${f(cx - rx * 0.62)} ${f(top + flatness * 2)} ${f(cx)} ${f(top)}`,
    "Z",
  ].join(" ");
}

// the signature two-lobe face plate: brow lobes flowing into a wide muzzle,
// drawn as one smooth path (never separate circles)
export function facePlatePath(
  fx: number,
  fy: number,
  rx: number,
  ry: number,
): string {
  return [
    `M ${f(fx - rx * 0.72)} ${f(fy - ry * 0.87)}`,
    `C ${f(fx - rx * 0.45)} ${f(fy - ry * 1.08)} ${f(fx - rx * 0.18)} ${f(fy - ry * 0.98)} ${f(fx)} ${f(fy - ry * 0.78)}`,
    `C ${f(fx + rx * 0.18)} ${f(fy - ry * 0.98)} ${f(fx + rx * 0.45)} ${f(fy - ry * 1.08)} ${f(fx + rx * 0.72)} ${f(fy - ry * 0.87)}`,
    `C ${f(fx + rx * 1.02)} ${f(fy - ry * 0.6)} ${f(fx + rx * 1.08)} ${f(fy - ry * 0.1)} ${f(fx + rx * 0.93)} ${f(fy + ry * 0.32)}`,
    `C ${f(fx + rx * 0.85)} ${f(fy + ry * 0.72)} ${f(fx + rx * 0.5)} ${f(fy + ry)} ${f(fx)} ${f(fy + ry)}`,
    `C ${f(fx - rx * 0.5)} ${f(fy + ry)} ${f(fx - rx * 0.85)} ${f(fy + ry * 0.72)} ${f(fx - rx * 0.93)} ${f(fy + ry * 0.32)}`,
    `C ${f(fx - rx * 1.08)} ${f(fy - ry * 0.1)} ${f(fx - rx)} ${f(fy - ry * 0.6)} ${f(fx - rx * 0.72)} ${f(fy - ry * 0.87)}`,
    "Z",
  ].join(" ");
}

// dark crown cap with a soft scalloped hairline; follows the skull silhouette
export function capPath(
  cx: number,
  rx: number,
  topY: number,
  hairline: number,
): string {
  const L = cx - rx + 3;
  const R = cx + rx - 3;
  const p = (t: number): number => L + (R - L) * t;
  const side = topY + (hairline - topY) * 0.45;
  return [
    `M ${f(cx)} ${f(topY)}`,
    `C ${f(cx - rx * 0.6)} ${f(topY)} ${f(L)} ${f(side)} ${f(L)} ${f(hairline + 6)}`,
    `C ${f(p(0.08))} ${f(hairline + 8)} ${f(p(0.16))} ${f(hairline + 2)} ${f(p(0.22))} ${f(hairline - 2)}`,
    `C ${f(p(0.3))} ${f(hairline - 8)} ${f(p(0.4))} ${f(hairline - 8)} ${f(p(0.48))} ${f(hairline - 3)}`,
    `C ${f(p(0.54))} ${f(hairline - 7)} ${f(p(0.62))} ${f(hairline - 7)} ${f(p(0.68))} ${f(hairline - 2)}`,
    `C ${f(p(0.76))} ${f(hairline - 8)} ${f(p(0.86))} ${f(hairline - 8)} ${f(p(0.92))} ${f(hairline + 2)}`,
    `C ${f(p(0.97))} ${f(hairline + 4)} ${f(R - 1)} ${f(hairline + 8)} ${f(R)} ${f(hairline + 6)}`,
    `C ${f(R)} ${f(side)} ${f(cx + rx * 0.6)} ${f(topY)} ${f(cx)} ${f(topY)}`,
    "Z",
  ].join(" ");
}

// organic ear mass; side = -1 (left) or +1 (right)
export function earPath(
  ex: number,
  ey: number,
  r: number,
  side: number,
): string {
  return [
    `M ${f(ex - side * r * 0.5)} ${f(ey - r * 0.8)}`,
    `C ${f(ex + side * r * 0.45)} ${f(ey - r * 1.25)} ${f(ex + side * r * 1.0)} ${f(ey - r * 0.55)} ${f(ex + side * r * 0.75)} ${f(ey + r * 0.35)}`,
    `C ${f(ex + side * r * 0.55)} ${f(ey + r * 0.95)} ${f(ex - side * r * 0.25)} ${f(ey + r * 1.05)} ${f(ex - side * r * 0.8)} ${f(ey + r * 0.6)}`,
    `C ${f(ex - side * r * 1.0)} ${f(ey + r * 0.2)} ${f(ex - side * r * 0.9)} ${f(ey - r * 0.5)} ${f(ex - side * r * 0.5)} ${f(ey - r * 0.8)}`,
    "Z",
  ].join(" ");
}

// tapered brow crescent: (x1,y1)→(x2,y2) with arch height and thickness
// tMid (center) / tEnd (tips)
export function browPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  arch: number,
  tMid: number,
  tEnd: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return [
    `M ${f(x1)} ${f(y1)}`,
    `Q ${f(mx)} ${f(my - arch)} ${f(x2)} ${f(y2)}`,
    `Q ${f(mx)} ${f(my - arch + tMid)} ${f(x1)} ${f(y1 + tEnd)}`,
    "Z",
  ].join(" ");
}

// mitten hand: rounded palm with the thumb fused on the inside
// t = thumb direction (+1 thumb toward +x, -1 toward -x)
export function mittenPath(
  hx: number,
  hy: number,
  t: number,
  scale = 1,
): string {
  const s = (v: number): number => v * scale * t;
  const x = (v: number): number => hx + v * scale;
  return [
    `M ${f(x(-s(6.5)))} ${f(hy - 5.5 * scale)}`,
    `C ${f(x(-s(8.5)))} ${f(hy - 1.5 * scale)} ${f(x(-s(8.5)))} ${f(hy + 4 * scale)} ${f(x(-s(5.5)))} ${f(hy + 6.8 * scale)}`,
    `C ${f(x(-s(1.5)))} ${f(hy + 9.2 * scale)} ${f(x(s(4)))} ${f(hy + 8.8 * scale)} ${f(x(s(6.5)))} ${f(hy + 5.5 * scale)}`,
    `C ${f(x(s(8.5)))} ${f(hy + 2.8 * scale)} ${f(x(s(8.8)))} ${f(hy - 1 * scale)} ${f(x(s(7.2)))} ${f(hy - 3.5 * scale)}`,
    `C ${f(x(s(9.5)))} ${f(hy - 4.5 * scale)} ${f(x(s(10)))} ${f(hy - 8 * scale)} ${f(x(s(7.5)))} ${f(hy - 8.5 * scale)}`,
    `C ${f(x(s(5.5)))} ${f(hy - 9 * scale)} ${f(x(s(3)))} ${f(hy - 7.8 * scale)} ${f(x(s(1.5)))} ${f(hy - 6.2 * scale)}`,
    `C ${f(x(-s(0.5)))} ${f(hy - 8 * scale)} ${f(x(-s(4.5)))} ${f(hy - 8 * scale)} ${f(x(-s(6.5)))} ${f(hy - 5.5 * scale)}`,
    "Z",
  ].join(" ");
}

// foot mass with a soft toe hint
export function footPath(fx: number, fy: number): string {
  return [
    `M ${f(fx - 13.5)} ${f(fy - 2)}`,
    `C ${f(fx - 14)} ${f(fy - 8)} ${f(fx - 8)} ${f(fy - 10.5)} ${f(fx - 2)} ${f(fy - 10.5)}`,
    `C ${f(fx + 6)} ${f(fy - 10.5)} ${f(fx + 13.5)} ${f(fy - 7.5)} ${f(fx + 14)} ${f(fy - 2)}`,
    `C ${f(fx + 14)} ${f(fy + 2.5)} ${f(fx + 9)} ${f(fy + 4.5)} ${f(fx + 2)} ${f(fy + 4.5)}`,
    `C ${f(fx - 6)} ${f(fy + 4.5)} ${f(fx - 13)} ${f(fy + 2.5)} ${f(fx - 13.5)} ${f(fy - 2)}`,
    "Z",
  ].join(" ");
}

// small directional fur tuft (crown tufts, cheek tufts, chest fluff)
export function tuftPath(
  x: number,
  y: number,
  w: number,
  h: number,
  points = 3,
): string {
  const pts = Math.max(2, points);
  const step = (w / pts) * 2;
  const parts = [`M ${f(x - w)} ${f(y)}`];
  for (let i = 0; i < pts; i++) {
    const tipX = x - w + step * i + step / 2;
    const baseX = x - w + step * (i + 1);
    parts.push(
      `C ${f(tipX)} ${f(y - h)} ${f(tipX)} ${f(y - h)} ${f(baseX)} ${f(y)}`,
    );
  }
  parts.push("Z");
  return parts.join(" ");
}

// smooth tapered tube along a joint chain (arms, legs, tails)
// pts: 2+ joints, widths taper linearly from w0 to w1
export function tubePath(pts: readonly Pt[], w0: number, w1: number): string {
  const n = pts.length;
  if (n < 2) throw new RangeError("tubePath needs at least 2 joints");
  const halfAt = (i: number): number => (w0 + (w1 - w0) * (i / (n - 1))) / 2;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[i]!;
    const [ax, ay] = pts[Math.max(0, i - 1)]!;
    const [bx, by] = pts[Math.min(n - 1, i + 1)]!;
    let dx = bx - ax;
    let dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const nx = -dy;
    const ny = dx;
    const hw = halfAt(i);
    left.push([px + nx * hw, py + ny * hw]);
    right.push([px - nx * hw, py - ny * hw]);
  }
  const edge = (row: readonly Pt[], reverse: boolean): string => {
    const idx = (i: number): number => (reverse ? n - 1 - i : i);
    let d = `M ${f(row[idx(0)]![0])} ${f(row[idx(0)]![1])}`;
    for (let i = 1; i < n - 1; i++) {
      const a = row[idx(i)]!;
      const b = row[idx(i + 1)]!;
      d += ` Q ${f(a[0])} ${f(a[1])} ${f((a[0] + b[0]) / 2)} ${f((a[1] + b[1]) / 2)}`;
    }
    d += ` L ${f(row[idx(n - 1)]![0])} ${f(row[idx(n - 1)]![1])}`;
    return d;
  };
  const startCap = halfAt(0);
  const endCap = halfAt(n - 1);
  return [
    edge(left, false),
    `A ${f(endCap)} ${f(endCap)} 0 0 1 ${f(right[n - 1]![0])} ${f(right[n - 1]![1])}`,
    edge(right, true),
    `A ${f(startCap)} ${f(startCap)} 0 0 1 ${f(left[0]![0])} ${f(left[0]![1])}`,
    "Z",
  ].join(" ");
}
