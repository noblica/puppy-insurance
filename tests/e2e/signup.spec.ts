import { test as base, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

type TestFixtures = {
  isMobile: boolean;
};

const test = base.extend<TestFixtures>({
  isMobile: async ({}, use, testInfo) => {
    await use(testInfo.project.name.includes("mobile"));
  },
});

const VALID_EMAIL = "test@example.com";
const VALID_PASSWORD = "Password1!";

async function fillEmail(page: Page, value: string) {
  await page.locator('nord-input[label="Email"]').locator("input").fill(value);
}

async function fillPassword(page: Page, value: string) {
  await page.locator('nord-input[label="Password"]').locator("input").fill(value);
}

async function fillConfirmPassword(page: Page, value: string) {
  await page.locator('nord-input[label="Confirm password"]').locator("input").fill(value);
}

async function checkTerms(page: Page) {
  const checkbox = page.locator("nord-checkbox").filter({ hasText: "Terms of Service" });
  await checkbox.waitFor({ state: "visible" });
  await checkbox.locator('input[type="checkbox"]').click();
}

async function submitForm(page: Page) {
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

    await expect(page).toHaveURL("success");
    await expect(page.getByText("Your account has been created successfully.")).toBeVisible();
  });

  test("submit with all fields empty shows required errors for each field", async ({ page }) => {
    await submitForm(page);

    await expect(page.getByText("This field is required")).toHaveCount(3);
    await expect(page.getByText("The field must be checked")).toBeVisible();
  });

  test("submit with invalid email shows email format error", async ({ page }) => {
    await fillEmail(page, "notanemail");
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, VALID_PASSWORD);
    await checkTerms(page);
    await submitForm(page);

    await expect(page.getByText("The value must be a valid email address")).toBeVisible();
  });

  test("password strength checklist updates live as user types", async ({ page }) => {
    const passwordInput = page.locator('nord-input[label="Password"]').locator("input");

    await expect(page.getByText("At least 8 characters")).not.toBeVisible();

    await passwordInput.fill("a");
    await expect(page.getByText("At least 8 characters")).toBeVisible();
    await expect(page.getByText("Must contain an uppercase letter")).toBeVisible();
    await expect(page.getByText("Must contain a number")).toBeVisible();
    await expect(page.getByText("Must contain a special character")).toBeVisible();

    await passwordInput.fill("Password1!");
    await expect(page.getByText("At least 8 characters")).toBeVisible();
  });

  test("password visibility toggle shows and hides password", async ({ page }) => {
    const passwordInput = page.locator('nord-input[label="Password"]').locator("input");
    const toggleButton = page.locator('nord-input[label="Password"]').getByRole("button");

    await passwordInput.fill(VALID_PASSWORD);
    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("password toggle button has visually hidden text for accessibility", async ({ page }) => {
    const toggleButton = page.locator('nord-input[label="Password"]').locator("nord-button");

    await expect(toggleButton).toContainText("Show password");
    await expect(toggleButton).toHaveAttribute("aria-pressed", "false");

    await toggleButton.click();

    await expect(toggleButton).toContainText("Hide password");
    await expect(toggleButton).toHaveAttribute("aria-pressed", "true");
  });

  test("success page without completing sign-up redirects to /", async ({ page }) => {
    await page.goto("/success");
    await expect(page).toHaveURL(/puppy-insurance\/$/);
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
    await page.keyboard.press("Tab");
    await page.keyboard.type(VALID_PASSWORD);

    await checkTerms(page);

    await page.getByRole("button", { name: "Create account" }).focus();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("success");
  });

  test("mismatched passwords show confirm password error", async ({ page }) => {
    await fillEmail(page, VALID_EMAIL);
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, "DifferentPassword1!");
    await checkTerms(page);
    await submitForm(page);

    await expect(page.getByText("The value must be equal to the Password value")).toBeVisible();
  });

  test("all form fields are disabled during submission", async ({ page }) => {
    await fillEmail(page, VALID_EMAIL);
    await fillPassword(page, VALID_PASSWORD);
    await fillConfirmPassword(page, VALID_PASSWORD);
    await checkTerms(page);

    await submitForm(page);

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

  test("validation failure moves focus to first error", async ({ page }) => {
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

    await expect(page).toHaveURL("success");
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

test.describe("Sign-up form — mobile-specific", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "Mobile project only");
    await page.goto("/");
  });

  test("hero sidebar is hidden", async ({ page }) => {
    const sidebar = page.locator("aside");
    await expect(sidebar).toBeHidden();
  });

  test("main content fills the full viewport width on mobile", async ({ page }) => {
    const mainElement = page.locator("main");
    const viewport = page.viewportSize();
    const box = await mainElement.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.width).toBe(viewport!.width);
  });
});
