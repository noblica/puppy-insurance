import { createRule } from "@regle/core";

export const containsNumber = createRule({
  validator: (value: string | null | undefined) => /\d/.test(value ?? ""),
  message: "Must contain a number",
});
