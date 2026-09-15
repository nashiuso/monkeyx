// monkeyx — deterministic monkey avatar generator.
// same input, same monkey. zero runtime dependencies.
export { monkeyx, generate, generateDetail } from "./generate.js";
export type { MonkeyxApi, MonkeyDetail } from "./generate.js";
export type { GenerateOptions } from "./options.js";
export { MonkeyxError, ValidationError } from "./errors.js";
export type { ValidationErrorCode } from "./errors.js";
export { ANIMATION_IDS } from "./animation/animations.js";
export type { AnimationId } from "./animation/animations.js";
export { PRESET_IDS } from "./presets/presets.js";
export type { PresetId } from "./presets/presets.js";
export { STYLE_IDS } from "./style/styles.js";
export type { StyleId } from "./style/styles.js";
export { PALETTE_IDS } from "./monkey/palettes.js";
export { BACKGROUND_STYLE_IDS } from "./monkey/background.js";
export type { BackgroundStyleId } from "./monkey/background.js";
export { TRAIT_FAMILY_IDS, listTraits } from "./traits/families.js";
export type { TraitFamilyId } from "./traits/families.js";
export { EXPRESSION_IDS } from "./traits/expression.js";
export type { ExpressionId } from "./traits/expression.js";
export { VIEWBOX_SIZE } from "./monkey/geometry.js";
export { VERSION, GENERATION_VERSION } from "./version.js";

// trait id unions for typed option objects
export type { HeadId } from "./traits/head.js";
export type { EarsId } from "./traits/ears.js";
export type { EyesId } from "./traits/eyes.js";
export type { BrowsId } from "./traits/brows.js";
export type { NoseId } from "./traits/nose.js";
export type { MouthId } from "./traits/mouth.js";
export type { HairId } from "./traits/hair.js";
export type { PatternId } from "./traits/patterns.js";
export type { BodyId } from "./traits/body.js";
export type { ArmsId } from "./traits/arms.js";
export type { LegsId } from "./traits/legs.js";
export type { TailId } from "./traits/tail.js";
export type { ClothingId } from "./traits/clothing.js";
export type { AccessoryId } from "./traits/accessories.js";
export type { ExtraId } from "./traits/extras.js";
