// family registration — import every family module exactly once, in a stable
// order, to populate the registry. composition and selection read the
// registry from here; nothing else should import family modules directly.
// the value imports of the id tuples evaluate each family module (which
// registers itself) and anchor the imports against tree-shaking.
import type { TraitFamilyId } from "./registry.js";
import { families as rawFamilies, familyById } from "./registry.js";
import { HEAD_IDS } from "./head.js";
import { EARS_IDS } from "./ears.js";
import { EYES_IDS } from "./eyes.js";
import { BROWS_IDS } from "./brows.js";
import { NOSE_IDS } from "./nose.js";
import { MOUTH_IDS } from "./mouth.js";
import { HAIR_IDS } from "./hair.js";
import { PATTERN_IDS } from "./patterns.js";
import { BODY_IDS } from "./body.js";
import { ARMS_IDS } from "./arms.js";
import { LEGS_IDS } from "./legs.js";
import { TAIL_IDS } from "./tail.js";
import { CLOTHING_IDS } from "./clothing.js";
import { ACCESSORY_IDS } from "./accessories.js";
import { EXTRA_IDS } from "./extras.js";

// registration audit: each family must have registered exactly once by the
// time this module finishes loading
const EXPECTED_ORDER: readonly (readonly string[])[] = [
  HEAD_IDS,
  EARS_IDS,
  EYES_IDS,
  BROWS_IDS,
  NOSE_IDS,
  MOUTH_IDS,
  HAIR_IDS,
  PATTERN_IDS,
  BODY_IDS,
  ARMS_IDS,
  LEGS_IDS,
  TAIL_IDS,
  CLOTHING_IDS,
  ACCESSORY_IDS,
  EXTRA_IDS,
];
if (rawFamilies().length !== EXPECTED_ORDER.length) {
  throw new Error("trait family registration is incomplete");
}

// derived after registration: stable family id order
export const TRAIT_FAMILY_IDS: readonly TraitFamilyId[] = rawFamilies().map(
  (f) => f.id,
);

// validation-facing family info (v1-compatible shape)
export function familyInfo(id: TraitFamilyId): {
  id: TraitFamilyId;
  label: string;
  salt: number;
  traits: readonly string[];
} {
  const family = familyById(id);
  return {
    id: family.id,
    label: family.label,
    salt: family.salt,
    traits: family.traits.map((t) => t.id),
  };
}

export {
  families,
  familyById,
  traitIds,
  listTraits,
  defineFamily,
  SALT,
  JITTER_OFFSET,
} from "./registry.js";
export type {
  TraitFamilyId,
  FamilyDefinition,
  TraitDefinition,
} from "./registry.js";
