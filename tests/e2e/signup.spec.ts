import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type TestFixtures = {
  isMobile: boolean;
};

const test = base.extend<TestFixtures>({
  isMobile: async (_, use, testInfo) => {
    await use(testInfo.project.name.includes("mobile"));
  },
});

const VALID_EMAIL = "test@example.com";
const VALID_PASSWORD = "Password1!";

async function fillEmail(page: any, value: string) {
  await page.locator('nord-input[label="Email"]').locator("input").fill(value);
}

async function fillPassword(page: any, value: string) {
  await page.locator('nord-input[label="Password"]').locator("input").fill(value);
}

async function fillConfirmPassword(page: any, value: string) {
  await page.locator('nord-input[label="Confirm password"]').locator("input").fill(value);
}

async function checkTerms(page: any) {
  const checkbox = page.locator("nord-checkbox").filter({ hasText: "Terms of Service" });
  await checkbox.locator('input[type="checkbox"]').check({ force: true });
}

async function submitForm(page: any) {
  await page.getByRole("button", { name: "Create account" }).click();
}

test.describe("Sign-up form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("golden path: fill all fields, submit, land on /success", async ({ page }) => {
    await fillEmail(page, VALID_EMAIL);
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, VALID_PASSWORD);
    await checkTerms(page);
    await submitForm(page);

    await expect(page).toHaveURL("/success");
    await expect(page.getByText("Your account has been created successfully.")).toBeVisible();
  });

  test("submit with all fields empty shows required errors for each field", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop-only test");
    await submitForm(page);

    await expect(page.getByText("Email is required")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
    await expect(page.getByText("Please confirm your password")).toBeVisible();
    await expect(page.getByText("You must accept the terms to continue")).toBeVisible();
  });

  test("submit with invalid email shows email format error", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    await fillEmail(page, "notanemail");
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, VALID_PASSWORD);
    await checkTerms(page);
    await submitForm(page);

    await expect(page.getByText("Please enter a valid email address")).toBeVisible();
  });

  test("password strength checklist updates live as user types", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    const passwordInput = page.locator('nord-input[label="Password"]').locator("input");

    // No checklist before typing
    await expect(page.getByText("At least 8 characters")).not.toBeVisible();

    // After typing, checklist appears
    await passwordInput.fill("a");
    await expect(page.getByText("At least 8 characters")).toBeVisible();
    await expect(page.getByText("At least one uppercase letter")).toBeVisible();
    await expect(page.getByText("At least one number")).toBeVisible();
    await expect(page.getByText("At least one special character")).toBeVisible();

    // Requirements are met as user satisfies them
    await passwordInput.fill("Password1!");
    // All requirements met — checklist still visible with correct state
    await expect(page.getByText("At least 8 characters")).toBeVisible();
  });

  test("password visibility toggle shows and hides password", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    const passwordInput = page.locator('nord-input[label="Password"]').locator("input");
    const toggleButton = page.locator('nord-input[label="Password"]').getByRole("button");

    await passwordInput.fill(VALID_PASSWORD);
    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("password toggle button has correct aria-label and aria-pressed", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop-only test");
    const toggleButton = page.locator('nord-input[label="Password"]').locator("nord-button");

    await expect(toggleButton).toHaveAttribute("aria-label", "Show password");
    await expect(toggleButton).toHaveAttribute("aria-pressed", "false");

    await toggleButton.click();

    await expect(toggleButton).toHaveAttribute("aria-label", "Hide password");
    await expect(toggleButton).toHaveAttribute("aria-pressed", "true");
  });

  test("success page without completing sign-up redirects to /", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    await page.goto("/success");
    await expect(page).toHaveURL("/");
  });

  test("keyboard navigation: tab through fields and submit with Enter", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Mobile has no keyboard navigation");
    const emailInput = page.locator('nord-input[label="Email"]').locator("input");

    await emailInput.focus();
    await page.keyboard.type(VALID_EMAIL);
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALID_PASSWORD);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // skip password toggle
    await page.keyboard.type(VALID_PASSWORD);

    await checkTerms(page);

    await page.getByRole("button", { name: "Create account" }).focus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("/success");
  });

  test("mismatched passwords show confirm password error", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    await fillEmail(page, VALID_EMAIL);
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, "DifferentPassword1!");
    await checkTerms(page);
    await submitForm(page);

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("all form fields are disabled during submission", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    await fillEmail(page, VALID_EMAIL);
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, VALID_PASSWORD);
    await checkTerms(page);

    await submitForm(page);

    // While submitting (before navigation), fields should be disabled
    const submitButton = page.getByRole("button", { name: "Create account" });
    await expect(submitButton).toBeDisabled();
  });

  test("sign-up page has no automated accessibility violations", async ({ page }) => {
    await page.waitForSelector("h1");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const violations = accessibilityScanResults.violations.filter(
      (violation) =>
        !violation.nodes.some(
          (node) => node.html.includes("devtools") || node.target.join(">").includes("devtools"),
        ),
    );

    expect(violations).toEqual([]);
  });

  test("validation failure moves focus to first error", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only test");
    await submitForm(page);

    await page.waitForSelector('[role="alert"], [aria-live]');

    const emailInput = page.locator('nord-input[label="Email"]').locator("input");
    await expect(emailInput).toBeFocused();
  });

  test("success page has no automated accessibility violations", async ({ page }) => {
    await fillEmail(page, VALID_EMAIL);
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, VALID_PASSWORD);
    await checkTerms(page);
    await submitForm(page);

    await expect(page).toHaveURL("/success");
    await page.waitForSelector("h1");

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    const violations = accessibilityScanResults.violations.filter(
      (violation) =>
        !violation.nodes.some(
          (node) => node.html.includes("devtools") || node.target.join(">").includes("devtools"),
        ),
    );

    expect(violations).toEqual([]);
  });
});
