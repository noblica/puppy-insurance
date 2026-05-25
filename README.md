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

- Node.js 22 (see `.nvmrc`)
- pnpm 10.26.2 (see `packageManager` in package.json)

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Development

Start the development server on `http://localhost:3000/puppy-insurance/`:

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
pnpm lint:fix      # Auto-fix lint issues
pnpm format        # Format code
pnpm format:check  # Check formatting
```

## Production

Build for production:

```bash
pnpm build
```

Generate static site:

```bash
pnpm generate
```

Preview production build locally:

```bash
pnpm preview
```

## Project Structure

```
├── app.vue                      # Root app component with NuxtLayout
├── error.vue                    # Error boundary page
├── layouts/
│   └── default.vue              # Two-column layout with hero image
├── pages/
│   ├── index.vue                # Sign-up form
│   └── success.vue              # Success page (route guard)
├── components/
│   └── PasswordStrengthChecklist.vue
├── composables/
│   └── useSignupForm.ts         # Form state and submission logic
├── utils/
│   ├── constants.ts             # Shared constants
│   └── validation-rules.ts       # Custom Regle validation rules
├── assets/
│   ├── main.css                 # Tailwind + Nord CSS imports
│   ├── hero.jpg                 # Hero image
│   └── logo.png                 # Logo
├── tests/
│   ├── unit/                    # Vitest unit tests
│   └── e2e/                     # Playwright E2E tests
├── docs/
│   └── adr/                     # Architecture Decision Records
├── nuxt.config.ts               # Nuxt configuration
├── vitest.config.ts             # Vitest configuration
├── playwright.config.ts         # Playwright configuration
├── llms.md                      # Nord Design System documentation
├── AGENTS.md                    # Agent instructions
└── README.md
```

## Architecture Notes

### Client-Only Application

SSR is disabled (`ssr: false` in `nuxt.config.ts`). Nuxt is pinned to v3.21.2 due to issues with SSR disabled in later versions. See [nuxt/nuxt#34957](https://github.com/nuxt/nuxt/issues/34957).

### Nord Design System

All Nord components use the `nord-` prefix and are configured as custom elements in Vue's compiler options. See [`llms.md`](./llms.md) for component documentation.

### Regle Validation

Uses `@regle/nuxt` module with built-in rules (`required`, `email`, `minLength`, etc.) and custom rules. The `containsNumber` rule validates password digit requirements.

### Testing Strategy

- **Unit tests**: Vitest with `@nuxt/test-utils` for composable and component testing
- **E2E tests**: Playwright with Desktop Chrome and mobile (Pixel 5) configurations
- **Accessibility**: axe-core integrated into E2E tests for automated WCAG compliance checking

See [`docs/adr/002-testing-strategy.md`](./docs/adr/002-testing-strategy.md) for details.

## CI/CD

GitHub Actions workflow runs on every push and pull request:

1. **lint**: oxlint + oxfmt check
2. **typecheck**: TypeScript type checking
3. **unit-tests**: Vitest
4. **e2e-tests**: Playwright + axe-core accessibility
5. **build**: Static site generation
6. **deploy**: GitHub Pages deployment (on main branch)

## Notes

- All dependency versions are pinned (no ranges) to reduce supply chain attack risk
- pnpm is used for its strict dependency resolution
- Pre-commit hooks run lint-staged for automatic linting and formatting

## License

Private
