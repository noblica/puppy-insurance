<script setup lang="ts">
import { PASSWORD_RULES } from "~/utils/validation-rules";

defineProps<{
  passwordRules: Record<string, { $valid: boolean }>;
}>();
</script>

<template>
  <div role="status" aria-live="polite" class="n:flex n:flex-col n:gap-2xs">
    <div
      v-for="rule in PASSWORD_RULES"
      :key="rule.label"
      :class="`n:flex n:items-center n:gap-xs n:text-s ${passwordRules[rule.field].$valid ? 'n:text-success' : 'n:text-error'}`"
    >
      <nord-icon
        :name="
          passwordRules[rule.field].$valid ? 'interface-checked-small' : 'interface-close-small'
        "
        class="n:shrink-0"
        size="xs"
      />
      <span>{{ rule.label }}</span>
    </div>
  </div>
</template>
