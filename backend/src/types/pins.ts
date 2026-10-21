import type { Database } from "./database.types.js";
export type Pin =Database["public"]["Tables"]["pins"]["Row"];
export type CreatePinInput =Omit<Pin, "id" | "creator_id">;
export type UpdatePinInput = Partial<CreatePinInput>;