<script setup lang="ts">
import PasswordStrengthChecklist from "~/components/PasswordStrengthChecklist.vue";
import { useSignupForm } from "~/composables/useSignupForm";

useHead({ title: "Sign up | Puppy Insurance" });

const { r$, passwordVisible, confirmPasswordVisible, formState, formRef, onSubmit } =
  useSignupForm();
</script>

<template>
  <nord-card padding="l" className="n:w-full n:max-w-[440px]">
    <nord-stack slot="header">
      <h1 class="n:text-l">Sign Up for Puppy Insurance</h1>
    </nord-stack>
    <form ref="formRef" novalidate @submit.prevent="onSubmit">
      <nord-stack gap="xl">
        <nord-stack>
          <nord-input
            v-model="r$.$value.email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autocomplete="email"
            expand
            :error="r$.email.$dirty && r$.email.$invalid ? r$.email.$errors[0] : undefined"
            :disabled="formState === 'submitting'"
            @blur="r$.email.$touch()"
          />
          <nord-input
            v-model="r$.$value.password"
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
              :aria-pressed="passwordVisible"
              :disabled="formState === 'submitting'"
              @click="passwordVisible = !passwordVisible"
            >
              <nord-icon :name="passwordVisible ? 'interface-edit-off' : 'interface-edit-on'" />
              <nord-visually-hidden>{{
                passwordVisible ? "Hide password" : "Show password"
              }}</nord-visually-hidden>
            </nord-button>
          </nord-input>

          <PasswordStrengthChecklist
            v-if="r$.password.$dirty"
            :password-rules="r$.password.$rules"
          />

          <nord-input
            placeholder="Confirm your password"
            v-model="r$.$value.confirmPassword"
            label="Confirm password"
            :type="confirmPasswordVisible ? 'text' : 'password'"
            autocomplete="new-password"
            expand
            :error="
              r$.confirmPassword.$dirty && r$.confirmPassword.$invalid
                ? r$.confirmPassword.$errors[0]
                : undefined
            "
            :disabled="formState === 'submitting'"
            @blur="r$.confirmPassword.$touch()"
          >
            <nord-button
              slot="end"
              type="button"
              :aria-pressed="confirmPasswordVisible"
              :disabled="formState === 'submitting'"
              @click="confirmPasswordVisible = !confirmPasswordVisible"
            >
              <nord-icon
                :name="confirmPasswordVisible ? 'interface-edit-off' : 'interface-edit-on'"
              />
              <nord-visually-hidden>{{
                confirmPasswordVisible ? "Hide confirm password" : "Show confirm password"
              }}</nord-visually-hidden>
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
            :error="
              r$.termsAccepted.$dirty && r$.termsAccepted.$invalid
                ? r$.termsAccepted.$errors[0]
                : undefined
            "
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

        <nord-button type="submit" variant="primary" expand :loading="formState === 'submitting'">
          Create account
        </nord-button>
      </nord-stack>
    </form>
  </nord-card>
</template>
