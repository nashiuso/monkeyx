import { el } from "../svg/elements.js";
import { tubePath, footPath, f } from "../monkey/shapes.js";
import { defineFamily } from "./registry.js";
import type { RenderContext } from "./types.js";

export const LEGS_IDS = [
  "stand",
  "wide",
  "sit",
  "squat",
  "crossed",
  "kick",
] as const;
export type LegsId = (typeof LEGS_IDS)[number];

// a leg: 2-3 joint chain (hip → knee → ankle) rendered as a tapered tube,
// ending in a rounded foot mass. legs sit behind the torso so the thighs
// stay fused into the lower body.
interface LegPose {
  readonly joints: readonly (readonly [number, number])[];
  readonly foot: readonly [number, number];
  readonly footAngle?: number;
  // drawn above the other leg (crossed pose)
  readonly over?: boolean;
  // when set, this leg's shin+foot render in front of the torso (seated poses)
  readonly front?: boolean;
}

function legGeoms(ctx: RenderContext, id: LegsId): readonly [LegPose, LegPose] {
  const a = ctx.anchors;
  const [hlx, hly] = a.hipL;
  const [hrx, hry] = a.hipR;
  const fy = a.footY;

  switch (id) {
    case "stand":
      return [
        {
          joints: [
            [hlx + 2, hly - 2],
            [hlx, fy - 6],
          ],
          foot: [hlx - 3, fy],
        },
        {
          joints: [
            [hrx - 2, hry - 2],
            [hrx, fy - 6],
          ],
          foot: [hrx + 3, fy],
        },
      ];
    case "wide":
      return [
        {
          joints: [
            [hlx + 3, hly - 2],
            [hlx - 8, fy - 6],
          ],
          foot: [hlx - 11, fy],
        },
        {
          joints: [
            [hrx - 3, hry - 2],
            [hrx + 8, fy - 6],
          ],
          foot: [hrx + 11, fy],
        },
      ];
    case "sit":
      // shins cross in front of the lower torso so the seated pose reads
      return [
        {
          joints: [
            [hlx, hly - 2],
            [hlx - 3, hly + 8],
            [hlx - 8, fy - 2],
          ],
          foot: [hlx - 13, fy],
          front: true,
        },
        {
          joints: [
            [hrx, hry - 2],
            [hrx + 3, hry + 8],
            [hrx + 8, fy - 2],
          ],
          foot: [hrx + 13, fy],
          front: true,
        },
      ];
    case "squat":
      return [
        {
          joints: [
            [hlx, hly - 4],
            [hlx - 9, hly + 20],
            [hlx - 12, fy - 4],
          ],
          foot: [hlx - 15, fy + 2],
        },
        {
          joints: [
            [hrx, hry - 4],
            [hrx + 9, hry + 20],
            [hrx + 12, fy - 4],
          ],
          foot: [hrx + 15, fy + 2],
        },
      ];
    case "crossed":
      // right shin crosses visibly in front of the left
      return [
        {
          joints: [
            [hlx + 2, hly - 2],
            [hlx + 1, fy - 6],
          ],
          foot: [hlx - 1, fy],
        },
        {
          joints: [
            [hrx - 2, hry - 2],
            [hrx - 16, hry + 20],
            [hlx - 2, fy - 6],
          ],
          foot: [hlx - 5, fy],
          over: true,
        },
      ];
    case "kick":
      return [
        {
          joints: [
            [hlx + 2, hly - 2],
            [hlx, fy - 6],
          ],
          foot: [hlx - 3, fy],
        },
        {
          joints: [
            [hrx - 2, hry - 2],
            [hrx + 12, hry + 12],
            [hrx + 19, hry + 14],
          ],
          foot: [hrx + 26, hry + 15],
          footAngle: 24,
          over: true,
        },
      ];
  }
}

function renderLeg(ctx: RenderContext, pose: LegPose): string {
  const tube = el("path", {
    d: tubePath(pose.joints, 17, 14.5),
    fill: ctx.grad("limb"),
  });
  const [fx, fy] = pose.foot;
  const foot = el(
    "path",
    pose.footAngle
      ? {
          d: footPath(0, 0),
          fill: ctx.palette.furDark,
          transform: `translate(${f(fx)} ${f(fy)}) rotate(${pose.footAngle})`,
        }
      : { d: footPath(fx, fy), fill: ctx.palette.furDark },
  );
  // toe hint
  const toe = pose.footAngle
    ? ""
    : el("path", {
        d: `M ${f(fx + 1)} ${f(fy - 10)} Q ${f(fx + 3)} ${f(fy - 11.6)} ${f(fx + 4.8)} ${f(fy - 10.4)}`,
        stroke: ctx.colors.ink,
        "stroke-width": 0.9,
        "stroke-linecap": "round",
        fill: "none",
        opacity: 0.3,
      });
  return tube + foot + toe;
}

export function renderLegs(ctx: RenderContext, id: LegsId): string {
  const [left, right] = legGeoms(ctx, id);
  const back = [left, right].filter((l) => !l.front);
  // the "over" leg (crossed/kick) draws on top of the other
  return back
    .reverse()
    .map((l) => renderLeg(ctx, l))
    .join("");
}

// seated poses: shins and feet that sit in front of the torso
export function renderLegsFront(ctx: RenderContext, id: LegsId): string {
  const [left, right] = legGeoms(ctx, id);
  const front = [left, right].filter((l) => l.front);
  return front.map((l) => renderLeg(ctx, l)).join("");
}

defineFamily<LegsId>({
  id: "legs",
  label: "Legs",
  salt: 18,
  traits: [
    { id: "stand", label: "Stand" },
    { id: "wide", label: "Wide stance" },
    { id: "sit", label: "Sitting" },
    { id: "squat", label: "Squat" },
    { id: "crossed", label: "Crossed" },
    { id: "kick", label: "Kick" },
  ],
  hooks: {
    main: (ctx, id) => renderLegs(ctx, id),
    front: (ctx, id) => renderLegsFront(ctx, id),
  },
});
