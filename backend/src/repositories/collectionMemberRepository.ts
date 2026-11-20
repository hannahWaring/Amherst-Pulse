import { supabaseAdmin } from "../lib/supabase.js";
import type {
  CollectionMember,
  MemberListItem,
  MemberRole,
} from "../types/collectionMembers.js";

const TABLE = "collection_members";

export const collectionMembersRepository = {
  // Find a user's profile by exact username, or null if there is none
  async findProfileByUsername(
    username: string,
  ): Promise<{ id: string; username: string } | null> {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, username")
      .eq("username", username)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Get one member row of a collection, or null if the user is not a member
  async findMember(
    collectionId: string,
    userId: string,
  ): Promise<CollectionMember | null> {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("collection_id", collectionId)
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // List the members of a collection with their usernames (the owner is not a member)
  async findAllMembers(collectionId: string): Promise<MemberListItem[]> {
    const { data: members, error } = await supabaseAdmin
      .from(TABLE)
      .select("user_id, role, invited_by")
      .eq("collection_id", collectionId);
    if (error) throw error;
    if (!members || members.length === 0) {
      return [];
    }

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, username")
      .in(
        "id",
        members.map((member) => member.user_id),
      );
    if (profileError) throw profileError;

    const usernames = new Map(
      (profiles ?? []).map((profile) => [profile.id, profile.username]),
    );
    return members.map((member) => ({
      ...member,
      username: usernames.get(member.user_id) ?? null,
    }));
  },

  // Add a user to a collection
  async addMember(
    collectionId: string,
    userId: string,
    role: MemberRole,
    invitedBy: string,
  ): Promise<CollectionMember> {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({
        collection_id: collectionId,
        user_id: userId,
        role,
        invited_by: invitedBy,
      })
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },

  // Change a member's role
  async updateRole(
    collectionId: string,
    userId: string,
    role: MemberRole,
  ): Promise<CollectionMember> {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ role })
      .eq("collection_id", collectionId)
      .eq("user_id", userId)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },

  // Remove a member from a collection (their pins stay in the collection)
  async removeMember(collectionId: string, userId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(TABLE)
      .delete()
      .eq("collection_id", collectionId)
      .eq("user_id", userId);
    if (error) throw error;
  },
};
