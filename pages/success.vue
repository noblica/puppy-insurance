<script setup lang="ts">
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Icon'
import '@nordhealth/components/lib/Stack'
import '@nordhealth/components/lib/Button'

useHead({ title: 'Account created | Puppy Insurance' })

const signUpCompleted = useState('signUpCompleted', () => false)

onMounted(() => {
  if (!signUpCompleted.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <nord-card style="width: 100%; max-width: 440px;">
    <div class="n:flex n:flex-col n:items-center n:text-center n:gap-xs n:pb-l n:border-b n:border-default n:mb-xs">
      <div class="n:flex n:items-center n:gap-xs">
        <nord-icon name="generic-pet-paw" size="l" />
        <span class="n:text-l n:font-weight-heading n:text-default">Puppy Insurance</span>
      </div>
    </div>
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
