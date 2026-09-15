// monkeyx color system v3 — material-aware palette families.
// every palette carries the full tonal range the renderer needs for depth:
// fur base + light/deep/dark for gradient stops and shadow masses,
// face plate range, inner-ear tone, belly tone, and an iris tone.
// accent pools and derived tints (shade/mix) are the only color math in the library.
export interface Palette {
  readonly id: string;
  readonly label: string;
  // fur range (gradient top → base → shadow masses)
  readonly furLight: string;
  readonly fur: string;
  readonly furDeep: string;
  readonly furDark: string;
  // face plate range
  readonly faceLight: string;
  readonly face: string;
  readonly faceDeep: string;
  // inner ears + belly patch
  readonly inner: string;
  readonly belly: string;
  // eye iris tone
  readonly iris: string;
}

// v2 ids keep their identity; tones were re-tuned for dimensional rendering
export const PALETTES: readonly Palette[] = [
  {
    id: "cocoa",
    label: "Cocoa",
    furLight: "#a56b45",
    fur: "#8a5636",
    furDeep: "#6d4128",
    furDark: "#54331e",
    faceLight: "#f9e3c4",
    face: "#f0d0a4",
    faceDeep: "#d8ac7c",
    inner: "#e2b083",
    belly: "#f7e0c2",
    iris: "#4c3018",
  },
  {
    id: "honey",
    label: "Honey",
    furLight: "#d4a05f",
    fur: "#c08a4a",
    furDeep: "#9c6c36",
    furDark: "#7d5527",
    faceLight: "#faeed3",
    face: "#f4dfb6",
    faceDeep: "#dfbd8c",
    inner: "#e8c48f",
    belly: "#f8e9c8",
    iris: "#54391f",
  },
  {
    id: "sand",
    label: "Sand",
    furLight: "#e0c29a",
    fur: "#d3b184",
    furDeep: "#b39062",
    furDark: "#94734a",
    faceLight: "#fbf2df",
    face: "#f6ebd3",
    faceDeep: "#dcc5a0",
    inner: "#e6cfa6",
    belly: "#faf0da",
    iris: "#5a4527",
  },
  {
    id: "ginger",
    label: "Ginger",
    furLight: "#dd9050",
    fur: "#cf7a38",
    furDeep: "#ab5c26",
    furDark: "#8a471d",
    faceLight: "#fbe6c4",
    face: "#f6d9ae",
    faceDeep: "#e0b57f",
    inner: "#eab87f",
    belly: "#f9e3c0",
    iris: "#54301a",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    furLight: "#636375",
    fur: "#4e4e5c",
    furDeep: "#3c3c48",
    furDark: "#2e2e38",
    faceLight: "#dedee8",
    face: "#c9c9d4",
    faceDeep: "#a8a8b8",
    inner: "#b0b0c0",
    belly: "#e2e2ea",
    iris: "#26262e",
  },
  {
    id: "slate",
    label: "Slate",
    furLight: "#8093a8",
    fur: "#6c7f94",
    furDeep: "#56687b",
    furDark: "#445262",
    faceLight: "#e8eff4",
    face: "#d6e0e8",
    faceDeep: "#b3c3cf",
    inner: "#bfcfdd",
    belly: "#eaf1f6",
    iris: "#2f3a46",
  },
  {
    id: "rose",
    label: "Rose",
    furLight: "#d49c9c",
    fur: "#c48888",
    furDeep: "#a96f6f",
    furDark: "#8a5858",
    faceLight: "#f9eae7",
    face: "#f2dcd8",
    faceDeep: "#d9b4ad",
    inner: "#e5b8b0",
    belly: "#f8e9e5",
    iris: "#4c3028",
  },
  {
    id: "moss",
    label: "Moss",
    furLight: "#92a26b",
    fur: "#7d8c57",
    furDeep: "#667449",
    furDark: "#515c3a",
    faceLight: "#eff0dc",
    face: "#e3e6c8",
    faceDeep: "#c3c9a0",
    inner: "#ccd2a8",
    belly: "#f0f1de",
    iris: "#3c3a20",
  },
  {
    id: "snow",
    label: "Snow",
    furLight: "#c8ccd6",
    fur: "#b2b7c3",
    furDeep: "#969caa",
    furDark: "#7d8390",
    faceLight: "#f5f5f1",
    face: "#eaeae4",
    faceDeep: "#cfd0c8",
    inner: "#dfe0d8",
    belly: "#f1f1ea",
    iris: "#494944",
  },
  {
    id: "graphite",
    label: "Graphite",
    furLight: "#858585",
    fur: "#6e6e6e",
    furDeep: "#545454",
    furDark: "#424242",
    faceLight: "#e8e8e8",
    face: "#d9d9d9",
    faceDeep: "#bcbcbc",
    inner: "#c6c6c6",
    belly: "#ebebeb",
    iris: "#2e2e2e",
  },
  {
    id: "peach",
    label: "Peach",
    furLight: "#dd9d78",
    fur: "#cf8a63",
    furDeep: "#b06f4a",
    furDark: "#8f5738",
    faceLight: "#fbede0",
    face: "#f6ddc9",
    faceDeep: "#e2bda0",
    inner: "#e8c1a4",
    belly: "#fae8da",
    iris: "#54341f",
  },
  {
    id: "olive",
    label: "Olive",
    furLight: "#a8a873",
    fur: "#93935f",
    furDeep: "#78784b",
    furDark: "#60603c",
    faceLight: "#f2f2de",
    face: "#e8e8cd",
    faceDeep: "#cfcfa3",
    inner: "#d8d8b0",
    belly: "#f0f0da",
    iris: "#403e22",
  },
  {
    id: "plum",
    label: "Plum",
    furLight: "#a886a3",
    fur: "#93718f",
    furDeep: "#7a5c78",
    furDark: "#634a60",
    faceLight: "#f0e4ee",
    face: "#e6d3e2",
    faceDeep: "#cbb0c8",
    inner: "#d5b8d0",
    belly: "#f1e6f0",
    iris: "#3f2c40",
  },
  {
    id: "rust",
    label: "Rust",
    furLight: "#cc7856",
    fur: "#b96244",
    furDeep: "#9c4e34",
    furDark: "#7d3d28",
    faceLight: "#f8e0d0",
    face: "#f0cdb4",
    faceDeep: "#d8ab8a",
    inner: "#e3b494",
    belly: "#f6ddcc",
    iris: "#4c2a1a",
  },
  {
    id: "fog",
    label: "Fog",
    furLight: "#b6c2cb",
    fur: "#a4b1bc",
    furDeep: "#8795a1",
    furDark: "#6e7c88",
    faceLight: "#f1f5f7",
    face: "#e4eaee",
    faceDeep: "#c2cfd8",
    inner: "#cfd9e0",
    belly: "#f2f6f8",
    iris: "#3a4650",
  },
];

