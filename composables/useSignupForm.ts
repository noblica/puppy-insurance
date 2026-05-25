import "@nordhealth/components/lib/Input";
import "@nordhealth/components/lib/Checkbox";
import "@nordhealth/components/lib/Button";
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
import { SIGNUP_COMPLETE_KEY } from "~/utils/constants";

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
  const formState = ref<"idle" | "submitting">("idle");
  const formRef = ref<HTMLFormElement | null>(null);

  const onSubmit = () => {
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
    setTimeout(() => {
      localStorage.setItem(SIGNUP_COMPLETE_KEY, "true");
      navigateTo("/success");
    }, 3000);
  };

  return {
    form,
    r$,
    passwordVisible,
    confirmPasswordVisible,
    formState,
    formRef,
    onSubmit,
  };
}
