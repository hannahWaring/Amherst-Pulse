import { badRequest, conflict, forbidden, notFound } from "../errors/AppError.js";
import { collectionsRepository } from "../repositories/collectionRepository.js";
import { collectionMembersRepository } from "../repositories/collectionMemberRepository.js";
import {
  validateAddMember,
  validateUpdateMemberRole,
} from "../validators/collectionMemberValidator.js";
import type {
  AddMemberInput,
  UpdateMemberRoleInput,
} from "../types/collectionMembers.js";

// Only the owner can manage members. Returns the collection if the user owns it.
async function getCollectionAsOwner(collectionId: string, userId: string) {
  const collection = await collectionsRepository.findById(collectionId);
  if (!collection) {
    throw notFound("Collection not found");
  }
  if (collection.owner_id !== userId) {
    throw forbidden("Only the owner of this collection can do this");
  }
  return collection;
}

export const collectionMemberService = {
  // list the members of a collection (owner only)
  async listMembers(collectionId: string, userId: string) {
    await getCollectionAsOwner(collectionId, userId);
    return await collectionMembersRepository.findAllMembers(collectionId);
  },

  // add a user (by username) to a collection as a collaborator or viewer (owner only)
  async addMember(collectionId: string, userId: string, input: AddMemberInput) {
    validateAddMember(input);
    const collection = await getCollectionAsOwner(collectionId, userId);

    const username = input.username.trim();
    const profile =
      await collectionMembersRepository.findProfileByUsername(username);
    if (!profile) {
      throw notFound(`User "${username}" not found`);
    }
    if (profile.id === collection.owner_id) {
      throw conflict("The owner already has access to this collection");
    }
    const existing = await collectionMembersRepository.findMember(
      collectionId,
      profile.id,
    );
    if (existing) {
      throw conflict("User is already a member of this collection");
    }
    return await collectionMembersRepository.addMember(
      collectionId,
      profile.id,
      input.role,
      userId,
    );
  },

  // change a member's role (owner only)
  async updateMemberRole(
    collectionId: string,
    userId: string,
    memberId: string,
    input: UpdateMemberRoleInput,
  ) {
    validateUpdateMemberRole(input);
    const collection = await getCollectionAsOwner(collectionId, userId);
    if (memberId === collection.owner_id) {
      throw badRequest("The owner's role cannot be changed");
    }
    const existing = await collectionMembersRepository.findMember(
      collectionId,
      memberId,
    );
    if (!existing) {
      throw notFound("User is not a member of this collection");
    }
    return await collectionMembersRepository.updateRole(
      collectionId,
      memberId,
      input.role,
    );
  },

  // remove a member from a collection (owner only); pins they added stay
  async removeMember(collectionId: string, userId: string, memberId: string) {
    const collection = await getCollectionAsOwner(collectionId, userId);
    if (memberId === collection.owner_id) {
      throw badRequest("The owner cannot be removed");
    }
    const existing = await collectionMembersRepository.findMember(
      collectionId,
      memberId,
    );
    if (!existing) {
      throw notFound("User is not a member of this collection");
    }
    await collectionMembersRepository.removeMember(collectionId, memberId);
  },
};
