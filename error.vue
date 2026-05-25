<script setup lang="ts">
import "@nordhealth/components/lib/Card";
import "@nordhealth/components/lib/Icon";
import "@nordhealth/components/lib/Stack";
import "@nordhealth/components/lib/Button";
import type { NuxtError } from "#app";
import { computed } from "vue";

const props = defineProps<{ error: NuxtError }>();

const statusDescription = computed(() => {
  const statusCode = props.error.statusCode;
  if (statusCode === 404) {
    return {
      heading: "Page not found",
      message: "The page you're looking for doesn't exist or has been moved.",
    };
  }
  if (statusCode === 410) {
    return {
      heading: "Page gone",
      message: "This page has been permanently removed.",
    };
  }
  if (statusCode === 500) {
    return {
      heading: "Something went wrong",
      message: "An unexpected error occurred. Please try again later.",
    };
  }
  return {
    heading: `Error ${statusCode}`,
    message: props.error.message || "An unexpected error occurred.",
  };
});

function handleClearError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <nord-card padding="l" className="n:w-full n:max-w-[440px]">
    <nord-stack slot="header">
      <h1 class="n:text-l">{{ statusDescription.heading }}</h1>
    </nord-stack>
    <nord-stack gap="xl">
      <nord-stack align-items="center" gap="m">
        <nord-icon name="interface-warning" size="xl" class="n:text-danger" />
        <p>{{ statusDescription.message }}</p>
      </nord-stack>
      <nord-button variant="primary" expand @click="handleClearError">Go to home</nord-button>
    </nord-stack>
  </nord-card>
</template>
