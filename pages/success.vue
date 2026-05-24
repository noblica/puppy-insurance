<script setup lang="ts">
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Icon'
import '@nordhealth/components/lib/Stack'
import '@nordhealth/components/lib/Button'

useHead({ title: 'Account created | Puppy Insurance' })

</script>

<template>
  <nord-card style="width: 100%; max-width: 440px;">
   <h1 slot="header">Puppy Insurance</h1>
    <nord-stack>
      <nord-icon
        name="interface-checked-circle"
        size="xl"
        style="color: var(--n-color-status-success);"
      />
      <p>Your account has been created successfully.</p>
      <NuxtLink to="/">
        <nord-button variant="primary">
          Go to home
        </nord-button>
      </NuxtLink>
    </nord-stack>
  </nord-card>
</template>
