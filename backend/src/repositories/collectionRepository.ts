import { randomUUID } from "crypto";
import { supabasePublic } from "../lib/supabase.js";
import type {
  Collection,
  CollectionPin,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../types/collections.js";

const TABLE = "collections";

// create a new collection
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

  // Get all collections owned by a user
  async findAllByOwner(ownerId: string): Promise<Collection[]> {
    const { data, error } = await supabasePublic
      .from(TABLE)
      .select("*")
      .eq("owner_id", ownerId);
    if (error) throw error;
    return (data ?? []) as Collection[];
  },

  // Get all collections shared with a user (they (the user) is in collection_members)
  async findAllSharedWithUser(userId: string): Promise<Collection[]> {
    const { data, error } = await supabasePublic.from("collection_members").select("collections(*)").eq("user_id", userId);
    if (error) throw error;
    // Each row is { collections: {...} }; extract the collection data
    const rows = data ?? [];
    const collections = rows.map((row) => row.collections);
    const validCollections = collections.filter((collection) => collection !== null);
    return validCollections as Collection[];
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

  // update a collection- change any one of the collection fields
  async update(
    id: string,
    input: UpdateCollectionInput
  ): Promise<Collection> {
    const { data, error } = await supabasePublic.from(TABLE)
      .update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data as Collection;
  },

  // delete a collection
  async delete(id: string): Promise<void> {
    const { error } = await supabasePublic.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },

  // Get a user's role in a collection ("collaborator" or "viewer"), or null if they are not a member
  async findMemberRole(collectionId: string, userId: string): Promise<string | null> {
    const { data, error } = await supabasePublic.from("collection_members").select("role")
      .eq("collection_id", collectionId).eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data?.role ?? null;
  },

  // Get the collection_pins row for a pin in a collection, or null if the pin is not in it
  async findCollectionPin(collectionId: string, pinId: string): Promise<CollectionPin | null> {
    const { data, error } = await supabasePublic.from("collection_pins").select("*")
      .eq("collection_id", collectionId).eq("pin_id", pinId).maybeSingle();
    if (error) throw error;
    return data as CollectionPin | null;
  },

  // Add a pin to a collection
  async addPin(collectionId: string, pinId: string, addedBy: string): Promise<CollectionPin> {
    const { data, error } = await supabasePublic.from("collection_pins")
      .insert({ collection_id: collectionId, pin_id: pinId, added_by: addedBy })
      .select("*").single();
    if (error) throw error;
    return data as CollectionPin;
  },

  // Remove a pin from a collection (the pin itself is not deleted)
  async removePin(collectionId: string, pinId: string): Promise<void> {
    const { error } = await supabasePublic.from("collection_pins").delete()
      .eq("collection_id", collectionId).eq("pin_id", pinId);
    if (error) throw error;
  },
};
