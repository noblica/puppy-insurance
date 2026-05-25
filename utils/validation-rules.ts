import { createRule } from "@regle/core";

export const containsNumber = createRule({
  // Returns true for empty values so that the rule only reports failures
  // when an actual value is present. The `required` rule (gated via `and()`
  // in the composable) handles the "field is empty" case independently.
  // This is consistent with the behaviour of other Regle rules such as
  // `containsUppercase()` and `containsSpecialCharacter()`.
  validator: (value: string | null | undefined) => {
    if (value == null || value === "") {
      return true;
    }
    return /\d/.test(value);
  },
  message: "Must contain a number",
});
