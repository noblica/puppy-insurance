<script setup>
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Stack'
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Divider'
import '@nordhealth/components/lib/Badge'
</script>

<template>
  <main class="n:bg-default n:p-l" style="min-height: 100vh;">
    <nord-card heading="Nordhealth Web Components">
      <nord-stack>
        <nord-input label="Email" type="email" placeholder="you@example.com" />
        <nord-input label="Password" type="password" placeholder="Enter your password" />
        <nord-checkbox label="Receive occasional product updates" />
        <nord-button variant="primary">Create account</nord-button>
      </nord-stack>
    </nord-card>

    <nord-divider />

    <nord-stack direction="horizontal" gap="s">
      <nord-badge>Beta</nord-badge>
      <nord-badge variant="success">Active</nord-badge>
      <nord-badge variant="warning">Pending</nord-badge>
      <nord-badge variant="danger">Expired</nord-badge>
    </nord-stack>

    <nord-divider />

    <div class="n:bg-accent n:p-m n:text-on-accent" style="border-radius: var(--n-border-radius-s);">
      VET theme accent color (purple = working!)
    </div>
    <p class="n:text-accent">Accent text color</p>
  </main>
</template>

