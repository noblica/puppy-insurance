<script setup lang="ts">
import "@nordhealth/components/lib/Card";
import "@nordhealth/components/lib/Icon";
import "@nordhealth/components/lib/Stack";
import "@nordhealth/components/lib/Button";

useHead({ title: "Account created | Puppy Insurance" });

definePageMeta({
  middleware: (to, from) => {
    if (!localStorage.getItem("signup_complete")) {
      return navigateTo("/");
    }
  },
});

const goHome = () => {
  localStorage.removeItem("signup_complete");
  navigateTo("/");
};
</script>

<template>
  <nord-card padding="l" className="n:w-full n:max-w-[440px]">
    <nord-stack slot="header">
      <h1 class="n:text-l">Account created</h1>
    </nord-stack>
    <nord-stack gap="xl">
      <nord-stack align-items="center" gap="m">
        <nord-icon name="interface-checked-circle" size="xl" class="n:text-success" />
        <p>Your account has been created successfully.</p>
      </nord-stack>
      <nord-button variant="primary" expand @click="goHome"> Go to home </nord-button>
    </nord-stack>
  </nord-card>
</template>
