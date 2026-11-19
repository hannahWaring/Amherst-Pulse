import { describe, expect, test } from "@jest/globals";
import {
  validateCreatePin,
  validateUpdatePin,
} from "../../src/validators/pinValidator.js";

describe("validateCreatePin", () => {
  test("succeeds for valid input", () => {
    const pinData = {
      title: "SEL Library",
      description: "Valid pin name",
      latitude: 42.31,
      longitude: -72.55,
      starts_at: "2024-01-01T00:00:00Z",
      ends_at: "2024-01-02T00:00:00Z",
    };

    expect(() =>
      validateCreatePin(pinData as Parameters<typeof validateCreatePin>[0]),
    ).not.toThrowError();
  });

  test("fails for empty title", () => {
    const pinData = {
      title: "",
      description: "A sample pin",
    };

    expect(() =>
      validateCreatePin(pinData as Parameters<typeof validateCreatePin>[0]),
    ).toThrowError("Invalid pin input.");
  });

  test("fails when latitude outside valid range", () => {
    const pinData = {
      title: "valid title",
      description: "Test pin",
      latitude: 43,
      longitude: -72.55,
    };

    expect(() =>
      validateCreatePin(pinData as Parameters<typeof validateCreatePin>[0]),
    ).toThrowError("Invalid pin input.");
  });

  test("fails when longitude outside valid range", () => {
    const pinData = {
      title: "valid title",
      description: "Test pin",
      latitude: 42.31,
      longitude: -72.7,
    };

    expect(() =>
      validateCreatePin(pinData as Parameters<typeof validateCreatePin>[0]),
    ).toThrowError("Invalid pin input.");
  });

  test("fails when ends_at is before starts_at", () => {
    const pinData = {
      title: "valid title",
      description: "Test pin",
      starts_at: "2024-01-02T00:00:00Z",
      ends_at: "2024-01-01T00:00:00Z",
    };

    expect(() =>
      validateCreatePin(pinData as Parameters<typeof validateCreatePin>[0]),
    ).toThrowError("Invalid pin input.");
  });
});

// Note: I would add more tests, but validateUpdatePin and validateCreatePin currently share the same rules.
// I assume this could change later, in which case we should change these tests.
describe("validateUpdatePin", () => {
  test("succeeds for valid input", () => {
    const pinData = {
      title: "SEL Library",
      description: "Valid pin name",
      latitude: 42.31,
      longitude: -72.55,
      starts_at: "2024-01-01T00:00:00Z",
      ends_at: "2024-01-02T00:00:00Z",
    };

    expect(() =>
      validateUpdatePin(pinData as Parameters<typeof validateUpdatePin>[0]),
    ).not.toThrowError();
  });
});
