# contributing to monkeyx

thanks for helping make monkeyx better. this guide keeps contributions
focused and the review loop fast.

## ground rules

- runtime dependencies are **not accepted** without a compelling technical
  reason; the generator must stay dependency-free
- generation must remain fully deterministic: no `Math.random`, no
  timestamps, no locale-dependent string apis in `src/`
- static output must never contain animation payload; animation is opt-in
  and composed through the preset registry
- comments are lowercase and sparse; code is strict typescript
- every behavior change ships with a test

## setup

```sh
git clone https://github.com/nashiuso/monkeyx.git
cd monkeyx
npm install
npm run verify   # typecheck + lint + format + test + build + playground
```

## workflow

1. open or comment on an issue first for anything non-trivial
2. branch from `main`: `feat/<topic>` or `fix/<topic>`
3. make the smallest change that solves the problem
4. add or update tests (`tests/`), behavioral tests over implementation tests
5. run `npm run verify` and make it pass
6. open a pull request describing the _what_ and the _why_

## adding a trait

traits live in family modules under `src/traits/`; each family registers
itself through `defineFamily`. to add a variant:

1. open the family module, add the id to the exported tuple and a
   `TraitDefinition` entry (with a `label` and optional `weight`)
2. extend the family's renderer, respect the geometry anchors in
   `src/monkey/geometry.ts` so the new trait composes with every body/head
   combination; use the shared hooks (`back`, `body`, `head`, `face`,
   `main`, `front`) and composition will place the layer correctly
3. if it interacts with another family, express the rule in
   `src/traits/constraints.ts`, never inside selection or renderers
4. run `npm run visual:baseline` and eyeball the output grid
5. the invariant tests force every trait automatically; add a case-specific
   test only if there is real new behavior

## adding a family, style, or animation

- **family**: new module + `defineFamily` + one import line (and registration
  audit entry) in `src/traits/families.ts`; update the expression archetypes
  if faces are involved
- **style**: one entry in `src/style/styles.ts`, styles are render modifiers
  (palette/accent/background scope, line weight, highlight, scale, weights)
- **animation**: one preset in `src/animation/animations.ts`, declaring its
  anatomical level; conflicting levels are validation errors by construction

none of these require touching the composer's structure or the docs tables
by hand beyond referencing the new ids.

## touching the generation algorithm

any change that alters existing avatars' output must:

1. bump `GENERATION_VERSION` in `src/seed/hash.ts`
2. re-bless `tests/regression.test.ts` golden hashes in the same commit
3. add a `CHANGELOG.md` entry

see docs/architecture.md → determinism contract for the reasoning.

## reporting bugs

include: seed(s) to reproduce, options, expected vs actual, runtime
(node/browser + versions). for security issues, see
[SECURITY.md](SECURITY.md).

## license

by contributing you agree your contributions are licensed under the
BSD 3-Clause license covering this repository.
