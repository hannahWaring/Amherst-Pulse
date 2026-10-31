
import { jest, describe, test, expect, beforeEach } from "@jest/globals";

type AnyFn = (...args: any[]) => any;

const single = jest.fn<AnyFn>();

const builder = {
  update: jest.fn<AnyFn>(),
  eq: jest.fn<AnyFn>(),
  select: jest.fn<AnyFn>(),
  single,
};

const from = jest.fn<AnyFn>();

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  supabasePublic: { from },
  supabaseAdmin: {},
  usernameToEmail: jest.fn(),
}));

const { collectionsRepository } = await import(
  "../../src/repositories/collectionRepository.js"
);

describe("Collection Permissions", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    from.mockReturnValue(builder);
    builder.update.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
    builder.select.mockReturnValue(builder);
  });

  test("updates collection visibility", async () => {
    const input = {
      visibility: "public",
    };

    const updatedCollection = {
      id: "c1",
      owner_id: "u1",
      title: "My Collection",
      visibility: "public",
      viewer_can_add_pins: false,
    };

    single.mockResolvedValue({
      data: updatedCollection,
      error: null,
    });

    const result = await collectionsRepository.update(
      "c1",
      input
    );

    expect(from).toHaveBeenCalledWith("collections");
    expect(builder.update).toHaveBeenCalledWith(input);
    expect(builder.eq).toHaveBeenCalledWith("id", "c1");

    expect(result.visibility).toBe("public");
  });

  test("updates viewer permission to add pins", async () => {
    const input = {
      viewer_can_add_pins: true,
    };

    const updatedCollection = {
      id: "c1",
      owner_id: "u1",
      title: "My Collection",
      visibility: "private",
      viewer_can_add_pins: true,
    };

    single.mockResolvedValue({
      data: updatedCollection,
      error: null,
    });

    const result = await collectionsRepository.update(
      "c1",
      input
    );

    expect(builder.update).toHaveBeenCalledWith({
      viewer_can_add_pins: true,
    });

    expect(result.viewer_can_add_pins).toBe(true);
  });

  test("updates multiple permissions together", async () => {
    const input = {
      visibility: "public",
      viewer_can_add_pins: true,
    };

    const updatedCollection = {
      id: "c1",
      owner_id: "u1",
      title: "Events",
      ...input,
    };

    single.mockResolvedValue({
      data: updatedCollection,
      error: null,
    });

    const result = await collectionsRepository.update(
      "c1",
      input
    );

    expect(builder.update).toHaveBeenCalledWith(input);
    expect(builder.eq).toHaveBeenCalledWith("id", "c1");
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(single).toHaveBeenCalledTimes(1);

    expect(result).toEqual(updatedCollection);
  });

  test("throws error when permission update fails", async () => {
    const dbError = {
      message: "Permission update failed",
      code: "XX000",
    };

    single.mockResolvedValue({
      data: null,
      error: dbError,
    });

    await expect(
      collectionsRepository.update("c1", {
        viewer_can_add_pins: true,
      })
    ).rejects.toBe(dbError);
  });

  test("throws error when collection does not exist", async () => {
    const notFound = {
      message: "No rows found",
      code: "PGRST116",
    };

    single.mockResolvedValue({
      data: null,
      error: notFound,
    });

    await expect(
      collectionsRepository.update("missing", {
        visibility: "public",
      })
    ).rejects.toBe(notFound);
  });
});
