import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@regle/nuxt'],
  ssr: false,
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
    },
  },
  hooks: {
    'prerender:routes'({ routes }) {
      routes.clear() // Do not generate any routes (except the defaults)
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./assets/main.css'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('nord-'),
    },
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  }
})
