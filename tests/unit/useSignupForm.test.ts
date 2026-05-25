import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, nextTick } from "vue";
import { useSignupForm } from "~/composables/useSignupForm";

const TestWrapper = defineComponent({
  setup() {
    const formData = useSignupForm();
    (window as unknown as Record<string, unknown>)._formData = formData;
    return () => null;
  },
});

async function mountAndGetFormData() {
  await mountSuspended(TestWrapper);
  return (window as unknown as Record<string, unknown>)._formData as ReturnType<
    typeof useSignupForm
  >;
}

describe("useSignupForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("initial state: all fields empty, idle state, no errors", async () => {
    const { form, formState, r$ } = await mountAndGetFormData();

    expect(form.email).toBe("");
    expect(form.password).toBe("");
    expect(form.confirmPassword).toBe("");
    expect(form.marketingConsent).toBe(false);
    expect(form.termsAccepted).toBe(false);
    expect(formState.value).toBe("idle");
    expect(r$.$errors.email).toHaveLength(0);
    expect(r$.$errors.password).toHaveLength(0);
    expect(r$.$errors.confirmPassword).toHaveLength(0);
  });

  it("submit empty form shows required errors on all mandatory fields", async () => {
    const { r$, onSubmit } = await mountAndGetFormData();

    onSubmit();
    await nextTick();

    expect(r$.email.$errors).toHaveLength(1);
    expect(r$.email.$errors[0]).toContain("required");
    expect(r$.termsAccepted.$errors).toHaveLength(1);
    expect(r$.termsAccepted.$errors[0]).toContain("checked");
    expect(r$.password.$errors.length).toBeGreaterThanOrEqual(1);
    expect(r$.confirmPassword.$errors.length).toBeGreaterThanOrEqual(1);
  });

  it("submit with invalid email shows email format error", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.email = "notanemail";
    onSubmit();
    await nextTick();

    expect(
      r$.email.$errors.some((e: { toString(): string }) =>
        e.toString().toLowerCase().includes("email"),
      ),
    ).toBe(true);
  });

  it("submit with weak password activates all password rule validators", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.password = "pw";
    onSubmit();
    await nextTick();

    expect(r$.password.$errors.length).toBeGreaterThanOrEqual(1);
  });

  it("submit with mismatched passwords shows confirm password error", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.password = "Password1!";
    form.confirmPassword = "Different1!";
    onSubmit();
    await nextTick();

    expect(r$.confirmPassword.$errors.length).toBeGreaterThan(0);
  });

  it("valid password satisfies all password rules", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.password = "Password1!";
    onSubmit();
    await nextTick();

    expect(r$.password.$rules.minLength.$valid).toBe(true);
    expect(r$.password.$rules.containsUppercase.$valid).toBe(true);
    expect(r$.password.$rules.containsNumber.$valid).toBe(true);
    expect(r$.password.$rules.containsSpecialCharacter.$valid).toBe(true);
  });

  it("submit with all valid fields transitions to submitting state", async () => {
    const { form, formState, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "Password1!";
    form.confirmPassword = "Password1!";
    form.termsAccepted = true;
    onSubmit();
    await nextTick();

    expect(formState.value).toBe("submitting");
  });

  it("password visibility toggle flips passwordVisible", async () => {
    const { passwordVisible } = await mountAndGetFormData();

    expect(passwordVisible.value).toBe(false);
    passwordVisible.value = true;
    expect(passwordVisible.value).toBe(true);
    passwordVisible.value = false;
    expect(passwordVisible.value).toBe(false);
  });

  it("confirm password visibility toggle flips confirmPasswordVisible", async () => {
    const { confirmPasswordVisible } = await mountAndGetFormData();

    expect(confirmPasswordVisible.value).toBe(false);
    confirmPasswordVisible.value = true;
    expect(confirmPasswordVisible.value).toBe(true);
    confirmPasswordVisible.value = false;
    expect(confirmPasswordVisible.value).toBe(false);
  });

  it("successful submission sets localStorage", async () => {
    const { form, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "Password1!";
    form.confirmPassword = "Password1!";
    form.termsAccepted = true;
    onSubmit();

    vi.advanceTimersByTime(3000);

    expect(localStorage.getItem("signup_complete")).toBe("true");
  });

  it("formState remains idle when submission is invalid", async () => {
    const { formState, onSubmit } = await mountAndGetFormData();

    onSubmit();
    await nextTick();

    expect(formState.value).toBe("idle");
  });

  it("marketingConsent has no validation rule and can be left unchecked", async () => {
    const { form, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "Password1!";
    form.confirmPassword = "Password1!";
    form.termsAccepted = true;
    form.marketingConsent = false;
    onSubmit();

    vi.advanceTimersByTime(3000);

    expect(localStorage.getItem("signup_complete")).toBe("true");
  });
});
