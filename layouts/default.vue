<template>
  <div class="n:flex n:min-h-dvh">
    <aside
      class="n:hidden n:s:flex n:s:w-[45%] n:s:h-dvh n:overflow-hidden n:s:sticky n:s:top-0"
      aria-hidden="true"
    >
      <img src="~/assets/logo.png" alt="" class="n:w-full n:h-full n:object-cover" />
    </aside>

    <main class="n:flex n:items-center n:justify-center n:p-m n:bg-default n:w-full n:min-h-full n:s:w-[55%] n:s:min-h-0">
      <slot />
    </main>
  </div>
</template>
