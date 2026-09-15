import { el } from "../svg/elements.js";
import { tubePath, mittenPath, f, type Pt } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import { WAVE_ARM_DUR, duration } from "../animation/animations.js";
import type { RenderContext } from "./types.js";

export const ARMS_IDS = [
  "down",
  "raised",
  "wave",
  "hips",
  "forward",
  "cheer",
  "think",
  "cross",
] as const;
export type ArmsId = (typeof ARMS_IDS)[number];

// one posed arm: shoulder → elbow → wrist joint chain + a mitten hand.
// t = thumb direction (+1 toward +x / body center for the left arm)
interface ArmPose {
  readonly elbow: readonly [number, number];
  readonly wrist: readonly [number, number];
  readonly hand: readonly [number, number];
  readonly thumb: number;
  // no visible hand (tucked under the crossed opposite arm)
  readonly hiddenHand?: boolean;
}

// shoulder → elbow → wrist joints for both arms in the given pose.
// exported so clothing can fit sleeves onto the exact arm direction.
export function armJoints(
  ctx: RenderContext,
  id: ArmsId,
): { left: [Pt, Pt, Pt]; right: [Pt, Pt, Pt] } {
  const a = ctx.anchors;
  const [slx, sly] = a.shoulderL;
  const [srx, sry] = a.shoulderR;
  const [l, r] = armGeom(ctx, id);
  return {
    left: [[slx, sly], l.elbow, l.wrist],
    right: [[srx, sry], r.elbow, r.wrist],
  };
}

function armGeom(ctx: RenderContext, id: ArmsId): readonly [ArmPose, ArmPose] {
  const a = ctx.anchors;
  const [slx, sly] = a.shoulderL;
  const [srx, sry] = a.shoulderR;
  const cx = a.cx;

  const down = (sx: number, side: number): ArmPose => ({
    elbow: [sx + side * 7, sly + 24],
    wrist: [sx + side * 9, sly + 47],
    hand: [sx + side * 9.5, sly + 55],
    thumb: -side,
  });
  const raised = (sx: number, side: number): ArmPose => ({
    elbow: [sx + side * 15, sly - 15],
    wrist: [sx + side * 21, sly - 33],
    hand: [sx + side * 22, sly - 40],
    thumb: -side,
  });
  const hips = (sx: number, side: number): ArmPose => ({
    elbow: [sx - side * 16, sly + 18],
    wrist: [sx - side * 5, sly + 35],
    hand: [sx - side * 1, sly + 37],
    thumb: -side,
  });
  const forward = (sx: number, side: number): ArmPose => ({
    elbow: [sx - side * 4, sly + 22],
    wrist: [cx + side * 9, sly + 36],
    hand: [cx + side * 5, sly + 39],
    thumb: -side,
  });
  const think: ArmPose = {
    elbow: [srx - 7, sry + 21],
    wrist: [srx - 17, sry + 5],
    hand: [srx - 21, sry - 6],
    thumb: -1,
  };

  switch (id) {
    case "down":
      return [down(slx, -1), down(srx, 1)];
    case "raised":
    case "cheer":
      return [raised(slx, -1), raised(srx, 1)];
    case "wave":
      return [down(slx, -1), raised(srx, 1)];
    case "hips":
      return [hips(slx, -1), hips(srx, 1)];
    case "forward":
      return [forward(slx, -1), forward(srx, 1)];
    case "think":
      return [down(slx, -1), think];
    case "cross":
      return [
        {
          elbow: [slx + 13, sly + 16],
          wrist: [cx + 12, sly + 15],
          hand: [cx + 17, sly + 13],
          thumb: 1,
          hiddenHand: true,
        },
        {
          elbow: [srx - 13, sly + 19],
          wrist: [cx - 14, sly + 18],
          hand: [cx - 19, sly + 16],
          thumb: -1,
        },
      ];
  }
}

function limb(ctx: RenderContext, side: number, pose: ArmPose): string {
  const a = ctx.anchors;
  const [sx, sy] = side === -1 ? a.shoulderL : a.shoulderR;
  const tube = el("path", {
    d: tubePath([[sx, sy + 2], pose.elbow, pose.wrist], 13, 9.5),
    fill: ctx.grad("limb"),
  });
  // contact seam where the arm meets the torso keeps the masses separate
  const seam = el("path", {
    d: `M ${f(sx - side * 1)} ${f(sy + 6)} Q ${f((sx + pose.elbow[0]) / 2)} ${f((sy + pose.wrist[1]) / 2)} ${f(pose.wrist[0] - side * 2)} ${f(pose.wrist[1] - 2)}`,
    fill: "none",
    stroke: ctx.palette.furDark,
    "stroke-width": 1.4,
    "stroke-linecap": "round",
    opacity: 0.3,
  });
  if (pose.hiddenHand) return tube;
  const hand =
    el("path", {
      d: mittenPath(pose.hand[0], pose.hand[1], pose.thumb, 0.92),
      fill: ctx.palette.furDark,
    }) +
    el("path", {
      d: `M ${f(pose.hand[0] + pose.thumb * 2.2)} ${f(pose.hand[1] - 4)} Q ${f(pose.hand[0] + pose.thumb * 3)} ${f(pose.hand[1])} ${f(pose.hand[0] + pose.thumb * 2)} ${f(pose.hand[1] + 5)}`,
      fill: "none",
      stroke: ctx.palette.fur,
      "stroke-width": 0.9,
      "stroke-linecap": "round",
      opacity: 0.7,
    });
  return tube + seam + hand;
}

export function renderArms(ctx: RenderContext, id: ArmsId): string {
  const [left, right] = armGeom(ctx, id);
  const leftArm = limb(ctx, -1, left);

  // wave rotates the raised right arm around its exact shoulder pivot;
  // the pivot css lives in the namespaced style block
  const waving = ctx.animations.has("wave") && id === "wave";
  let rightArm = limb(ctx, 1, right);
  if (waving) {
    const [srx, sry] = ctx.anchors.shoulderR;
    ctx.extraCss.push(
      `.${ctx.prefix}-armr{transform-box:view-box;transform-origin:${f(srx)}px ${f(sry)}px;animation:${ctx.prefix}-wavearm ${duration(
        WAVE_ARM_DUR,
        ctx.speed,
      )} ease-in-out infinite}@keyframes ${ctx.prefix}-wavearm{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(16deg)}}`,
    );
    rightArm = el("g", { class: `${ctx.prefix}-armr` }, rightArm);
  }

  return leftArm + rightArm;
}

defineFamily<ArmsId>({
  id: "arms",
  label: "Arms",
  salt: 17,
  traits: [
    { id: "down", label: "Down" },
    { id: "raised", label: "Raised" },
    { id: "wave", label: "Waving" },
    { id: "hips", label: "Hands on hips" },
    { id: "forward", label: "Forward" },
    { id: "cheer", label: "Cheer" },
    { id: "think", label: "Thinking" },
    { id: "cross", label: "Crossed" },
  ],
  hooks: { main: (ctx, id) => renderArms(ctx, id) },
});
