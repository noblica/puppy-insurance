<script setup lang="ts">
import { createRule } from '@regle/core';
import { required, email, minLength, containsUppercase, containsSpecialCharacter, sameAs } from '@regle/rules';

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

const containsNumber = createRule({
  validator: (value: string | null | undefined) => /\d/.test(value ?? ''),
  message: 'Must contain a number',
})

const form = reactive({ email: '', password: '', confirmPassword: '' })

const { r$ } = useRegle(
  form,
  {
    email: { required, email },
    password: { required, minLength: minLength(8), containsUppercase, containsNumber, containsSpecialCharacter },
    confirmPassword: { required, sameAs: sameAs(() => form.password, 'Password') },
  },
  { autoDirty: false },
)

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const submitting = ref(false);

const passwordChecks = computed(() => ({
  minLength: r$.$value.password.length >= 8,
  hasUppercase: /[A-Z]/.test(r$.$value.password),
  hasNumber: /[0-9]/.test(r$.$value.password),
  hasSpecial: /[^a-zA-Z0-9]/.test(r$.$value.password),
}))

const onSubmit = () => {
  r$.$touch()
  if (r$.$invalid) return

  submitting.value = true;
  setTimeout(() => submitting.value = false, 3000)
}

</script>

<template>
  <nord-card className="n:w-full n:max-w-[440px]">
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
          v-model='r$.$value.email'
          type="email"
          label="Email"
          placeholder="you@example.com"
          :error="r$.email.$errors[0]"
          @blur="r$.email.$touch()"
        />
        <nord-input
          v-model='r$.$value.password'
          label="Password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Enter your password"
          :error="r$.password.$dirty ? r$.password.$errors[0] : undefined"
          @blur="r$.password.$touch()"
        >
          <nord-button
            slot="end"
            type="button"
            :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="passwordVisible"
            :disabled="submitting"
            @click="passwordVisible = !passwordVisible"
          >
            <nord-icon
              :name="passwordVisible ? eyeOffIcon.title : eyeOnIcon.title"
              :svg="passwordVisible ? eyeOffIcon.svg : eyeOnIcon.svg"
            />
          </nord-button>
        </nord-input>
        <div v-if="r$.$value.password" class="n:flex n:flex-col n:gap-2xs">
          <div class="n:flex n:items-center n:gap-2xs n:text-s">
            <nord-icon
              :name="passwordChecks.minLength ? checkedIcon.title : uncheckedIcon.title"
              :svg="passwordChecks.minLength ? checkedIcon.svg : uncheckedIcon.svg"
              class="n:shrink-0"
              size="xs"
            />
            <span :class="passwordChecks.minLength ? 'n:text-status-success' : 'n:text-status-danger'">At least 8 characters</span>
          </div>
          <div class="n:flex n:items-center n:gap-2xs n:text-s">
            <nord-icon
              :name="passwordChecks.hasUppercase ? checkedIcon.title : uncheckedIcon.title"
              :svg="passwordChecks.hasUppercase ? checkedIcon.svg : uncheckedIcon.svg"
              class="n:shrink-0"
              size="xs"
            />
            <span :class="passwordChecks.hasUppercase ? 'n:text-status-success' : 'n:text-status-danger'">Must contain an uppercase letter</span>
          </div>
          <div class="n:flex n:items-center n:gap-2xs n:text-s">
            <nord-icon
              :name="passwordChecks.hasNumber ? checkedIcon.title : uncheckedIcon.title"
              :svg="passwordChecks.hasNumber ? checkedIcon.svg : uncheckedIcon.svg"
              class="n:shrink-0"
              size="xs"
            />
            <span :class="passwordChecks.hasNumber ? 'n:text-status-success' : 'n:text-status-danger'">Must contain a number</span>
          </div>
          <div class="n:flex n:items-center n:gap-2xs n:text-s">
            <nord-icon
              :name="passwordChecks.hasSpecial ? checkedIcon.title : uncheckedIcon.title"
              :svg="passwordChecks.hasSpecial ? checkedIcon.svg : uncheckedIcon.svg"
              class="n:shrink-0"
              size="xs"
            />
            <span :class="passwordChecks.hasSpecial ? 'n:text-status-success' : 'n:text-status-danger'">Must contain a special character</span>
          </div>
        </div>
        <nord-input
          v-model='r$.$value.confirmPassword'
          label="Confirm password"
          :type="confirmPasswordVisible ? 'text' : 'password'"
          placeholder="Confirm your password"
          :error="r$.confirmPassword.$errors[0]"
          @blur="r$.confirmPassword.$touch()"
        >
          <nord-button
            slot="end"
            type="button"
            :aria-label="confirmPasswordVisible ? 'Hide password' : 'Show password'"
            :aria-pressed="confirmPasswordVisible"
            :disabled="submitting"
            @click="confirmPasswordVisible = !confirmPasswordVisible"
          >
            <nord-icon
              :name="confirmPasswordVisible ? eyeOffIcon.title : eyeOnIcon.title"
              :svg="confirmPasswordVisible ? eyeOffIcon.svg : eyeOnIcon.svg"
            />
          </nord-button>
        </nord-input>

        <!-- <nord-checkbox -->
        <!--   name="marketingConsent" -->
        <!--   label="Receive occasional product updates and announcements" -->
        <!-- /> -->
        <!---->
        <!-- <nord-checkbox -->
        <!--   name="termsAccepted" -->
        <!-- > -->
        <!--   <span slot="label"> -->
        <!--     I accept the -->
        <!--     <a href="#" style="color: var(--n-color-accent);">Terms of Service</a> -->
        <!--     and -->
        <!--     <a href="#" style="color: var(--n-color-accent);">Privacy Policy</a> -->
        <!--   </span> -->
        <!-- </nord-checkbox> -->

        <nord-button 
          type="submit" 
          variant="primary"
          :loading="submitting"
        >
          Create account
        </nord-button>
      </nord-stack>
    </form>
  </nord-card>
</template>
