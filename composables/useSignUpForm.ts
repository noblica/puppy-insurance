import { z } from 'zod'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  marketingConsent: z.boolean(),
  termsAccepted: z
    .boolean()
    .refine((value) => value === true, 'You must accept the terms to continue'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ValidatedField = 'email' | 'password' | 'confirmPassword' | 'termsAccepted'

const FIELD_ORDER: ValidatedField[] = ['email', 'password', 'confirmPassword', 'termsAccepted']

export function useSignUpForm() {
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const marketingConsent = ref(false)
  const termsAccepted = ref(false)

  const passwordVisible = ref(false)
  const confirmPasswordVisible = ref(false)

  const submitting = ref(false)
  const submitted = ref(false)

  const errors = reactive<Record<ValidatedField, string>>({
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: '',
  })

  const emailRef = ref<HTMLElement | null>(null)
  const passwordRef = ref<HTMLElement | null>(null)
  const confirmPasswordRef = ref<HTMLElement | null>(null)
  const termsRef = ref<HTMLElement | null>(null)

  const passwordChecks = computed(() => ({
    minLength: password.value.length >= 8,
    hasUppercase: /[A-Z]/.test(password.value),
    hasNumber: /[0-9]/.test(password.value),
    hasSpecial: /[^a-zA-Z0-9]/.test(password.value),
  }))

  const signUpCompleted = useState('signUpCompleted', () => false)

  function validateSingleField(field: ValidatedField) {
    const result = schema.safeParse({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      marketingConsent: marketingConsent.value,
      termsAccepted: termsAccepted.value,
    })
    if (result.success) {
      errors[field] = ''
      return true
    }
    const fieldIssue = result.error.issues.find((issue) => issue.path[0] === field)
    errors[field] = fieldIssue?.message ?? ''
    return !fieldIssue
  }

  function onEmailBlur() {
    if (!submitted.value) validateSingleField('email')
  }

  function onPasswordBlur() {
    if (!submitted.value) validateSingleField('password')
  }

  function onConfirmPasswordBlur() {
    if (!submitted.value) validateSingleField('confirmPassword')
  }

  function onEmailInput() {
    if (submitted.value || errors.email) validateSingleField('email')
  }

  function onPasswordInput() {
    if (submitted.value || errors.password) validateSingleField('password')
  }

  function onConfirmPasswordInput() {
    if (submitted.value || errors.confirmPassword) validateSingleField('confirmPassword')
  }

  function onMarketingChange(event: Event) {
    marketingConsent.value = (event.target as HTMLInputElement).checked
  }

  function onTermsChange(event: Event) {
    termsAccepted.value = (event.target as HTMLInputElement).checked
    if (submitted.value || errors.termsAccepted) validateSingleField('termsAccepted')
  }

  function togglePasswordVisibility() {
    passwordVisible.value = !passwordVisible.value
  }

  function toggleConfirmPasswordVisibility() {
    confirmPasswordVisible.value = !confirmPasswordVisible.value
  }

  async function onSubmit(event: SubmitEvent) {
    submitted.value = true

    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const result = schema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      marketingConsent: formData.has('marketingConsent'),
      termsAccepted: formData.has('termsAccepted'),
    })

    if (!result.success) {
      for (const field of FIELD_ORDER) {
        const fieldIssue = result.error.issues.find((issue) => issue.path[0] === field)
        errors[field] = fieldIssue?.message ?? ''
      }

      await nextTick()
      const fieldRefs: Record<ValidatedField, typeof emailRef> = {
        email: emailRef,
        password: passwordRef,
        confirmPassword: confirmPasswordRef,
        termsAccepted: termsRef,
      }
      for (const field of FIELD_ORDER) {
        if (errors[field] && fieldRefs[field].value) {
          ;(fieldRefs[field].value as any).focus()
          break
        }
      }

      return false
    }

    for (const field of FIELD_ORDER) {
      errors[field] = ''
    }

    submitting.value = true
    await new Promise<void>((resolve) => setTimeout(resolve, 1500))
    submitting.value = false

    signUpCompleted.value = true
    navigateTo('/success')
    return true
  }

  return {
    email,
    password,
    confirmPassword,
    marketingConsent,
    termsAccepted,
    passwordVisible,
    confirmPasswordVisible,
    submitting,
    submitted,
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
  }
}
