import {
  required,
  email,
  minLength,
  containsUppercase,
  containsSpecialCharacter,
  sameAs,
  checked,
  and,
} from "@regle/rules";
import { containsNumber } from "~/utils/validation-rules";
import { submitSignup } from "~/services/submission";

function focusFirstInvalidField(form: HTMLFormElement) {
  const element = form.querySelector<HTMLElement>("[error]:not([error=''])");
  element?.focus();
}

export function useSignupForm() {
  const form = reactive({
    email: "",
    password: "",
    confirmPassword: "",
    marketingConsent: false,
    termsAccepted: false,
  });

  const { r$ } = useRegle(
    form,
    {
      email: { required, email },
      password: {
        required,
        minLength: and(required, minLength(8)),
        containsUppercase: and(required, containsUppercase()),
        containsNumber: and(required, containsNumber()),
        containsSpecialCharacter: and(required, containsSpecialCharacter()),
      },
      confirmPassword: { required, sameAs: sameAs(() => form.password, "Password") },
      termsAccepted: { checked },
    },
    { autoDirty: false },
  );

  const passwordVisible = ref(false);
  const confirmPasswordVisible = ref(false);
  const formState = ref<"idle" | "submitting" | "error">("idle");
  const errorMessage = ref("");
  const formRef = ref<HTMLFormElement | null>(null);

  const onSubmit = async () => {
    errorMessage.value = "";
    formState.value = "idle";

    r$.$touch();
    if (r$.$invalid) {
      nextTick(() => {
        if (formRef.value != null) {
          focusFirstInvalidField(formRef.value);
        }
      });
      return;
    }

    formState.value = "submitting";

    try {
      const result = await submitSignup();
      if (result.success) {
        navigateTo("/success");
      } else {
        formState.value = "error";
        errorMessage.value = result.error ?? "Something went wrong. Please try again.";
      }
    } catch {
      formState.value = "error";
      errorMessage.value = "Something went wrong. Please try again.";
    }
  };

  return {
    form,
    r$,
    passwordVisible,
    confirmPasswordVisible,
    formState,
    errorMessage,
    formRef,
    onSubmit,
  };
}
