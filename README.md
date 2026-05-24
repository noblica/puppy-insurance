# Puppy Insurance

A client-only Vue.js application featuring a sign-up form with real-time validation, password strength requirements, and accessibility-first design. Built with Nuxt 3, Nord Design System, and Regle form validation.

## Features

- **Sign-up form** with email, password, and terms acceptance
- **Real-time validation** using Regle with custom rules
- **Password strength checklist** with visual indicators
- **Password visibility toggle** with accessible controls
- **Responsive layout** with hero image on desktop
- **Success page** with route guard (redirects incomplete submissions)
- **Accessibility-first**: skip links, keyboard navigation, WAI-ARIA attributes
- **Automated accessibility testing** via axe-core

## Tech Stack

- **Framework**: Nuxt 3.21.2 (client-only, SSR disabled)
- **UI**: Vue 3.5 with Nord Design System components
- **Styling**: Tailwind CSS 4.3 with Nord CSS framework
- **Validation**: Regle with built-in and custom rules
- **Testing**: Vitest (unit), Playwright (E2E), axe-core (accessibility)
- **Linting**: oxlint, oxfmt

## Prerequisites

- Node.js 18+
- pnpm (recommended for strict dependency resolution)

## Setup

```bash
pnpm install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Testing

### Unit tests

```bash
pnpm test
```

Run in watch mode:

```bash
pnpm test:watch
```

### E2E tests

```bash
pnpm test:e2e
```

### Type checking

```bash
pnpm typecheck
```

### Linting & formatting

```bash
pnpm lint
pnpm format
```

## Production

Build for production:

```bash
pnpm build
```

Preview production build locally:

```bash
pnpm preview
```

## Project Structure

```
├── app.vue              # Root app component with NuxtLayout
├── layouts/
│   └── default.vue      # Two-column layout with hero image
├── pages/
│   ├── index.vue        # Sign-up form
│   └── success.vue      # Success page (route guard)
├── assets/
│   └── main.css         # Tailwind + Nord CSS imports
├── nuxt.config.ts       # Nuxt configuration
├── tests/
│   ├── unit/            # Vitest unit tests
│   └── e2e/             # Playwright E2E tests
└── README.md
```

## Architecture Notes

### Client-Only Application

SSR is disabled (`ssr: false` in `nuxt.config.ts`). Nuxt is pinned to v3.21.2 due to issues with SSR disabled in later versions. See [nuxt/nuxt#34957](https://github.com/nuxt/nuxt/issues/34957).

### Nord Design System

All Nord components use the `nord-` prefix and are configured as custom elements in Vue's compiler options. See [`llms.md`](./llms.md) for component documentation.

### Regle Validation

Uses `@regle/nuxt` module with built-in rules (`required`, `email`, `minLength`, etc.) and custom rules. The `containsNumber` rule validates password digit requirements.

## Notes

- All dependency versions are pinned (no ranges) to reduce supply chain attack risk. pnpm is used for the same reason — its strict resolution enforces exact versions.
- `@nordhealth/css` declares `@nordhealth/tokens` as a devDependency but its Tailwind integration imports it at runtime. If you see `Can't resolve '@nordhealth/tokens'`, run `pnpm add @nordhealth/tokens`.

## License

Private
