<script setup lang="ts">
import "@nordhealth/components/lib/Icon";

const rules = [
  { label: "At least 8 characters", ruleField: "minLength" as const },
  { label: "Must contain an uppercase letter", ruleField: "containsUppercase" as const },
  { label: "Must contain a number", ruleField: "containsNumber" as const },
  { label: "Must contain a special character", ruleField: "containsSpecialCharacter" as const },
] as const;

const props = defineProps<{
  passwordRules: Record<string, { $valid: boolean }>;
}>();
</script>

<template>
  <div role="status" aria-live="polite" class="n:flex n:flex-col n:gap-2xs">
    <div
      v-for="rule in rules"
      :key="rule.label"
      :class="`n:flex n:items-center n:gap-xs n:text-s ${props.passwordRules[rule.ruleField].$valid ? 'n:text-success' : 'n:text-error'}`"
    >
      <nord-icon
        :name="
          props.passwordRules[rule.ruleField].$valid
            ? 'interface-checked-small'
            : 'interface-close-small'
        "
        class="n:shrink-0"
        size="xs"
      />
      <span>{{ rule.label }}</span>
    </div>
  </div>
</template>
