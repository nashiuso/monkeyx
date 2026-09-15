# security policy

## supported versions

| version | status                                       |
| ------- | -------------------------------------------- |
| 0.3.x   | supported                                    |
| < 0.3.0 | not supported, superseded generator versions |

## reporting a vulnerability

do not open a public issue for security reports.

contact the maintainer (nashiuso) privately via github. include a
reproduction (seed, options, expected vs actual behavior) and an assessment
of impact. you will receive an acknowledgment within a week and a fix
timeline shortly after.

## security model:

monkeyx treats all inputs as untrusted. the guarantees the library aims to
provide:

- seeds, titles, and descriptions are xml-escaped and stripped of control
  characters before serialization; no user text can escape text context
- options are validated against strict whitelists; unknown keys and values
  throw typed errors instead of being coerced or ignored
- option objects are re-assembled internally, so `__proto`-style prototype
  pollution through parsed json is rejected
- generated css animation payloads contain only library-controlled,
  per-avatar-namespaced class selectors and keyframes
- output contains no scripts, event handlers, raster data, or external
  references

reports about violations of these guarantees are especially welcome.
