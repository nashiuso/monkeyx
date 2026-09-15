import type { RenderContext } from "./types.js";

// trait families, in nothing-in-particular order; composition defines its
// own stage order, the registry only owns ids, metadata and renderers
export type TraitFamilyId =
  | "head"
  | "ears"
  | "eyes"
  | "brows"
  | "nose"
  | "mouth"
  | "hair"
  | "pattern"
  | "body"
  | "arms"
  | "legs"
  | "tail"
  | "clothing"
  | "accessory"
  | "extra";

// a single visual variant
export interface TraitDefinition<F extends string = string> {
  readonly id: F;
  readonly label: string;
  // relative selection weight, default 1
  readonly weight?: number;
}

// render hooks a family may implement; composition places each hook on the
// correct stage so partial coverage is safe
export interface FamilyHooks<F extends string> {
  // the family's primary layer
  readonly main?: (ctx: RenderContext, id: F) => string;
  // behind everything (silhouettes, capes)
  readonly back?: (ctx: RenderContext, id: F) => string;
  // overlay on the torso, under the arms
  readonly body?: (ctx: RenderContext, id: F) => string;
  // overlay on the skull, under the face patch
  readonly head?: (ctx: RenderContext, id: F) => string;
  // decorative layer on the face patch
  readonly face?: (ctx: RenderContext, id: F) => string;
  // topmost layer
  readonly front?: (ctx: RenderContext, id: F) => string;
}

export interface FamilyDefinition<F extends string = string> {
  readonly id: TraitFamilyId;
  readonly label: string;
  // stable per-family salt pinning this family's random stream
  readonly salt: number;
  readonly traits: readonly TraitDefinition<F>[];
  readonly hooks: FamilyHooks<F>;
}

// internal registry storage; erase the id type at the boundary
interface RegistryEntry {
  readonly definition: FamilyDefinition<never>;
}

const entries: RegistryEntry[] = [];
const byId = new Map<TraitFamilyId, RegistryEntry>();

// register a trait family. call once per family module at load time.
export function defineFamily<F extends string>(
  definition: FamilyDefinition<F>,
): void {
  if (byId.has(definition.id)) {
    throw new Error(`trait family registered twice: ${definition.id}`);
  }
  const entry = {
    definition: definition as unknown as FamilyDefinition<never>,
  };
  entries.push(entry);
  byId.set(definition.id, entry);
}

export function families(): readonly FamilyDefinition[] {
  return entries.map((e) => e.definition as unknown as FamilyDefinition);
}

export function familyById(id: TraitFamilyId): FamilyDefinition {
  const entry = byId.get(id);
  if (entry === undefined) throw new Error(`unregistered trait family: ${id}`);
  return entry.definition as unknown as FamilyDefinition;
}

export function traitIds(id: TraitFamilyId): readonly string[] {
  return familyById(id).traits.map((t) => t.id);
}

// introspection payload exposed through the public api
export function listTraits(): Record<TraitFamilyId, readonly string[]> {
  const out = {} as Record<TraitFamilyId, readonly string[]>;
  for (const family of families()) {
    out[family.id] = family.traits.map((t) => t.id);
  }
  return out;
}

// salts for non-geometric dimensions (expression, colors, background)
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
