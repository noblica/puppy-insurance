# ADR-002: Testing Strategy (Vitest + Playwright + axe-core)

**Status**: Accepted
**Date**: 2025-05-25
**Author**: Dusan Perkovic

## Context

The application is a client-only Nuxt 3 SPA with a multi-step sign-up form, password strength validation, and conditional route navigation. We need to ensure correctness across:

- Validation logic (unit)
- Component rendering and class application (unit)
- Composable state transitions — idle, submitting, error, localStorage persistence (unit)
- End-to-end user flows — field interaction, form submission, URL navigation (E2E)
- Responsive layout — desktop two-column vs mobile full-width (E2E)
- Keyboard navigation (E2E)
- Automated accessibility compliance (E2E)

## Decision

Adopt a three-layer testing strategy:

### Layer 1: Unit tests (Vitest)

- **Runner**: Vitest with `@nuxt/test-utils` providing the Nuxt environment (`environment: "nuxt"`, `globals: true`).
- **Scope**: All composables, components, and utility functions in `tests/unit/`.
- **Module mocking**: The submission service (`~/services/submission`) is mocked via `vi.mock()` so composable tests control success, failure, and error scenarios without fake timers or parameter injection.
- **Composable testing pattern**: Wrap `useSignupForm()` in a minimal Vue component (`defineComponent` / `mountSuspended`) that returns the composable state from `setup()`. Read state through `wrapper.vm` — the component's own public interface. For reactive refs that change during the test (e.g. `formState`), re-access `wrapper.vm` after mutations to avoid destructuring a stale snapshot (Vue's `wrapper.vm` auto-unwraps `Ref` values, so destructuring captures the value at read time).
- **Component testing**: `@vue/test-utils` `mount` for `PasswordStrengthChecklist`, asserting text content, element count, and CSS class application for valid/invalid states.

### Layer 2: E2E tests (Playwright)

- **Runner**: Playwright with two browser projects — Desktop Chrome and Pixel 5 mobile Chrome.
- **Scope**: Full user flows in `tests/e2e/signup.spec.ts`.
- **Page Object helpers**: `fillEmail`, `fillPassword`, `fillConfirmPassword`, `checkTerms`, `submitForm` — extracted as test helpers rather than a full Page Object Model, keeping the pattern lightweight for this project's scale.
- **Shadow DOM queries**: Nord web components render inputs inside shadow roots. Locators use `page.locator('nord-input[label="..."]').locator("input")` to pierce through shadow DOM boundaries.

### Layer 3: Automated accessibility testing (axe-core)

- **Runner**: `@axe-core/playwright` integrated into the E2E test suite.
- **Scope**: Full-page accessibility scans on both the sign-up page (`/`) and the success page (`/success`).
- **Violation filtering**: DevTools-related violations (which are false positives in a test browser) are filtered out by checking for `devtools` substrings in node HTML and target selectors. All other violations fail the test.
- **Enforcement**: Accessibility scans are a **blocking** test assertion, not a warning. A regression in accessibility fails CI.

## Alternatives Considered

### Jest

**Rejected because**: Nuxt's official testing utilities target Vitest. Jest would require manual Nuxt environment setup.

### Cypress

**Rejected because**: Playwright has better shadow DOM support (critical for Nord web components), native mobile emulation, and faster parallel execution.

### pa11y

**Rejected because**: axe-core integrates more naturally into Playwright's test lifecycle.

### Separate a11y CI job

**Rejected because**: Embedding axe-core checks in existing E2E tests avoids duplicating setup and page navigation logic.

## Consequences

- **Positive**: Every production code file has corresponding tests. 20 unit tests + 16 E2E tests provide comprehensive coverage for the project's scale.
- **Positive**: Accessibility regressions are caught automatically in CI before deployment.
- **Positive**: Module-level mocking (`vi.mock`) avoids fake timers entirely — submission tests are deterministic without `advanceTimersByTime`.
- **Negative**: CI runs are longer due to E2E + accessibility scans. The `lint` / `typecheck` / `unit-tests` / `e2e-tests` / `build` pipeline runs sequentially in GitHub Actions.
