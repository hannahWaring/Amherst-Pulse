import { randomUUID } from "crypto";
import { supabase } from "../lib/supabase.js";
import type {Pin,CreatePinInput,UpdatePinInput } from "../types/pins.js";
const TABLE ="pins";

export const pinsRepository = {
  // Create a pin
  async create(creatorId: string,input: CreatePinInput): Promise<Pin> {
    const { data, error } = await supabase.from(TABLE).insert({
    id: randomUUID(),creator_id: creatorId,...input,}).select("*").single();
    if (error) throw error;
    return data as Pin;
  },
  //Get pin

  // Update a pin
  async update(id: string, input: UpdatePinInput): Promise<Pin> {
    const { data, error } = await supabase.from(TABLE).update(input).eq("id", id).select("*").single();
    if (error) throw error;
    return data as Pin;
  },
  // Delete a pin
  async delete(id: string): Promise<void> {
    const {error} = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },
};