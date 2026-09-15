import type { Seed128 } from "./hash.js";

// deterministic pseudo-random generator api used across the pipeline
export interface Rng {
  // uniform u32
  next(): number;
  // uniform [0, 1)
  float(): number;
  // uniform integer in [0, maxExclusive)
  int(maxExclusive: number): number;
  // uniform float in [min, max)
  range(min: number, max: number): number;
  // uniform pick from a non-empty list
  pick<T>(items: readonly T[]): T;
  // weighted pick; weights must be positive
  weighted<T>(items: readonly (readonly [T, number])[]): T;
}

// xoshiro128**: fast, tiny, well-distributed 128-bit state generator
export function createRng(seed: Seed128): Rng {
  let s0 = seed.a >>> 0;
  let s1 = seed.b >>> 0;
  let s2 = seed.c >>> 0;
  let s3 = seed.d >>> 0;

  // xoshiro must never start from an all-zero state
  if ((s0 | s1 | s2 | s3) === 0) {
    s0 = 0x9e3779b9;
  }

  const rotl = (x: number, k: number): number =>
    ((x << k) | (x >>> (32 - k))) >>> 0;

  const next = (): number => {
    const result = Math.imul(rotl(Math.imul(s1, 5), 7), 9) >>> 0;
    const t = (s1 << 9) >>> 0;
    s2 = (s2 ^ s0) >>> 0;
    s3 = (s3 ^ s1) >>> 0;
    s1 = (s1 ^ s2) >>> 0;
    s0 = (s0 ^ s3) >>> 0;
    s2 = (s2 ^ t) >>> 0;
    s3 = rotl(s3, 11);
    return result;
  };

  const rng: Rng = {
    next,
    float: () => next() / 4294967296,
    int: (maxExclusive) => {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new RangeError("maxExclusive must be a positive integer");
      }
      return Math.floor(rng.float() * maxExclusive);
    },
    range: (min, max) => min + rng.float() * (max - min),
    pick: (items) => {
      if (items.length === 0)
        throw new RangeError("cannot pick from empty list");
      return items[rng.int(items.length)] as (typeof items)[number];
    },
    weighted: (items) => {
      if (items.length === 0)
        throw new RangeError("cannot pick from empty list");
      let total = 0;
      for (const [, weight] of items) {
        if (!(weight > 0)) throw new RangeError("weights must be positive");
        total += weight;
      }
      let ticket = rng.float() * total;
      for (const [value, weight] of items) {
        ticket -= weight;
        if (ticket < 0) return value;
      }
      return items[items.length - 1]![0];
    },
  };

  return rng;
}

// splitmix32 finalizer used to derive independent sub-seeds
function splitmix32(x: number, salt: number): number {
  let z = (x ^ Math.imul(salt, 0x9e3779b9)) >>> 0;
  z = (z + 0x6d2b79f5) >>> 0;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad) >>> 0;
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97) >>> 0;
  return (z ^ (z >>> 15)) >>> 0;
}

// derive an independent 128-bit sub-seed from a base seed and a salt,
// so each trait family gets its own random stream
export function deriveSeed(base: Seed128, salt: number): Seed128 {
  return {
    a: splitmix32(base.a, salt),
    b: splitmix32(base.b, salt + 0x1000),
    c: splitmix32(base.c, salt + 0x2000),
    d: splitmix32(base.d, salt + 0x3000),
  };
}
