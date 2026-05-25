import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PasswordStrengthChecklist from "~/components/PasswordStrengthChecklist.vue";

function makePasswordRules(overrides: Record<string, boolean> = {}) {
  const defaults: Record<string, { $valid: boolean }> = {
    minLength: { $valid: true },
    containsUppercase: { $valid: true },
    containsNumber: { $valid: true },
    containsSpecialCharacter: { $valid: true },
  };
  for (const [key, valid] of Object.entries(overrides)) {
    defaults[key] = { $valid: valid };
  }
  return defaults;
}

describe("PasswordStrengthChecklist", () => {
  it("renders all 4 rules", () => {
    const wrapper = mount(PasswordStrengthChecklist, {
      props: { passwordRules: makePasswordRules() },
    });

    expect(wrapper.text()).toContain("At least 8 characters");
    expect(wrapper.text()).toContain("Must contain an uppercase letter");
    expect(wrapper.text()).toContain("Must contain a number");
    expect(wrapper.text()).toContain("Must contain a special character");
  });

  it("renders 4 nord-icon elements", () => {
    const wrapper = mount(PasswordStrengthChecklist, {
      props: { passwordRules: makePasswordRules() },
    });

    expect(wrapper.findAll("nord-icon")).toHaveLength(4);
  });

  it("applies n:text-success class to rules marked as valid ", () => {
    const wrapper = mount(PasswordStrengthChecklist, {
      props: { passwordRules: makePasswordRules() },
    });

    const ruleContainers = wrapper.findAll("[role='status'] > div");
    for (const rule of ruleContainers) {
      expect(rule.classes()).toContain("n:text-success");
      expect(rule.classes()).not.toContain("n:text-error");
    }
  });

  it("applies n:text-error class to invalid rules and n:text-success to valid rules", () => {
    const wrapper = mount(PasswordStrengthChecklist, {
      props: {
        passwordRules: makePasswordRules({
          containsNumber: false,
          containsUppercase: false,
        }),
      },
    });

    const ruleContainers = wrapper.findAll("[role='status'] > div");

    const numberRule = ruleContainers.filter((el) => el.text().includes("Must contain a number"));
    expect(numberRule.length).toBe(1);
    expect(numberRule[0].classes()).toContain("n:text-error");

    const uppercaseRule = ruleContainers.filter((el) =>
      el.text().includes("Must contain an uppercase letter"),
    );
    expect(uppercaseRule.length).toBe(1);
    expect(uppercaseRule[0].classes()).toContain("n:text-error");

    const validRules = ruleContainers.filter(
      (el) =>
        !el.text().includes("Must contain a number") &&
        !el.text().includes("Must contain an uppercase letter"),
    );
    expect(validRules).toHaveLength(2);
    for (const rule of validRules) {
      expect(rule.classes()).toContain("n:text-success");
      expect(rule.classes()).not.toContain("n:text-error");
    }
  });
});
