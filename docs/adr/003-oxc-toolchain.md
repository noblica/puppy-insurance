# ADR-003: oxc Toolchain (oxlint + oxfmt)

**Status**: Accepted  
**Date**: 2025-05-25  
**Author**: Dusan Perkovic

## Context

The project needs linting and formatting for TypeScript, Vue SFCs, CSS, JSON, Markdown, and YAML files. The toolchain must run in CI as a blocking quality gate and as a pre-commit hook. Performance matters — slow linting in pre-commit discourages frequent commits.

## Decision

Use the **oxc** Rust-based toolchain:

- **oxlint** (`^1.66.0`) for linting — replaces ESLint
- **oxfmt** (`^0.51.0`) for formatting — replaces Prettier

Both tools are zero-config by default. No `.eslintrc.*`, `eslint.config.*`, `.prettierrc.*`, or `biome.json` files exist in the project.

### Pre-commit integration

`simple-git-hooks` + `lint-staged` run on every staged file:

```json
"lint-staged": {
  "*": [
    "oxlint --fix --no-error-on-unmatched-pattern",
    "oxfmt --no-error-on-unmatched-pattern"
  ]
}
```

`--no-error-on-unmatched-pattern` prevents the tools from failing when a staged file type has no applicable rules — avoiding false-positive pre-commit failures.

### CI integration

The `lint` job in `.github/workflows/ci.yml` runs both `pnpm run lint` (oxlint) and `pnpm run format:check` (oxfmt --check) as blocking steps before deploy.

## Alternatives Considered

| Alternative           | Rejected Because                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ESLint + Prettier** | Significantly slower (JavaScript-based). Requires extensive configuration files (`eslint.config.*`, `.prettierrc`, plugin setup). The Nuxt/Vue/Tailwind ESLint plugin matrix adds maintenance burden. |
| **Biome**             | Similar performance to oxc but a different rule set. oxlint was chosen for its simplicity of "just works" defaults. No strong reason to prefer one over the other — the decision is reversible.       |

## Consequences

- **Positive**: Near-instant lint and format checks. Pre-commit hooks complete in under a second even on large change sets.
- **Positive**: Zero configuration files to maintain. Editor setup is a one-liner.
- **Positive**: CI lint job is the fastest step in the pipeline.
- **Negative**: oxlint has fewer rules than ESLint. Some Vue-specific or project-specific rules that exist in ESLint plugins (e.g. `vue/no-v-html`, `vue/require-default-prop`) are not available. This is acceptable for the current project scope but may become limiting as the codebase grows.
- **Negative**: oxfmt has no configuration options for formatting style preferences. If the team has strong opinions about quote style, trailing commas, or line width beyond the defaults, this tool cannot accommodate them. Switching to Biome or ESLint+Prettier would be required.
