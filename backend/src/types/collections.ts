import type { Database } from "./database.types.js";
export type Collection =Database["public"]["Tables"]["collections"]["Row"];
export type CreateCollectionInput =Omit<Collection, "id" | "owner_id">;
export type UpdateCollectionInput = Partial<CreateCollectionInput>;export type CollectionPin = Database["public"]["Tables"]["collection_pins"]["Row"];
