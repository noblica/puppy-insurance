# ADR-001: Regle for Form Validation

**Status**: Accepted  
**Date**: 2025-05-25  
**Author**: Dusan Perkovic

## Context

The application needs client-side form validation for the sign-up flow: email format, password strength rules (min length, uppercase, number, special character), password confirmation matching, and required checkbox acceptance. We need to choose a validation library that integrates well with Vue 3 Composition API and the Nord Design System web components.

## Decision

Use **Regle** (`@regle/core` + `@regle/nuxt` + `@regle/rules`) as the form validation library.

Key design choices within this ADR:

- **`autoDirty: false`** — fields only show errors after explicit touch (`$touch()` on blur or input), not eagerly. This prevents error messages from appearing before the user interacts with a field.
- **`and()` chaining for compound rules** — password rules like `minLength`, `containsUppercase`, `containsNumber`, and `containsSpecialCharacter` are gated with `and(required, ...)`. This ensures supplementary rules only validate when the field has a value, delegating the "field is empty" case to the `required` rule alone.
- **Single `$value` binding** — form inputs bind to `r$.$value.fieldName` rather than raw form fields, giving Regle full control over dirty-tracking and validation state.

## Alternatives Considered

| Alternative                 | Rejected Because                                                                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **VeeValidate**             | Heavier API, less natural TypeScript inference, more configuration overhead for composable-first use.                                                                 |
| **Zod + manual validation** | Overkill for a client-only form. Would require wiring Zod schemas to form fields manually. No built-in dirty-tracking or error state management.                      |
| **Native HTML5 validation** | Insufficient — browser-native validation messages are inconsistent across browsers, cannot be styled with Nord components, and don't support compound password rules. |

## Consequences

- **Positive**: Excellent TypeScript inference — form shape, rules, errors, and validation state all typed without explicit generic parameters.
- **Positive**: Tight integration with Nord components via the `error` prop on `nord-input` and `nord-checkbox`.
- **Positive**: Custom rules (e.g. `containsNumber`) follow the same API as built-in Regle rules, making the validation layer extensible.
- **Negative**: Regle has a smaller community than VeeValidate. Documentation and examples are harder to find.
- **Negative**: The `$rules` / `$errors` / `$value` API surface is Regle-specific. Migrating to a different validation library would require rewriting the composable and all templates.
