import { describe, it, expect, vi, beforeEach } from 'vitest'
import { effectScope } from 'vue'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useSignUpForm } from '~/composables/useSignUpForm'

const mockNavigateTo = vi.hoisted(() => vi.fn())
mockNuxtImport('navigateTo', () => mockNavigateTo)

function createForm() {
  const scope = effectScope()
  const form = scope.run(() => useSignUpForm())!
  return { form, scope }
}

const VALID_FORM = {
  email: 'user@example.com',
  password: 'Password1!',
  confirmPassword: 'Password1!',
  termsAccepted: true,
}

const EMPTY_FORM = {
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
}

function makeSubmitEvent(overrides: Partial<typeof VALID_FORM> = {}): SubmitEvent {
  const values = { ...VALID_FORM, ...overrides }
  const form = document.createElement('form')

  const addInput = (name: string, value: string) => {
    const input = document.createElement('input')
    input.name = name
    input.value = value
    form.appendChild(input)
  }

  const addCheckbox = (name: string, checked: boolean) => {
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.name = name
    input.checked = checked
    if (checked) form.appendChild(input)
  }

  addInput('email', values.email ?? '')
  addInput('password', values.password ?? '')
  addInput('confirmPassword', values.confirmPassword ?? '')
  addCheckbox('marketingConsent', false)
  addCheckbox('termsAccepted', values.termsAccepted ?? false)

  return { currentTarget: form, preventDefault: () => {} } as unknown as SubmitEvent
}

describe('useSignUpForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('empty submit shows all required field errors', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent(EMPTY_FORM))
    expect(form.errors.email).toBeTruthy()
    expect(form.errors.password).toBeTruthy()
    expect(form.errors.confirmPassword).toBeTruthy()
    expect(form.errors.termsAccepted).toBeTruthy()
    scope.stop()
  })

  it('empty submit returns false', async () => {
    const { form, scope } = createForm()
    const result = await form.onSubmit(makeSubmitEvent(EMPTY_FORM))
    expect(result).toBe(false)
    scope.stop()
  })

  it('invalid email format shows email error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ email: 'notanemail' }))
    expect(form.errors.email).toBe('Please enter a valid email address')
    scope.stop()
  })

  it('empty email shows required error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ email: '' }))
    expect(form.errors.email).toBe('Email is required')
    scope.stop()
  })

  it('password shorter than 8 chars shows length error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ password: 'Ab1!', confirmPassword: 'Ab1!' }))
    expect(form.errors.password).toBe('Password must be at least 8 characters')
    scope.stop()
  })

  it('password missing uppercase shows uppercase error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ password: 'password1!', confirmPassword: 'password1!' }))
    expect(form.errors.password).toBe('Must contain an uppercase letter')
    scope.stop()
  })

  it('password missing number shows number error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ password: 'Password!', confirmPassword: 'Password!' }))
    expect(form.errors.password).toBe('Must contain a number')
    scope.stop()
  })

  it('password missing special char shows special char error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ password: 'Password1', confirmPassword: 'Password1' }))
    expect(form.errors.password).toBe('Must contain a special character')
    scope.stop()
  })

  it('valid password shows no password error', async () => {
    const { form, scope } = createForm()
    const submitPromise = form.onSubmit(makeSubmitEvent())
    await vi.advanceTimersByTimeAsync(1500)
    await submitPromise
    expect(form.errors.password).toBe('')
    scope.stop()
  })

  it('passwordChecks reflects live password value correctly', () => {
    const { form, scope } = createForm()

    form.password.value = ''
    expect(form.passwordChecks.value.minLength).toBe(false)
    expect(form.passwordChecks.value.hasUppercase).toBe(false)
    expect(form.passwordChecks.value.hasNumber).toBe(false)
    expect(form.passwordChecks.value.hasSpecial).toBe(false)

    form.password.value = 'Password1!'
    expect(form.passwordChecks.value.minLength).toBe(true)
    expect(form.passwordChecks.value.hasUppercase).toBe(true)
    expect(form.passwordChecks.value.hasNumber).toBe(true)
    expect(form.passwordChecks.value.hasSpecial).toBe(true)

    form.password.value = 'abc'
    expect(form.passwordChecks.value.minLength).toBe(false)
    expect(form.passwordChecks.value.hasUppercase).toBe(false)
    expect(form.passwordChecks.value.hasNumber).toBe(false)
    expect(form.passwordChecks.value.hasSpecial).toBe(false)

    scope.stop()
  })

  it('mismatched confirm password shows mismatch error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ confirmPassword: 'DifferentPassword1!' }))
    expect(form.errors.confirmPassword).toBe('Passwords do not match')
    scope.stop()
  })

  it('valid form submits successfully and navigates to /success', async () => {
    const { form, scope } = createForm()
    const submitPromise = form.onSubmit(makeSubmitEvent())
    await vi.advanceTimersByTimeAsync(1500)
    const result = await submitPromise
    expect(result).toBe(true)
    expect(mockNavigateTo).toHaveBeenCalledWith('/success')
    scope.stop()
  })

  it('valid form has no errors after successful submit', async () => {
    const { form, scope } = createForm()
    const submitPromise = form.onSubmit(makeSubmitEvent())
    await vi.advanceTimersByTimeAsync(1500)
    await submitPromise
    expect(form.errors.email).toBe('')
    expect(form.errors.password).toBe('')
    expect(form.errors.confirmPassword).toBe('')
    expect(form.errors.termsAccepted).toBe('')
    scope.stop()
  })

  it('termsAccepted false on submit shows terms error', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent({ termsAccepted: false }))
    expect(form.errors.termsAccepted).toBe('You must accept the terms to continue')
    scope.stop()
  })

  it('email error clears when field becomes valid after a submit attempt', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent(EMPTY_FORM))
    expect(form.errors.email).toBeTruthy()

    form.email.value = 'valid@example.com'
    form.onEmailInput()

    expect(form.errors.email).toBe('')
    scope.stop()
  })

  it('submitting is true during async delay and false after', async () => {
    const { form, scope } = createForm()

    const submitPromise = form.onSubmit(makeSubmitEvent())

    expect(form.submitting.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1500)
    await submitPromise

    expect(form.submitting.value).toBe(false)
    scope.stop()
  })

  it('submitting stays false when form is invalid', async () => {
    const { form, scope } = createForm()
    await form.onSubmit(makeSubmitEvent(EMPTY_FORM))
    expect(form.submitting.value).toBe(false)
    scope.stop()
  })

  it('blur before submit triggers validation for email', () => {
    const { form, scope } = createForm()
    form.onEmailBlur()
    expect(form.errors.email).toBeTruthy()
    scope.stop()
  })

  it('blur before submit triggers validation for password', () => {
    const { form, scope } = createForm()
    form.onPasswordBlur()
    expect(form.errors.password).toBeTruthy()
    scope.stop()
  })

  it('input before submit does not show error when field has no prior error', () => {
    const { form, scope } = createForm()
    form.email.value = 'typing...'
    form.onEmailInput()
    expect(form.errors.email).toBe('')
    scope.stop()
  })

  it('input before submit clears error and revalidates if field had an error', () => {
    const { form, scope } = createForm()
    form.onEmailBlur() // triggers validation → error shown
    expect(form.errors.email).toBeTruthy()

    form.email.value = 'valid@example.com'
    form.onEmailInput() // should revalidate since error exists
    expect(form.errors.email).toBe('')
    scope.stop()
  })
})
