<script setup lang="ts">
import "@nordhealth/components/lib/Card";
import "@nordhealth/components/lib/Icon";
import "@nordhealth/components/lib/Stack";
import "@nordhealth/components/lib/Button";
import { SIGNUP_COMPLETE_KEY } from "~/utils/constants";

useHead({ title: "Account created | Puppy Insurance" });

definePageMeta({
  middleware: (to, from) => {
    if (!localStorage.getItem(SIGNUP_COMPLETE_KEY)) {
      return navigateTo("/");
    }
  },
});

const goHome = () => {
  localStorage.removeItem(SIGNUP_COMPLETE_KEY);
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
