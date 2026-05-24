<script setup lang="ts">
import '@nordhealth/components/lib/Card'
import '@nordhealth/components/lib/Stack'
import '@nordhealth/components/lib/Input'
import '@nordhealth/components/lib/Checkbox'
import '@nordhealth/components/lib/Button'
import '@nordhealth/components/lib/Icon'
import { createRule } from '@regle/core';
import { required, email, minLength, containsUppercase, containsSpecialCharacter, sameAs, checked, and } from '@regle/rules';

useHead({ title: 'Sign up | Puppy Insurance' })

const containsNumber = createRule({
  validator: (value: string | null | undefined) => /\d/.test(value ?? ''),
  message: 'Must contain a number',
})

const form = reactive({ email: '', password: '', confirmPassword: '', marketingConsent: false, termsAccepted: false })

const { r$ } = useRegle(
  form,
  {
    email: { required, email },
    // `and(required, ...)` prevents built-in rules from passing on empty values
    password: { required, minLength: and(required, minLength(8)), containsUppercase: and(required, containsUppercase()), containsNumber: and(required, containsNumber), containsSpecialCharacter: and(required, containsSpecialCharacter()) },
    confirmPassword: { required, sameAs: sameAs(() => form.password, 'Password') },
    termsAccepted: { checked },
  },
  { autoDirty: false },
)

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const formState = ref<'idle' | 'submitted' | 'submitting'>('idle');

const onSubmit = () => {
  formState.value = 'submitted'
  r$.$touch()
  if (r$.$invalid) return

  formState.value = 'submitting'
  setTimeout(() => {
    localStorage.setItem('signup_complete', 'true')
    navigateTo('/success')
  }, 3000)
}

</script>

<template>
  <nord-card padding="l" className="n:w-full n:max-w-[440px]">
    <h1 slot="header" class="n-typescale-l">Sign Up</h1>
    <form 
      novalidate 
      @submit.prevent="onSubmit"
      >
      <nord-stack gap="xl">
        <nord-stack>
        <nord-input
          v-model='r$.$value.email'
          type="email"
          label="Email"
          placeholder="you@example.com"
          autocomplete="email"
          expand
          :error="r$.email.$errors[0]"
          :disabled="formState === 'submitting'"
          @blur="r$.email.$touch()"
        />
        <nord-input
          v-model='r$.$value.password'
          label="Password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Enter your password"
          autocomplete="new-password"
          expand
          :error="r$.password.$dirty && r$.password.$invalid ? r$.password.$errors[0] : undefined"
          :disabled="formState === 'submitting'"
          @input="r$.password.$touch()"
          @blur="r$.password.$touch()"
          >
          <nord-button
            slot="end"
            type="button"
            :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="passwordVisible"
            :disabled="formState === 'submitting'"
            @click="passwordVisible = !passwordVisible"
          >
            <nord-icon
              :name="passwordVisible ? 'interface-edit-off' : 'interface-edit-on'"
            />
          </nord-button>
        </nord-input>

        <div v-if="r$.password.$dirty" role="status" aria-live="polite" class="n:flex n:flex-col n:gap-2xs">

          <div :class="`n:flex n:items-center n:gap-xs n:text-s ${r$.password.$rules.minLength.$valid ? 'n:text-success' : 'n:text-error'}`">
            <nord-icon
              :name="r$.password.$rules.minLength.$valid ? 'interface-checked-small' : 'interface-close-small'"
              class="n:shrink-0"
              size="xs"
            />
            <span>At least 8 characters</span>
          </div>

          <div :class="`n:flex n:items-center n:gap-xs n:text-s ${r$.password.$rules.containsUppercase.$valid ? 'n:text-success' : 'n:text-error'}`">
            <nord-icon
              :name="r$.password.$rules.containsUppercase.$valid ? 'interface-checked-small' : 'interface-close-small'"
              class="n:shrink-0"
              size="xs"
            />
            <span>Must contain an uppercase letter</span>
          </div>
          <div :class="`n:flex n:items-center n:gap-xs n:text-s ${r$.password.$rules.containsNumber.$valid ? 'n:text-success' : 'n:text-error'}`">
            <nord-icon
              :name="r$.password.$rules.containsNumber.$valid ? 'interface-checked-small' : 'interface-close-small'"
              class="n:shrink-0"
              size="xs"
            />
            <span>Must contain a number</span>
          </div>
          <div :class="`n:flex n:items-center n:gap-xs n:text-s ${r$.password.$rules.containsSpecialCharacter.$valid ? 'n:text-success' : 'n:text-error'}`">
            <nord-icon
              :name="r$.password.$rules.containsSpecialCharacter.$valid ? 'interface-checked-small' : 'interface-close-small'"
              class="n:shrink-0"
              size="xs"
            />
            <span>Must contain a special character</span>
          </div>
        </div>
        <nord-input
          placeholder="Confirm your password"
          v-model='r$.$value.confirmPassword'
          label="Confirm password"
          :type="confirmPasswordVisible ? 'text' : 'password'"
          autocomplete="new-password"
          expand
          :error="r$.confirmPassword.$errors[0]"
          :disabled="formState === 'submitting'"
          @blur="r$.confirmPassword.$touch()"
        >
          <nord-button
            slot="end"
            type="button"
            :aria-label="confirmPasswordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="confirmPasswordVisible"
            :disabled="formState === 'submitting'"
            @click="confirmPasswordVisible = !confirmPasswordVisible"
          >
            <nord-icon
              :name="confirmPasswordVisible ? 'interface-edit-off' : 'interface-edit-on'"
            />
          </nord-button>
        </nord-input>
          </nord-stack>

          <nord-stack>
        <nord-checkbox
          v-model="r$.$value.marketingConsent"
          type="checkbox"
          name="marketingConsent"
          :disabled="formState === 'submitting'"
        >
          <span slot="label" class="n:text-s">
            Receive occasional product updates and announcements
          </span>
        </nord-checkbox>

        <nord-checkbox
          v-model="r$.$value.termsAccepted"
          type="checkbox"
          name="termsAccepted"
          :error="r$.termsAccepted.$errors[0]"
          :disabled="formState === 'submitting'"
        >
          <span slot="label" class="n:text-s">
            I accept the
            <a href="javascript:void(0)" class="n:text-accent">Terms of Service</a>
            and
            <a href="javascript:void(0)" class="n:text-accent">Privacy Policy</a>
          </span>
        </nord-checkbox>
        </nord-stack>

        <nord-button 
          type="submit" 
          variant="primary"
          :loading="formState === 'submitting'"
        >
          Create account
        </nord-button>
      </nord-stack>
    </form>
  </nord-card>
</template>
