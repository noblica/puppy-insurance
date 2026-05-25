# ADR-004: Custom Validation Rule Architecture

**Status**: Accepted  
**Date**: 2025-05-25  
**Author**: Dusan Perkovic

## Context

The password field requires a "must contain a number" rule. Regle's built-in rules include `minLength`, `containsUppercase`, and `containsSpecialCharacter`, but not `containsNumber`. We need to create a custom rule and establish a pattern for any future custom rules.

A key design tension: supplementary rules like "contains a number" should only validate when a value is present. If the field is empty, the `required` rule should be the one reporting the error — otherwise the user sees multiple errors for having typed nothing.

## Decision

Custom validation rules follow this pattern:

1. **Single concern** — each custom rule validates exactly one condition (e.g. "contains a digit").
2. **Delegates emptiness** — the rule returns `true` for `null`, `undefined`, and empty string (`""`). This delegates the "field is empty" error to the `required` rule.
3. **Gated with `and()`** — in the composable, the rule is combined with `required` using `and(required, customRule())`. Regle's `and()` short-circuits: if `required` fails, the custom rule is not evaluated.
4. **Named export from `utils/validation-rules.ts`** — all custom rules live in a single file, co-located for discoverability.

### Implementation

```ts
export function containsNumber() {
  return createRule({
    validator: (value: string | null | undefined) => {
      if (value == null || value === "") {
        return true;
      }
      return /\d/.test(value);
    },
    message: "Must contain a number",
  });
}
```

Usage in the composable:

```ts
password: {
  required,
  containsNumber: and(required, containsNumber()),
  // ...
}
```

### Unit testing

Custom rules are tested in isolation by calling `rule.validator(value)` directly — no Nuxt environment required. Tests cover: valid input, invalid input, empty string, `null`, and `undefined`.

## Alternatives Considered

| Alternative                                                 | Rejected Because                                                                                                                       |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Handle emptiness inside the rule (don't delegate)**       | Would produce duplicate errors: "This field is required" AND "Must contain a number" for an empty field. Worse UX.                     |
| **Don't use `and()`, conditionally skip in the composable** | Moves validation logic into the composable instead of keeping it in the rule definition. Harder to test and reason about.              |
| **Use `or()` instead of `and()`**                           | `or()` would pass if either condition is met — the opposite of what we want. We need BOTH `required` AND `containsNumber` to pass.     |
| **Put custom rules inline in the composable**               | Pollutes the composable with rule implementation details. A separate `validation-rules.ts` file scales better as more rules are added. |

## Consequences

- **Positive**: Consistent pattern for all supplementary rules. Future rules (e.g. `containsLowercase`, `noSequentialChars`) follow the same template.
- **Positive**: Custom rules are independently testable without mounting components or setting up the Nuxt environment.
- **Positive**: The `required` rule remains the single source of truth for "field is empty" errors.
- **Negative**: The `and()` chaining adds visual noise in the composable — each password rule is wrapped in `and(required, ...)`. If many rules are added, the composable becomes harder to scan. A helper function (`withRequired()`) could reduce repetition if this becomes a problem.
