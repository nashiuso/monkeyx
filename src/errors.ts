// base error for all monkeyx failures
export class MonkeyxError extends Error {
  override readonly name: string = "MonkeyxError";

  constructor(message: string) {
    super(message);
    // keeps instanceof working when compiled to es5 targets
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// machine-readable failure codes
export type ValidationErrorCode =
  | "invalid-seed"
  | "unknown-option"
  | "invalid-option"
  | "unknown-trait"
  | "unknown-preset"
  | "unknown-animation"
  | "unknown-palette";

// typed error thrown for any invalid seed or option value
export class ValidationError extends MonkeyxError {
  override readonly name = "ValidationError";
  readonly code: ValidationErrorCode;

  constructor(code: ValidationErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
