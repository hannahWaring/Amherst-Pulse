import { jest, describe, test, expect, beforeEach } from "@jest/globals";

type AnyFn = (...args: any[]) => any;

const single = jest.fn<AnyFn>();
const maybeSingle = jest.fn<AnyFn>();
const builder = {
  insert: jest.fn<AnyFn>(),
  select: jest.fn<AnyFn>(),
  update: jest.fn<AnyFn>(),
  delete: jest.fn<AnyFn>(),
  eq: jest.fn<AnyFn>(),
  single,
  maybeSingle,
};
const from = jest.fn<AnyFn>();

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  supabasePublic: { from },
  supabaseAdmin: {},
  usernameToEmail: jest.fn(),
}));

const { pinsRepository } = await import("../../src/repositories/pinRepository.js");

const dbError = { message: "boom", code: "XX000" };

describe("pinsRepository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    from.mockReturnValue(builder);
    builder.insert.mockReturnValue(builder);
    builder.select.mockReturnValue(builder);
    builder.update.mockReturnValue(builder);
    builder.delete.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
  });

  describe("create", () => {
    test("inserts with a generated id and creator, returns the pin", async () => {
      const input = { title: "Coffee spot" } as any;
      const row = { id: "p1", creator_id: "u1", title: "Coffee spot" };
      single.mockResolvedValue({ data: row, error: null });

      await expect(pinsRepository.create("u1", input)).resolves.toEqual(row);

      expect(from).toHaveBeenCalledWith("pins");
      expect(builder.insert).toHaveBeenCalledWith({
        id: expect.any(String),
        creator_id: "u1",
        title: "Coffee spot",
      });
      expect(builder.select).toHaveBeenCalledWith("*");
      expect(single).toHaveBeenCalledTimes(1);
    });

    test("throws the Supabase error", async () => {
      single.mockResolvedValue({ data: null, error: dbError });
      await expect(
        pinsRepository.create("u1", { title: "x" } as any)
      ).rejects.toBe(dbError);
    });
  });

  describe("findAllByCollection", () => {
    test("queries the join table and unwraps .pins, dropping nulls", async () => {
      const pinA = { id: "p1" };
      const pinB = { id: "p2" };
      builder.eq.mockResolvedValueOnce({
        data: [{ pins: pinA }, { pins: null }, { pins: pinB }],
        error: null,
      });

      await expect(pinsRepository.findAllByCollection("c1")).resolves.toEqual([pinA, pinB]);

      expect(from).toHaveBeenCalledWith("collection_pins");
      expect(builder.select).toHaveBeenCalledWith("pins(*)");
      expect(builder.eq).toHaveBeenCalledWith("collection_id", "c1");
    });

    test("returns [] when data is null", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: null });
      await expect(pinsRepository.findAllByCollection("c1")).resolves.toEqual([]);
    });

    test("throws the Supabase error", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: dbError });
      await expect(pinsRepository.findAllByCollection("c1")).rejects.toBe(dbError);
    });
  });

  describe("findById", () => {
    test("returns the pin", async () => {
      const row = { id: "p1" };
      maybeSingle.mockResolvedValue({ data: row, error: null });

      await expect(pinsRepository.findById("p1")).resolves.toEqual(row);

      expect(from).toHaveBeenCalledWith("pins");
      expect(builder.eq).toHaveBeenCalledWith("id", "p1");
    });

    test("returns null when nothing matches", async () => {
      maybeSingle.mockResolvedValue({ data: null, error: null });
      await expect(pinsRepository.findById("missing")).resolves.toBeNull();
    });

    test("throws the Supabase error", async () => {
      maybeSingle.mockResolvedValue({ data: null, error: dbError });
      await expect(pinsRepository.findById("p1")).rejects.toBe(dbError);
    });
  });

  describe("update", () => {
    test("updates by id and returns the updated pin", async () => {
      const input = { title: "Renamed" } as any;
      const row = { id: "p1", title: "Renamed" };
      single.mockResolvedValue({ data: row, error: null });

      await expect(pinsRepository.update("p1", input)).resolves.toEqual(row);

      expect(from).toHaveBeenCalledWith("pins");
      expect(builder.update).toHaveBeenCalledWith(input);
      expect(builder.eq).toHaveBeenCalledWith("id", "p1");
    });

    test("throws when the id does not exist", async () => {
      const notFound = { message: "no rows", code: "PGRST116" };
      single.mockResolvedValue({ data: null, error: notFound });
      await expect(
        pinsRepository.update("missing", { title: "x" } as any)
      ).rejects.toBe(notFound);
    });
  });

  describe("delete", () => {
    test("deletes by id and resolves to undefined", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: null });

      await expect(pinsRepository.delete("p1")).resolves.toBeUndefined();

      expect(from).toHaveBeenCalledWith("pins");
      expect(builder.delete).toHaveBeenCalledTimes(1);
      expect(builder.eq).toHaveBeenCalledWith("id", "p1");
    });

    // The real FK failure (pin still in a collection) needs an integration test;
    // here we only check that such an error is passed through.
    test("throws a foreign-key error from Supabase", async () => {
      const fkError = { message: "violates foreign key constraint", code: "23503" };
      builder.eq.mockResolvedValueOnce({ data: null, error: fkError });
      await expect(pinsRepository.delete("p1")).rejects.toBe(fkError);
    });
  });
});