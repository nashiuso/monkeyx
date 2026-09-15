// monkeyx animation engine v2.
// each preset declares the anatomical level it animates; a composition may
// combine any set of presets whose levels do not collide. all motion is css
// keyframes; static output never contains any of this machinery.

export const ANIMATION_IDS = [
  "idle",
  "blink",
  "double-blink",
  "bounce",
  "wave",
  "float",
  "wiggle",
  "tail",
  "ears",
  "nod",
  "shake",
  "dance",
  "excited",
  "sleepy",
] as const;

export type AnimationId = (typeof ANIMATION_IDS)[number];

// anatomical levels; at most one preset may occupy a level at a time
export type AnimationLevel = "root" | "head" | "eyes" | "tail" | "ears" | "arm";

export interface AnimationPreset {
  readonly id: AnimationId;
  readonly label: string;
  // levels this preset occupies (conflict domain)
  readonly levels: readonly AnimationLevel[];
  // css class + keyframes targeting the level's group class; presets whose
  // pivot depends on body geometry (wave arm) emit it from their renderer
  readonly css?: (prefix: string, dur: (base: number) => string) => string;
}

// duration formatting: scale base seconds by speed, trim trailing zeros
export function duration(base: number, speed: number): string {
  const scaled = Math.round((base / speed) * 100) / 100;
  return `${scaled}s`;
}

// base duration of the wave arm swing; the arms renderer scales it by speed
export const WAVE_ARM_DUR = 1.3;

