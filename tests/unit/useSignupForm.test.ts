import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { defineComponent, nextTick } from "vue";
import { useSignupForm } from "~/composables/useSignupForm";
import { submitSignup } from "~/services/submission";

vi.mock("~/services/submission", () => ({
  submitSignup: vi.fn().mockResolvedValue({ success: true }),
}));

type SignupFormState = ReturnType<typeof useSignupForm>;

const TestWrapper = defineComponent({
  setup() {
    return useSignupForm();
  },
  template: "<div />",
});

async function mountAndGetFormData() {
  const wrapper = await mountSuspended(TestWrapper);
  return wrapper.vm as unknown as SignupFormState;
}

function get(vm: unknown) {
  return vm as unknown as SignupFormState;
}

function setupForm(formData: SignupFormState) {
  formData.form.email = "test@example.com";
  formData.form.password = "Password1!";
  formData.form.confirmPassword = "Password1!";
  formData.form.termsAccepted = true;
}

function assertEmailError(r$: SignupFormState["r$"]) {
  expect(
    r$.email.$errors.some((error: { toString(): string }) =>
      error.toString().toLowerCase().includes("email"),
    ),
  ).toBe(true);
}

describe("useSignupForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("initial state: all fields empty, idle state, no errors", async () => {
    const { form, formState, errorMessage, r$ } = await mountAndGetFormData();

    expect(form.email).toBe("");
    expect(form.password).toBe("");
    expect(form.confirmPassword).toBe("");
    expect(form.marketingConsent).toBe(false);
    expect(form.termsAccepted).toBe(false);
    expect(formState).toBe("idle");
    expect(errorMessage).toBe("");
    expect(r$.$errors.email).toHaveLength(0);
    expect(r$.$errors.password).toHaveLength(0);
    expect(r$.$errors.confirmPassword).toHaveLength(0);
  });

  it("submit empty form shows required errors on all mandatory fields", async () => {
    const { r$, onSubmit } = await mountAndGetFormData();

    await onSubmit();
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
    form.password = "Password1!";
    form.confirmPassword = "Password1!";
    form.termsAccepted = true;
    await onSubmit();
    await nextTick();

    assertEmailError(r$);
  });

  it("submit with weak password activates all password rule validators", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "pw";
    form.confirmPassword = "pw";
    form.termsAccepted = true;
    await onSubmit();
    await nextTick();

    expect(r$.password.$errors.length).toBeGreaterThanOrEqual(1);
  });

  it("submit with mismatched passwords shows confirm password error", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "Password1!";
    form.confirmPassword = "Different1!";
    form.termsAccepted = true;
    await onSubmit();
    await nextTick();

    expect(r$.confirmPassword.$errors.length).toBeGreaterThan(0);
  });

  it("valid password satisfies all password rules", async () => {
    const { form, r$, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "Password1!";
    form.confirmPassword = "Password1!";
    form.termsAccepted = true;
    await onSubmit();
    await nextTick();

    expect(r$.password.$rules.minLength.$valid).toBe(true);
    expect(r$.password.$rules.containsUppercase.$valid).toBe(true);
    expect(r$.password.$rules.containsNumber.$valid).toBe(true);
    expect(r$.password.$rules.containsSpecialCharacter.$valid).toBe(true);
  });

  it("submit with all valid fields transitions to submitting state", async () => {
    vi.mocked(submitSignup).mockResolvedValue({ success: true });
    const wrapper = await mountSuspended(TestWrapper);
    const { form, onSubmit } = get(wrapper.vm);

    setupForm({ form, onSubmit } as unknown as SignupFormState);

    onSubmit();
    await nextTick();

    expect(get(wrapper.vm).formState).toBe("submitting");
    expect(submitSignup).toHaveBeenCalledOnce();
  });

  it("successful submission navigates to success page", async () => {
    vi.mocked(submitSignup).mockResolvedValue({ success: true });
    const { form, onSubmit } = await mountAndGetFormData();

    setupForm({ form, onSubmit } as unknown as SignupFormState);

    await onSubmit();

    expect(submitSignup).toHaveBeenCalledOnce();
  });

  it("formState remains idle when submission is invalid", async () => {
    const wrapper = await mountSuspended(TestWrapper);
    const { onSubmit } = get(wrapper.vm);

    await onSubmit();
    await nextTick();

    expect(get(wrapper.vm).formState).toBe("idle");
  });

  it("transitions to error state when submission returns success: false", async () => {
    vi.mocked(submitSignup).mockResolvedValue({ success: false, error: "Email already taken" });
    const wrapper = await mountSuspended(TestWrapper);
    const { form, onSubmit } = get(wrapper.vm);

    setupForm({ form, onSubmit } as unknown as SignupFormState);

    await onSubmit();

    const state = get(wrapper.vm);
    expect(state.formState).toBe("error");
    expect(state.errorMessage).toBe("Email already taken");
    expect(submitSignup).toHaveBeenCalledOnce();
  });

  it("transitions to error state when submission throws", async () => {
    vi.mocked(submitSignup).mockRejectedValue(new Error("Network error"));
    const wrapper = await mountSuspended(TestWrapper);
    const { form, onSubmit } = get(wrapper.vm);

    setupForm({ form, onSubmit } as unknown as SignupFormState);

    await onSubmit();

    const state = get(wrapper.vm);
    expect(state.formState).toBe("error");
    expect(state.errorMessage).toBe("Something went wrong. Please try again.");
    expect(submitSignup).toHaveBeenCalledOnce();
  });

  it("submitting again clears previous error and returns to idle on success", async () => {
    vi.mocked(submitSignup).mockResolvedValueOnce({ success: false, error: "Server error" });
    const wrapper = await mountSuspended(TestWrapper);
    const { form, onSubmit } = get(wrapper.vm);

    setupForm({ form, onSubmit } as unknown as SignupFormState);

    await onSubmit();

    let state = get(wrapper.vm);
    expect(state.formState).toBe("error");
    expect(state.errorMessage).toBe("Server error");

    vi.mocked(submitSignup).mockResolvedValue({ success: true });

    await onSubmit();

    state = get(wrapper.vm);
    expect(state.formState).not.toBe("error");
    expect(state.errorMessage).toBe("");
    expect(submitSignup).toHaveBeenCalledTimes(2);
  });

  it("marketingConsent has no validation rule and can be left unchecked", async () => {
    vi.mocked(submitSignup).mockResolvedValue({ success: true });
    const { form, onSubmit } = await mountAndGetFormData();

    form.email = "test@example.com";
    form.password = "Password1!";
    form.confirmPassword = "Password1!";
    form.termsAccepted = true;
    form.marketingConsent = false;

    await onSubmit();

    expect(submitSignup).toHaveBeenCalledOnce();
  });
});
