import { getErrorMessage } from "../src/utils/apiError";

describe("getErrorMessage", () => {
  test("uses response.data.message when present", () => {
    const err = { response: { data: { message: "Invalid credentials" } } };
    expect(getErrorMessage(err)).toBe("Invalid credentials");
  });

  test("uses response.data.error when present", () => {
    const err = { response: { data: { error: "Email already exists" } } };
    expect(getErrorMessage(err)).toBe("Email already exists");
  });

  test("uses first Zod issue message when present", () => {
    const err = { response: { data: { issues: [{ message: "Password too short" }] } } };
    expect(getErrorMessage(err)).toBe("Password too short");
  });

  test("falls back to err.message", () => {
    const err = { message: "Network Error" };
    expect(getErrorMessage(err)).toBe("Network Error");
  });

  test("falls back to generic message", () => {
    expect(getErrorMessage({})).toBe("Something went wrong");
  });
});