export const ANIMATION_PRESETS: Record<AnimationId, AnimationPreset> = {
  idle: {
    id: "idle",
    label: "Idle breathing + head tilt",
    levels: ["root", "head"],
    css: (p, dur) =>
      `.${p}-root{animation:${p}-idle ${dur(4.8)} ease-in-out infinite}` +
      `@keyframes ${p}-idle{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.8px)}}` +
      `.${p}-head{transform-box:fill-box;transform-origin:50% 92%;animation:${p}-idlehead ${dur(5.2)} ease-in-out infinite}` +
      `@keyframes ${p}-idlehead{0%,100%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}}`,
  },
  blink: {
    id: "blink",
    label: "Periodic blink",
    levels: ["eyes"],
    css: (p, dur) =>
      `.${p}-eyes{transform-box:fill-box;transform-origin:50% 55%;animation:${p}-blink ${dur(4.4)} infinite}` +
      `@keyframes ${p}-blink{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.06)}}`,
  },
  "double-blink": {
    id: "double-blink",
    label: "Quick double blink",
    levels: ["eyes"],
    css: (p, dur) =>
      `.${p}-eyes{transform-box:fill-box;transform-origin:50% 55%;animation:${p}-dblink ${dur(5)} infinite}` +
      `@keyframes ${p}-dblink{0%,86%,100%{transform:scaleY(1)}89%{transform:scaleY(.06)}92%{transform:scaleY(1)}94%{transform:scaleY(.06)}}`,
  },
  bounce: {
    id: "bounce",
    label: "Playful hop",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{animation:${p}-bounce ${dur(1.5)} ease-in-out infinite}` +
      `@keyframes ${p}-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}`,
  },
  wave: {
    id: "wave",
    label: "Waving arm (needs arms=wave)",
    levels: ["arm"],
    // pivot css is emitted by the arms renderer (exact shoulder pivot)
  },
  float: {
    id: "float",
    label: "Slow hover",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{animation:${p}-float ${dur(3.6)} ease-in-out infinite}` +
      `@keyframes ${p}-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`,
  },
  wiggle: {
    id: "wiggle",
    label: "Cheeky wiggle",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{transform-box:view-box;transform-origin:50% 50%;animation:${p}-wiggle ${dur(2.6)} ease-in-out infinite}` +
      `@keyframes ${p}-wiggle{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}`,
  },
  tail: {
    id: "tail",
    label: "Tail sway",
    levels: ["tail"],
    css: (p, dur) =>
      `.${p}-tail{transform-box:fill-box;transform-origin:10% 90%;animation:${p}-tail ${dur(2.2)} ease-in-out infinite}` +
      `@keyframes ${p}-tail{0%,100%{transform:rotate(0)}50%{transform:rotate(11deg)}}`,
  },
  ears: {
    id: "ears",
    label: "Ear flick",
    levels: ["ears"],
    css: (p, dur) =>
      `.${p}-ears{transform-box:fill-box;transform-origin:50% 80%;animation:${p}-ears ${dur(3.4)} ease-in-out infinite}` +
      `@keyframes ${p}-ears{0%,84%,100%{transform:rotate(0)}88%{transform:rotate(6deg)}92%{transform:rotate(-2deg)}}`,
  },
  nod: {
    id: "nod",
    label: "Head nod",
    levels: ["head"],
    css: (p, dur) =>
      `.${p}-head{transform-box:fill-box;transform-origin:50% 92%;animation:${p}-nod ${dur(2.6)} ease-in-out infinite}` +
      `@keyframes ${p}-nod{0%,100%{transform:rotate(0)}18%{transform:rotate(6deg)}32%{transform:rotate(1.5deg)}46%{transform:rotate(6deg)}60%{transform:rotate(0)}}`,
  },
  shake: {
    id: "shake",
    label: "Head shake",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{animation:${p}-shake ${dur(2)} ease-in-out infinite}` +
      `@keyframes ${p}-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}`,
  },
  dance: {
    id: "dance",
    label: "Dance",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{transform-box:view-box;transform-origin:50% 60%;animation:${p}-dance ${dur(2.8)} ease-in-out infinite}` +
      `@keyframes ${p}-dance{0%,100%{transform:translateY(0) rotate(-3deg)}25%{transform:translateY(-7px) rotate(0)}50%{transform:translateY(0) rotate(3deg)}75%{transform:translateY(-7px) rotate(0)}}`,
  },
  excited: {
    id: "excited",
    label: "Excited jumping",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{animation:${p}-excited ${dur(1.1)} ease-in infinite}` +
      `@keyframes ${p}-excited{0%,100%{transform:translateY(0)}45%{transform:translateY(-13px)}55%{transform:translateY(-13px)}}`,
  },
  sleepy: {
    id: "sleepy",
    label: "Deep slow breathing",
    levels: ["root"],
    css: (p, dur) =>
      `.${p}-root{animation:${p}-sleepy ${dur(6)} ease-in-out infinite}` +
      `@keyframes ${p}-sleepy{0%,100%{transform:translateY(0) scaleY(1)}50%{transform:translateY(1px) scaleY(.985)}}`,
  },
};

// validate a set of presets for level conflicts; returns the offending
// preset ids so the error can explain itself
export function findLevelConflict(ids: readonly AnimationId[]): AnimationId[] {
  const seen = new Map<AnimationLevel, AnimationId>();
  for (const id of ids) {
    for (const level of ANIMATION_PRESETS[id].levels) {
      const owner = seen.get(level);
      if (owner !== undefined && owner !== id) return [owner, id];
      seen.set(level, id);
    }
  }
  return [];
}

// build the full namespaced <style> payload for an active preset set
export function animationCss(
  prefix: string,
  ids: readonly AnimationId[],
  speed: number,
): string | null {
  const dur = (base: number): string => duration(base, speed);
  const parts: string[] = [];
  for (const id of ids) {
    const preset = ANIMATION_PRESETS[id];
    if (preset.css !== undefined) parts.push(preset.css(prefix, dur));
  }
  if (parts.length === 0) return null;
  return parts.join("");
}

// honors the user's reduced motion preference for all css-driven motion
export function reducedMotionCss(prefix: string): string {
  return `@media (prefers-reduced-motion:reduce){.${prefix}-root,.${prefix}-head,.${prefix}-armr,.${prefix}-eyes,.${prefix}-tail,.${prefix}-ears{animation:none}}`;
}
