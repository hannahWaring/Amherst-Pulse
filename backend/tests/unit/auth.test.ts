import { expect, test } from "@jest/globals";
import { usernameToEmail } from "../../src/lib/supabase.js";
import { env } from "../../src/config/env.js";

// TODO: figure out if we also want to do supabase mocking for unit tests.
// For now, we are just testing functions which don't interact with supabase here.

test("usernameToEmail handles empty string", () => {
  expect(usernameToEmail("")).toBe(`@${env.authEmailDomain}`);
});

test("usernameToEmail handles nonempty string", () => {
  expect(usernameToEmail("test")).toBe(`test@${env.authEmailDomain}`);
});