export const PALETTE_IDS: readonly string[] = PALETTES.map((p) => p.id);

export function paletteById(id: string): Palette | undefined {
  return PALETTES.find((p) => p.id === id);
}

// clothing / accessory accent colors
export const ACCENTS: readonly string[] = [
  "#de5b5b",
  "#4a90d9",
  "#53a46c",
  "#efa83c",
  "#8a7bc6",
  "#43ae9e",
  "#de8fb4",
  "#41518c",
];

// style-scoped accent sets
export const MUTED_ACCENTS: readonly string[] = [
  "#a86a4f",
  "#7d8c57",
  "#8a7bc6",
  "#c48888",
  "#56687b",
  "#b98b3c",
];

export const NEON_ACCENTS: readonly string[] = [
  "#ff5b7f",
  "#3fd2c7",
  "#ffd166",
  "#7c5cff",
  "#4cc9f0",
];

// natural hair colors (the cap zone is always furDark; these tint hair masses)
export const HAIR_NEUTRALS: readonly string[] = [
  "#3b2c22",
  "#1f1f24",
  "#b4632f",
  "#e0b96f",
  "#7a7a80",
];

// light auto-background tints (every fur reads well on them)
export const AUTO_BACKGROUNDS: readonly string[] = [
  "#f4eee3",
  "#eaf1ea",
  "#f7ece4",
  "#edf1f6",
  "#f5eef4",
  "#e9f1f2",
  "#f1efe9",
  "#f6efdf",
];

// dark auto-backgrounds for night / neon styles
export const DARK_BACKGROUNDS: readonly string[] = [
  "#2b2723",
  "#24242c",
  "#2d2430",
  "#1f2a26",
  "#302326",
];

// shift a hex color toward black (amount < 0) or white (amount > 0)
export function shade(hex: string, amount: number): string {
  const n = Number.parseInt(hex.slice(1), 16);
  const target = amount < 0 ? 0 : 255;
  const p = Math.abs(amount);
  const ch = (shift: number): number => {
    const c = (n >> shift) & 255;
    return Math.round((target - c) * p + c);
  };
  const to2 = (v: number): string => v.toString(16).padStart(2, "0");
  return `#${to2(ch(16))}${to2(ch(8))}${to2(ch(0))}`;
}

// linear mix between two hex colors, t in [0, 1]
export function mixHex(a: string, b: string, t: number): string {
  const na = Number.parseInt(a.slice(1), 16);
  const nb = Number.parseInt(b.slice(1), 16);
  const ch = (shift: number): number => {
    const ca = (na >> shift) & 255;
    const cb = (nb >> shift) & 255;
    return Math.round(ca + (cb - ca) * t);
  };
  const to2 = (v: number): string => v.toString(16).padStart(2, "0");
  return `#${to2(ch(16))}${to2(ch(8))}${to2(ch(0))}`;
}
