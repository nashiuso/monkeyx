// 128-bit seed derived from an input string
export interface Seed128 {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
}

// generation algorithm version, mixed into the hash on purpose:
// bumping it deterministically changes every generated avatar.
// v2: second-generation visual system (expanded traits, patterns, noses,
// styles, richer palettes).
// v3: the visual rebirth — dimensional character rendering (gradient depth,
// organic anatomy, layered z-order), 8 render styles, revised trait catalog.
export const GENERATION_VERSION = 3;

// four independent fnv-1a style lanes with distinct basis/prime constants,
// finalized with an avalanche pass, produce a 128-bit seed
const BASIS = [0x811c9dc5, 0x01000193, 0x7dcb0949, 0xc2b2ae3d] as const;
const PRIME = [0x01000193, 0x85ebca6b, 0xc2b2ae35, 0x27d4eb2f] as const;

function finalize(x: number): number {
  let h = x >>> 0;
  h = (h ^ (h >>> 15)) >>> 0;
  h = Math.imul(h, 0x2545f491) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  return h >>> 0;
}

export function hashSeed(input: string): Seed128 {
  // utf-8 encode without locale or platform dependence
  const bytes = new TextEncoder().encode(input);
  let a = (BASIS[0] ^ GENERATION_VERSION) >>> 0;
  let b = (BASIS[1] ^ Math.imul(GENERATION_VERSION, 0x9e3779b9)) >>> 0;
  let c = (BASIS[2] ^ Math.imul(GENERATION_VERSION, 0x85ebca6b)) >>> 0;
  let d = (BASIS[3] ^ Math.imul(GENERATION_VERSION, 0x27d4eb2f)) >>> 0;

  for (const byte of bytes) {
    a = Math.imul(a ^ byte, PRIME[0]) >>> 0;
    b = Math.imul(b ^ byte, PRIME[1]) >>> 0;
    c = Math.imul(c ^ byte, PRIME[2]) >>> 0;
    d = Math.imul(d ^ byte, PRIME[3]) >>> 0;
  }

  return { a: finalize(a), b: finalize(b), c: finalize(c), d: finalize(d) };
}

// short hex fingerprint of a seed, used for namespace prefixes
export function seedFingerprint(seed: Seed128): string {
  return (seed.a >>> 0).toString(16).padStart(8, "0");
}
