// hard cap on seed length keeps hashing bounded for untrusted input
export const MAX_SEED_LENGTH = 4096;

// normalize a seed before hashing: unicode nfc, trim, case fold
// "Alice", "alice " and "\u0041lice" intentionally map to the same avatar
export function normalizeSeed(seed: string): string {
  if (typeof seed !== "string") {
    throw new TypeError("seed must be a string");
  }
  if (seed.length > MAX_SEED_LENGTH) {
    throw new RangeError(`seed exceeds ${MAX_SEED_LENGTH} characters`);
  }
  return seed.normalize("NFC").trim().toLowerCase();
}
