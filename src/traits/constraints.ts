import { HAIR_SUPPRESSORS } from "./accessories.js";
import type { HairId } from "./hair.js";

// inter-family compatibility rules live here so selection and renderers
// never encode them ad hoc.

// hard headwear hides randomly-picked hair; an explicit user hair override
// always wins (resolved in select.ts)
export function suppressesHair(accessory: string): boolean {
  return (HAIR_SUPPRESSORS as readonly string[]).includes(accessory);
}

// resolve the final hair id given the accessory and whether the user
// explicitly pinned the hair
export function resolveHair(
  hair: HairId,
  accessory: string,
  hairPinned: boolean,
): HairId {
  if (hairPinned) return hair;
  if (suppressesHair(accessory)) return "none";
  return hair;
}

// accessories that need to shift when buns occupy the head corners
// (checked inside the accessory renderer via sideOffset)
export function shiftsForBuns(accessory: string): boolean {
  return accessory === "bow" || accessory === "flower";
}
