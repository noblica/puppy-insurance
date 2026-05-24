<template>
  <div class="n:flex n:min-h-[100vh]">
    <aside
      class="n:hidden n:s:flex n:s:w-[45%] n:overflow-hidden"
      aria-hidden="true"
    >
      <img src="~/assets/logo.png" alt="" class="n:w-full n:h-full n:object-cover" />
    </aside>

    <main class="n:flex n:items-center n:justify-center n:p-m n:bg-default n:w-[100%] n:min-h-[100vh] n:s:w-[55%] n:s:min-h-0">
      <slot />
    </main>
  </div>
</template>
