# AGENTS.md

## Nordhealth / Design System

For all Nordhealth-related topics (design system, icons, components, design tokens), refer to [`llms.md`](./llms.md).

## Client-Only Application

This is a client-only Nuxt app — `ssr: false` is set in `nuxt.config.ts`. All Nordhealth components use the `nord-` prefix (e.g. `<nord-button>`) and are configured as custom elements via the `isCustomElement` compiler option in `nuxt.config.ts`.

## Code Style

Always wrap if-condition blocks with braces `{}`, even for single-line statements.
