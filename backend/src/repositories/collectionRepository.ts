import { randomUUID } from "crypto";
import { supabasePublic } from "../lib/supabase.js";
import type {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../types/collections.js";

const TABLE = "collections";

export const collectionsRepository = {
  async create(
    ownerId: string,
    input: CreateCollectionInput,
  ): Promise<Collection> {
    const { data, error } = await supabasePublic
      .from(TABLE)
      .insert({
        id: randomUUID(),
        owner_id: ownerId,
        ...input,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as Collection;
  },

  // Get all collections owned by a user.
  async findAllByOwner(ownerId: string): Promise<Collection[]> {
    const { data, error } = await supabasePublic
      .from(TABLE)
      .select("*")
      .eq("owner_id", ownerId);
    if (error) throw error;
    return (data ?? []) as Collection[];
  },

  // Get a collection by its ID.
  async findById(id: string): Promise<Collection | null> {
    const { data, error } = await supabasePublic
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data as Collection | null;
  },

  async update(id: string, input: UpdateCollectionInput): Promise<Collection> {
    const { data, error } = await supabasePublic
      .from(TABLE)
      .update(input)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data as Collection;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabasePublic.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};
