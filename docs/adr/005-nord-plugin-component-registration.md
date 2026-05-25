# ADR-005: Nord Plugin Component Registration

**Status**: Accepted
**Date**: 2025-05-25
**Author**: Dusan Perkovic

## Context

Nord Design System components are Lit-based web components distributed as individual side-effect modules in the `@nordhealth/components` package. Each import from `@nordhealth/components/lib/<Name>` calls `customElements.define("nord-<name>", ...)` as a side effect. The project uses 7 components (`Button`, `Card`, `Checkbox`, `Icon`, `Input`, `Stack`, `VisuallyHidden`) out of ~40 available.

We need a strategy for registering these components before any template renders them, while keeping the bundle minimal and the developer experience predictable.

## Decision

Register Nord components through a dedicated Nuxt plugin (`plugins/nord.ts`) using cherry-picked per-component side-effect imports, paired with a Vue compiler option that marks all `nord-*` tags as custom elements.

### Cherry-picked imports

```ts
import "@nordhealth/components/lib/Button";
import "@nordhealth/components/lib/Card";
import "@nordhealth/components/lib/Checkbox";
import "@nordhealth/components/lib/Icon";
import "@nordhealth/components/lib/Input";
import "@nordhealth/components/lib/Stack";
import "@nordhealth/components/lib/VisuallyHidden";
```

Each import is a side-effect-only module that registers one custom element. Only the 7 used components end up in the production bundle.

### Empty plugin body

```ts
export default defineNuxtPlugin(() => {});
```

The plugin function body is empty because its sole purpose is to trigger the side-effect imports above. Nuxt plugins execute before the app mounts, guaranteeing components are registered before any template renders.

### Custom element compiler option

In `nuxt.config.ts`:

```ts
vue: {
  compilerOptions: {
    isCustomElement: (tag) => tag.startsWith("nord-"),
  },
},
```

This tells Vue's template compiler not to warn about unknown elements with the `nord-` prefix. Without it, every `<nord-button>`, `<nord-input>`, etc. would produce a `[Vue warn]: Failed to resolve component` warning during development. It also ensures Vue treats these elements as DOM passthrough — no component resolution, no props-to-attributes conversion.

## Alternatives Considered

### Barrel import of `@nordhealth/components`

**Rejected because**: A single `import "@nordhealth/components"` would register all ~40 Nord components, bloating the bundle with unused code. The project only needs 7 components. Cherry-picking keeps the bundle lean and makes component usage explicit.

### Per-component `customElements.define()` without a Nuxt plugin

**Rejected because**: Calling `customElements.define()` directly in `app.vue` or individual components is fragile — registration order is not guaranteed, and a component instance might attempt to render before definition completes. Nuxt plugins execute in `init` sequence before app mount, providing a deterministic registration order.

### Dynamic imports or lazy loading

**Rejected because**: All 7 components are used in critical rendering paths (form fields, submit button, layout containers). Lazy loading would introduce visible jank as components pop in during first render. The combined size of 7 Lit components does not justify the complexity of a lazy-loading strategy.

### Omitting `isCustomElement`

**Rejected because**: Vue's template compiler would emit warnings for every Nord element tag during development. These warnings are noise that masks real issues. The compiler option is a one-liner with no runtime overhead.

## Consequences

- **Positive**: Only 7 components are included in the production bundle — no dead code from unused Nord elements.
- **Positive**: Registration happens deterministically before app mount via Nuxt's plugin system.
- **Positive**: The plugin file serves as a canonical registry — developers can see at a glance which Nord components the project uses.
- **Positive**: No Vue warnings about unknown elements, and Vue correctly passes through all attributes and events to the custom elements.
- **Negative**: Adding a new Nord component requires two changes — the import in `plugins/nord.ts` and the template usage. Forgetting the import causes a silent failure (the component renders as an empty HTML element with no visual output and no console error).
