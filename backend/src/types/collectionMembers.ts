import type { Database } from "./database.types.js";

export type CollectionMember =
  Database["public"]["Tables"]["collection_members"]["Row"];

// The database only allows these two roles (the owner is not a member).
export type MemberRole = "collaborator" | "viewer";

export type AddMemberInput = { username: string; role: MemberRole };
export type UpdateMemberRoleInput = { role: MemberRole };

// One row of the member list: the member's role plus their username.
export type MemberListItem = {
  user_id: string;
  username: string | null;
  role: string;
  invited_by: string | null;
};
