<template>
  <a
    href="#main-content"
    class="n:sr-only n:focus:n:not-sr-only n:focus:n:absolute n:focus:n:top-0 n:focus:n:left-0 n:focus:n:z-50 n:focus:n:p-s n:focus:n:bg-default n:focus:n:text-accent n:focus:n:underline"
  >
    Skip to main content
  </a>
  <div class="n:flex n:min-h-dvh">
    <aside
      class="n:hidden n:s:flex n:s:w-[45%] n:s:h-dvh n:overflow-hidden n:s:sticky n:s:top-0"
      aria-hidden="true"
    >
      <img src="~/assets/logo.png" alt="" class="n:w-full n:h-full n:object-cover" />
    </aside>

    <main id="main-content" class="n:flex n:items-center n:justify-center n:p-m n:bg-default n:w-full n:min-h-full n:s:w-[55%] n:s:min-h-0">
      <slot />
    </main>
  </div>
</template>
