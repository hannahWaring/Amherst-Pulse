import { jest, describe, test, expect, beforeEach } from "@jest/globals"; // will be resolved after kahn's merge

type AnyFn = (...args: any[]) => any;

// Fake query builder: every chain step returns the builder itself,
// except single/maybeSingle, which each test resolves to { data, error }.
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

// Register the mock BEFORE importing the code under test.
jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  supabasePublic: { from },
  supabaseAdmin: {},
  usernameToEmail: jest.fn(),
}));

const { collectionsRepository } = await import(
  "../../src/repositories/collectionRepository.js"
);

const dbError = { message: "boom", code: "XX000" };

describe("collectionsRepository", () => {
  beforeEach(() => {
    // resetAllMocks also clears queued *Once values, then we rebuild the chain.
    jest.resetAllMocks();
    from.mockReturnValue(builder);
    builder.insert.mockReturnValue(builder);
    builder.select.mockReturnValue(builder);
    builder.update.mockReturnValue(builder);
    builder.delete.mockReturnValue(builder);
    builder.eq.mockReturnValue(builder);
  });

  describe("create", () => {
    test("inserts with a generated id and owner_id, returns the row", async () => {
      const input = { name: "Trip" } as any;
      const row = { id: "c1", owner_id: "u1", name: "Trip" };
      single.mockResolvedValue({ data: row, error: null });

      await expect(collectionsRepository.create("u1", input)).resolves.toEqual(row);

      expect(from).toHaveBeenCalledWith("collections");
      expect(builder.insert).toHaveBeenCalledWith({
        id: expect.any(String),
        owner_id: "u1",
        name: "Trip",
      });
      expect(builder.select).toHaveBeenCalledWith("*");
      expect(single).toHaveBeenCalledTimes(1);
    });

    test("throws the Supabase error", async () => {
      single.mockResolvedValue({ data: null, error: dbError });
      await expect(
        collectionsRepository.create("u1", { name: "Trip" } as any)
      ).rejects.toBe(dbError);
    });

    // Documents current behaviour (input is spread after id/owner_id).
    // Confirm with Sunny whether this is intended.
    test("an id or owner_id inside input overrides the generated values", async () => {
      single.mockResolvedValue({ data: {}, error: null });
      await collectionsRepository.create("u1", { id: "mine", owner_id: "other" } as any);
      expect(builder.insert).toHaveBeenCalledWith(
        expect.objectContaining({ id: "mine", owner_id: "other" })
      );
    });
  });

  describe("findAllByOwner", () => {
    test("returns the rows for that owner", async () => {
      const rows = [{ id: "c1" }, { id: "c2" }];
      builder.eq.mockResolvedValueOnce({ data: rows, error: null });

      await expect(collectionsRepository.findAllByOwner("u1")).resolves.toEqual(rows);

      expect(from).toHaveBeenCalledWith("collections");
      expect(builder.select).toHaveBeenCalledWith("*");
      expect(builder.eq).toHaveBeenCalledWith("owner_id", "u1");
    });

    test("returns [] when data is null", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: null });
      await expect(collectionsRepository.findAllByOwner("u1")).resolves.toEqual([]);
    });

    test("throws the Supabase error", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: dbError });
      await expect(collectionsRepository.findAllByOwner("u1")).rejects.toBe(dbError);
    });
  });

  describe("findById", () => {
    test("returns the row", async () => {
      const row = { id: "c1" };
      maybeSingle.mockResolvedValue({ data: row, error: null });

      await expect(collectionsRepository.findById("c1")).resolves.toEqual(row);

      expect(from).toHaveBeenCalledWith("collections");
      expect(builder.select).toHaveBeenCalledWith("*");
      expect(builder.eq).toHaveBeenCalledWith("id", "c1");
      expect(maybeSingle).toHaveBeenCalledTimes(1);
    });

    test("returns null when nothing matches", async () => {
      maybeSingle.mockResolvedValue({ data: null, error: null });
      await expect(collectionsRepository.findById("missing")).resolves.toBeNull();
    });

    test("throws the Supabase error", async () => {
      maybeSingle.mockResolvedValue({ data: null, error: dbError });
      await expect(collectionsRepository.findById("c1")).rejects.toBe(dbError);
    });
  });

  describe("update", () => {
    test("updates by id and returns the updated row", async () => {
      const input = { name: "Renamed" } as any;
      const row = { id: "c1", name: "Renamed" };
      single.mockResolvedValue({ data: row, error: null });

      await expect(collectionsRepository.update("c1", input)).resolves.toEqual(row);

      expect(from).toHaveBeenCalledWith("collections");
      expect(builder.update).toHaveBeenCalledWith(input);
      expect(builder.eq).toHaveBeenCalledWith("id", "c1");
      expect(builder.select).toHaveBeenCalledWith("*");
      expect(single).toHaveBeenCalledTimes(1);
    });

    // Unlike findById: .single() errors on zero rows, so a missing id throws.
    test("throws when the id does not exist", async () => {
      const notFound = { message: "JSON object requested, multiple (or no) rows returned", code: "PGRST116" };
      single.mockResolvedValue({ data: null, error: notFound });
      await expect(
        collectionsRepository.update("missing", { name: "x" } as any)
      ).rejects.toBe(notFound);
    });
  });

  describe("delete", () => {
    test("deletes by id and resolves to undefined", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: null });

      await expect(collectionsRepository.delete("c1")).resolves.toBeUndefined();

      expect(from).toHaveBeenCalledWith("collections");
      expect(builder.delete).toHaveBeenCalledTimes(1);
      expect(builder.eq).toHaveBeenCalledWith("id", "c1");
    });

    test("does not throw when the id does not exist", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: null });
      await expect(collectionsRepository.delete("missing")).resolves.toBeUndefined();
    });

    test("throws the Supabase error", async () => {
      builder.eq.mockResolvedValueOnce({ data: null, error: dbError });
      await expect(collectionsRepository.delete("c1")).rejects.toBe(dbError);
    });
  });
});