import { HEAD_IDS } from "./head.js";
import { EARS_IDS } from "./ears.js";
import { EYES_IDS } from "./eyes.js";
import { BROWS_IDS } from "./brows.js";
import { MOUTH_IDS } from "./mouth.js";
import { HAIR_IDS } from "./hair.js";
import { BODY_IDS } from "./body.js";
import { ARMS_IDS } from "./arms.js";
import { LEGS_IDS } from "./legs.js";
import { TAIL_IDS } from "./tail.js";
import { CLOTHING_IDS } from "./clothing.js";
import { ACCESSORY_IDS } from "./accessories.js";
import { EXTRA_IDS } from "./extras.js";

// ids of every trait family plus salt constants for the random streams
export type TraitFamilyId =
  | "head"
  | "ears"
  | "eyes"
  | "brows"
  | "mouth"
  | "hair"
  | "body"
  | "arms"
  | "legs"
  | "tail"
  | "clothing"
  | "accessory"
  | "extra";

export interface TraitFamilyInfo {
  readonly id: TraitFamilyId;
  readonly label: string;
  readonly salt: number;
  readonly traits: readonly string[];
}

// salts are stable constants: they pin each family's random stream, so
// adding families later never shifts the randomness of existing ones
export const TRAIT_FAMILIES: readonly TraitFamilyInfo[] = [
  { id: "head", label: "Head shape", salt: 10, traits: HEAD_IDS },
  { id: "ears", label: "Ears", salt: 11, traits: EARS_IDS },
  { id: "eyes", label: "Eyes", salt: 12, traits: EYES_IDS },
  { id: "brows", label: "Eyebrows", salt: 13, traits: BROWS_IDS },
  { id: "mouth", label: "Mouth", salt: 14, traits: MOUTH_IDS },
  { id: "hair", label: "Hair", salt: 15, traits: HAIR_IDS },
  { id: "body", label: "Body", salt: 16, traits: BODY_IDS },
  { id: "arms", label: "Arms", salt: 17, traits: ARMS_IDS },
  { id: "legs", label: "Legs", salt: 18, traits: LEGS_IDS },
  { id: "tail", label: "Tail", salt: 19, traits: TAIL_IDS },
  { id: "clothing", label: "Clothing", salt: 20, traits: CLOTHING_IDS },
  { id: "accessory", label: "Accessory", salt: 21, traits: ACCESSORY_IDS },
  { id: "extra", label: "Extra", salt: 22, traits: EXTRA_IDS },
];

export const TRAIT_FAMILY_IDS: readonly TraitFamilyId[] = TRAIT_FAMILIES.map(
  (f) => f.id,
);

// salts for non-geometric dimensions
export const SALT = {
  expression: 1,
  palette: 30,
  backgroundStyle: 31,
  backgroundColor: 32,
  accent: 33,
  hairColor: 34,
} as const;

// jitter streams live above pick streams so overrides never shift jitter
export const JITTER_OFFSET = 100;

export function familyInfo(id: TraitFamilyId): TraitFamilyInfo {
  const info = TRAIT_FAMILIES.find((f) => f.id === id);
  if (info === undefined) throw new Error(`unknown trait family: ${id}`);
  return info;
}

// introspection helper exposed through the public api
export function listTraits(): Record<TraitFamilyId, readonly string[]> {
  return {
    head: HEAD_IDS,
    ears: EARS_IDS,
    eyes: EYES_IDS,
    brows: BROWS_IDS,
    mouth: MOUTH_IDS,
    hair: HAIR_IDS,
    body: BODY_IDS,
    arms: ARMS_IDS,
    legs: LEGS_IDS,
    tail: TAIL_IDS,
    clothing: CLOTHING_IDS,
    accessory: ACCESSORY_IDS,
    extra: EXTRA_IDS,
  };
}
