# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## Notes

- Nuxt is pinned to v3.21.2 because disabling SSR (`ssr: false` in `nuxt.config.ts`) causes errors. See [nuxt/nuxt#34957](https://github.com/nuxt/nuxt/issues/34957).
- All dependency versions are pinned (no ranges) to reduce supply chain attack risk. pnpm is used for the same reason — its strict resolution enforces exact versions.
- `@nordhealth/css` declares `@nordhealth/tokens` as a devDependency but its Tailwind integration (`lib/tailwind/main.css`) imports `@nordhealth/tokens/lib/tokens.custom-properties.css` at runtime. If you see `Can't resolve '@nordhealth/tokens'`, run `pnpm add @nordhealth/tokens` to install it explicitly.

