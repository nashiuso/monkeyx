import type { HeadId } from "../traits/head.js";
import type { BodyId } from "../traits/body.js";

// the anatomical skeleton of one avatar, computed once from (head, body).
// every renderer derives its local coordinates from these anchors so that
// all trait variants stay anatomically coherent across combinations.
//
// the character is a stylized monkey: slightly oversized head on a compact
// torso, short integrated neck, substantial limbs. canvas is 256×256 with
// the character centered on x=128 and grounded near y=237.
export interface Anchors {
  // ---- head ----
  readonly cx: number;
  // head center
  readonly cy: number;
  readonly headRx: number;
  readonly headRy: number;
  // skull top / jaw line
  readonly headTop: number;
  readonly jawY: number;
  // ---- face plate (two-lobe mask) ----
  readonly faceCx: number;
  readonly faceCy: number;
  readonly faceRx: number;
  readonly faceRy: number;
  // ---- facial features ----
  readonly eyeDx: number;
  readonly eyeY: number;
  readonly eyeRx: number;
  readonly eyeRy: number;
  readonly browY: number;
  readonly noseY: number;
  readonly mouthY: number;
  // ---- ears ----
  readonly earDx: number;
  readonly earCy: number;
  readonly earR: number;
  // ---- neck / torso ----
  readonly neckY: number;
  readonly torsoTop: number;
  readonly torsoBottom: number;
  readonly shoulderW: number;
  readonly hipW: number;
  readonly bellyCy: number;
  readonly bellyRx: number;
  readonly bellyRy: number;
  // ---- limbs ----
  readonly shoulderL: readonly [number, number];
  readonly shoulderR: readonly [number, number];
  readonly hipL: readonly [number, number];
  readonly hipR: readonly [number, number];
  // ---- ground ----
  readonly groundY: number;
  readonly footY: number;
}

const HEAD_DIMS: Record<HeadId, { rx: number; ry: number; cy: number }> = {
  round: { rx: 44, ry: 46, cy: 78 },
  soft: { rx: 46.5, ry: 44.5, cy: 79 },
  wide: { rx: 52, ry: 42, cy: 79 },
  tall: { rx: 41, ry: 50, cy: 76 },
  boulder: { rx: 47, ry: 44, cy: 80 },
  narrow: { rx: 39, ry: 48, cy: 78 },
};

const BODY_DIMS: Record<
  BodyId,
  { top: number; shoulderW: number; hipW: number; bottom: number }
> = {
  slim: { top: 136, shoulderW: 28, hipW: 31, bottom: 208 },
  stocky: { top: 130, shoulderW: 34, hipW: 38, bottom: 206 },
  oval: { top: 129, shoulderW: 33, hipW: 35, bottom: 209 },
  slouch: { top: 138, shoulderW: 30, hipW: 33, bottom: 206 },
  plump: { top: 131, shoulderW: 36, hipW: 40, bottom: 207 },
  lanky: { top: 134, shoulderW: 26, hipW: 29, bottom: 209 },
};

// fixed square canvas of every generated avatar
export const VIEWBOX_SIZE = 256;

export function computeAnchors(head: HeadId, body: BodyId): Anchors {
  const h = HEAD_DIMS[head];
  const b = BODY_DIMS[body];
  const cx = 128;
  const cy = h.cy;
  const shoulderY = b.top + 13;
  const hipY = b.bottom - 13;
  return {
    cx,
    cy,
    headRx: h.rx,
    headRy: h.ry,
    headTop: cy - h.ry,
    jawY: cy + h.ry - 2,
    // face plate sits on the lower-middle of the skull
    faceCx: cx,
    faceCy: cy + h.ry * 0.28,
    faceRx: Math.min(33, h.rx - 10),
    faceRy: h.ry * 0.68,
    eyeDx: 16,
    eyeY: cy + 6,
    eyeRx: 9.5,
    eyeRy: 10.5,
    browY: cy - 10.5,
    noseY: cy + 23,
    mouthY: cy + 31.5,
    earDx: h.rx + 6,
    earCy: cy + 2,
    earR: 13,
    neckY: cy + h.ry - 6,
    torsoTop: b.top,
    torsoBottom: b.bottom,
    shoulderW: b.shoulderW,
    hipW: b.hipW,
    bellyCy: b.top + 51,
    bellyRx: b.shoulderW * 0.72,
    bellyRy: 21.5,
    shoulderL: [cx - b.shoulderW * 0.78, shoulderY],
    shoulderR: [cx + b.shoulderW * 0.78, shoulderY],
    hipL: [cx - b.hipW * 0.52, hipY],
    hipR: [cx + b.hipW * 0.52, hipY],
    groundY: 237,
    footY: 229,
  };
}
