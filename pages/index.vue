<script setup lang="ts">
import { required, email, minLength } from '@regle/rules';

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

const { r$ } = useRegle(
  { email: '', password: '', confirmPassword: ''},
  { email: {required, email}, password: {required}, confirmPassword: {required} },
)

const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const submitting = ref(false);

const onSubmit = (event) => {
  submitting.value = true;
  console.log(event, submitting.value);
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
        />
          <ul>
            <li v-for="error of r$.email.$errors" :key='error'>
              {{ error }}
            </li>
          </ul>
        <nord-input
          v-model='r$.$value.password'
          label="Password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="Enter your password"
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


        <nord-input
          v-model='r$.$value.confirmPassword'
          label="Confirm password"
          :type="confirmPasswordVisible ? 'text' : 'password'"
          placeholder="Confirm your password"
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
    </Form>
  </nord-card>
</template>
