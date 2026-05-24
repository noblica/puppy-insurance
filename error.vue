<script setup lang="ts">
import "@nordhealth/components/lib/Card";
import "@nordhealth/components/lib/Icon";
import "@nordhealth/components/lib/Stack";
import "@nordhealth/components/lib/Button";
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();

function handleClearError() {
  clearError({ redirect: "/" });
}
</script>

<template>
  <NuxtLayout>
    <nord-card padding="l" className="n:w-full n:max-w-[440px]">
      <nord-stack slot="header">
        <h1 class="n:text-l">Page not found</h1>
      </nord-stack>
      <nord-stack gap="xl">
        <nord-stack align-items="center" gap="m">
          <nord-icon name="interface-warning" size="xl" class="n:text-danger" />
          <p>The page you're looking for doesn't exist or has been moved.</p>
        </nord-stack>
        <nord-button variant="primary" expand @click="handleClearError">Go to home</nord-button>
      </nord-stack>
    </nord-card>
  </NuxtLayout>
</template>
