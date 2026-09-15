// round to 2 decimal places (used by the svg number formatter as well)
export const round2 = (n: number): number => Math.round(n * 100) / 100;

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n));

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;
