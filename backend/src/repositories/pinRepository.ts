import { randomUUID } from "crypto";
import { supabaseAdmin } from "../lib/supabase.js";
import type {Pin,CreatePinInput,UpdatePinInput } from "../types/pins.js";
const TABLE ="pins";

export const pinsRepository = {
  async create(creatorId: string,input: CreatePinInput): Promise<Pin> {
    const { data, error } = await supabaseAdmin.from(TABLE).insert({
    id: randomUUID(),creator_id: creatorId,...input,}).select("*").single();
    if (error) throw error;
    return data as Pin;
  },
  //Get pin by collections
  async findAllByCollection(collectionId: string): Promise<Pin[]> {
    const { data, error } = await supabaseAdmin.from("collection_pins").select("pins(*)").eq("collection_id", collectionId);
    if (error) {
      throw error;
    }
    // Extract the pin data
    const rows = data ?? [];
    const pins = rows.map((row) => row.pins);
    const validPins = pins.filter((pin) => pin !== null);
    return validPins as Pin[];
  },
  //do we need get pin by users? 

  // Get a pin by its ID.
  async findById(id: string): Promise<Pin | null> {
    const { data, error } = await supabaseAdmin.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data as Pin | null;
  },

  async update(id: string, input: UpdatePinInput): Promise<Pin> {
    const { data, error } = await supabaseAdmin.from(TABLE).update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data as Pin;
  },

  async delete(id: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("pins")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw error;
  return data.length > 0;
}
}