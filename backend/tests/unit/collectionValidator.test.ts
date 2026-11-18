import { describe, expect, test } from "@jest/globals";
import {
  validateCreateCollection,
  validateUpdateCollection,
} from "../../src/validators/collectionValidator.js";

describe("validateCreateCollection", () => {
  test("valid collection data passes validation", () => {
    const collectionData = {
      title: "My Collection",
      description: "A test collection",
      visibility: "public",
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).not.toThrowError();
  });

  test("no unknown fields are allowed", () => {
    const collectionData = {
      title: "My Collection",
      description: "A test collection",
      visibility: "public",
      unknownField: "not allowed",
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("title is required", () => {
    const collectionData = {
      description: "A test collection",
      visibility: "public",
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("title must be a non-empty string", () => {
    const collectionData = {
      title: "",
      description: "A test collection",
      visibility: "public",
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("description is optional", () => {
    const collectionData = {
      title: "My Collection",
      visibility: "public",
      description: null,
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).not.toThrowError();
  });

  test("visibility must be 'public' or 'private'", () => {
    const collectionData = {
      title: "My Collection",
      description: "A test collection",
      visibility: "invalid_visibility",
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("visibility is required", () => {
    const collectionData = {
      title: "My Collection",
      description: "A test collection",
    };

    expect(() =>
      validateCreateCollection(
        collectionData as Parameters<typeof validateCreateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });
});

describe("validateUpdateCollection)", () => {
  test("valid update data passes validation", () => {
    const updateData = {
      title: "Updated Collection",
      description: "An updated test collection",
      visibility: "private",
    };

    expect(() =>
      validateUpdateCollection(
        updateData as Parameters<typeof validateUpdateCollection>[0],
      ),
    ).not.toThrowError();
  });

  test("no unknown fields are allowed", () => {
    const updateData = {
      title: "Updated Collection",
      description: "An updated test collection",
      visibility: "private",
      unknownField: "not allowed",
    };

    expect(() =>
      validateUpdateCollection(
        updateData as Parameters<typeof validateUpdateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("title must be a string", () => {
    const updateData = {
      title: false,
      description: "An updated test collection",
      visibility: "private",
    };

    expect(() =>
      validateUpdateCollection(
        updateData as Parameters<typeof validateUpdateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("visibility must be 'public' or 'private'", () => {
    const updateData = {
      title: "Updated Collection",
      description: "An updated test collection",
      visibility: "invalid",
    };

    expect(() =>
      validateUpdateCollection(
        updateData as Parameters<typeof validateUpdateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });

  test("description can be null", () => {
    const updateData = {
      title: "Updated Collection",
      description: null,
      visibility: "private",
    };

    expect(() =>
      validateUpdateCollection(
        updateData as Parameters<typeof validateUpdateCollection>[0],
      ),
    ).not.toThrowError();
  });
  test("description must be string or null", () => {
    const updateData = {
      title: "Updated Collection",
      description: 1234567,
      visibility: "private",
    };

    expect(() =>
      validateUpdateCollection(
        updateData as Parameters<typeof validateUpdateCollection>[0],
      ),
    ).toThrowError("Invalid collection input.");
  });
});
