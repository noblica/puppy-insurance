import { SIGNUP_COMPLETE_KEY } from "~/utils/constants";

export interface SubmissionResult {
  success: boolean;
  error?: string;
}

export async function submitSignup(): Promise<SubmissionResult> {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  localStorage.setItem(SIGNUP_COMPLETE_KEY, "true");
  return { success: true };
}
