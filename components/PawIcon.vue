<script setup lang="ts">
withDefaults(defineProps<{
  width?: number | string
  height?: number | string
}>(), {
  width: 24,
  height: 24,
})
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 100 100"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <ellipse cx="22" cy="25" rx="11" ry="13" />
    <ellipse cx="43" cy="15" rx="11" ry="13" />
    <ellipse cx="63" cy="15" rx="11" ry="13" />
    <ellipse cx="80" cy="27" rx="10" ry="12" />
    <path d="M17,60 C13,45 23,37 35,37 C39,37 44,39 50,39 C56,39 61,37 65,37 C77,37 87,45 83,60 C80,74 67,88 50,88 C33,88 20,74 17,60 Z" />
  </svg>
</template>
