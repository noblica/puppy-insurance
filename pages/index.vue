<script setup lang="ts">
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Stack'
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'

import nordicons from '@nordhealth/icons'

const eyeOffIcon = nordicons['interface-edit-off']
const eyeOnIcon = nordicons['interface-edit-on']
const checkedIcon = nordicons['interface-checked-small']
const uncheckedIcon = nordicons['interface-close-small']

useHead({ title: 'Sign up | Puppy Insurance' })

const {
  email,
  password,
  confirmPassword,
  marketingConsent,
  termsAccepted,
  passwordVisible,
  confirmPasswordVisible,
  submitting,
  errors,
  passwordChecks,
  emailRef,
  passwordRef,
  confirmPasswordRef,
  termsRef,
  onEmailBlur,
  onPasswordBlur,
  onConfirmPasswordBlur,
  onEmailInput,
  onPasswordInput,
  onConfirmPasswordInput,
  onMarketingChange,
  onTermsChange,
  togglePasswordVisibility,
  toggleConfirmPasswordVisibility,
  onSubmit,
} = useSignUpForm()

const passwordCheckLabels = {
  minLength: 'At least 8 characters',
  hasUppercase: 'At least one uppercase letter',
  hasNumber: 'At least one number',
  hasSpecial: 'At least one special character',
}
</script>

<template>
  <nord-card style="width: 100%; max-width: 440px;">
    <div class="n:flex n:flex-col n:items-center n:text-center n:gap-xs n:pb-l n:border-b n:border-default n:mb-xs">
      <div class="n:flex n:items-center n:gap-xs">
        <PawIcon :width="30" :height="30" class="n:fill-accent" />
        <span class="n:text-l n:font-weight-heading n:text-default">Puppy Insurance</span>
      </div>
      <p class="n:caption n:m-0 n:text-s">Sign Up</p>
    </div>
    <form novalidate @submit.prevent="onSubmit">
      <nord-stack>
        <nord-input
          :ref="(el: any) => { emailRef.value = el }"
          v-model="email"
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          :required="true"
          :error="errors.email || undefined"
          :disabled="submitting"
          @blur="onEmailBlur"
          @input="onEmailInput"
        />

        <nord-input
          :ref="(el: any) => { passwordRef.value = el }"
          v-model="password"
          name="password"
          label="Password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Enter your password"
          :required="true"
          :error="errors.password || undefined"
          :disabled="submitting"
          @blur="onPasswordBlur"
          @input="onPasswordInput"
        >
          <nord-button
            slot="end"
            type="button"
            :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="passwordVisible"
            :disabled="submitting"
            @click="togglePasswordVisibility"
          >
            <nord-icon
              :name="passwordVisible ? eyeOffIcon.title : eyeOnIcon.title"
              :svg="passwordVisible ? eyeOffIcon.svg : eyeOnIcon.svg"
            />
          </nord-button>
        </nord-input>

        <ul
          v-if="password.length > 0"
          style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: var(--n-space-xs);"
        >
          <li
            v-for="(isMet, key) in passwordChecks"
            :key="key"
            style="display: flex; align-items: center; gap: var(--n-space-xs); font-size: var(--n-font-size-s);"
            :style="{ color: isMet ? 'var(--n-color-status-success)' : 'var(--n-color-text-weaker)' }"
          >
            <nord-icon
              size="s"
              :name="isMet ? checkedIcon.title : uncheckedIcon.title"
              :svg="isMet ? checkedIcon.svg : uncheckedIcon.svg"
            />
            {{ passwordCheckLabels[key] }}
          </li>
        </ul>

        <nord-input
          :ref="(el: any) => { confirmPasswordRef.value = el }"
          v-model="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          :type="confirmPasswordVisible ? 'text' : 'password'"
          placeholder="Confirm your password"
          :required="true"
          :error="errors.confirmPassword || undefined"
          :disabled="submitting"
          @blur="onConfirmPasswordBlur"
          @input="onConfirmPasswordInput"
        >
          <nord-button
            slot="end"
            type="button"
            :aria-label="confirmPasswordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="confirmPasswordVisible"
            :disabled="submitting"
            @click="toggleConfirmPasswordVisibility"
          >
            <nord-icon
              :name="confirmPasswordVisible ? eyeOffIcon.title : eyeOnIcon.title"
              :svg="confirmPasswordVisible ? eyeOffIcon.svg : eyeOnIcon.svg"
            />
          </nord-button>
        </nord-input>

        <nord-checkbox
          name="marketingConsent"
          label="Receive occasional product updates and announcements"
          :checked="marketingConsent"
          :disabled="submitting"
          @change="onMarketingChange"
        />

        <nord-checkbox
          :ref="(el: any) => { termsRef.value = el }"
          name="termsAccepted"
          :checked="termsAccepted"
          :error="errors.termsAccepted || undefined"
          :disabled="submitting"
          @change="onTermsChange"
        >
          <span slot="label">
            I accept the
            <a href="#" style="color: var(--n-color-accent);">Terms of Service</a>
            and
            <a href="#" style="color: var(--n-color-accent);">Privacy Policy</a>
          </span>
        </nord-checkbox>

        <nord-button type="submit" variant="primary" :loading="submitting" :disabled="submitting">
          Create account
        </nord-button>
      </nord-stack>
    </form>
  </nord-card>
</template>
