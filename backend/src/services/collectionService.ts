//this is just a basic structure (same as pinService)
//does not authenticate if the one who wants to edit is the authorized
import {
  conflict,
  forbidden,
  notFound,
  unauthorized,
} from "../errors/AppError.js";
import { collectionsRepository } from "../repositories/collectionRepository.js";
import { pinsRepository } from "../repositories/pinRepository.js";
import {
  validateCreateCollection,
  validateUpdateCollection,
} from "../validators/collectionValidator.js";
import type {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../types/collections.js";

// Editors are members with the "collaborator" role (the database only allows "collaborator" or "viewer")
const EDITOR_ROLE = "collaborator";

// Owner or editor of the collection
async function canEditPins(
  collection: Collection,
  userId: string,
): Promise<boolean> {
  if (collection.owner_id === userId) {
    return true;
  }
  const role = await collectionsRepository.findMemberRole(
    collection.id,
    userId,
  );
  return role === EDITOR_ROLE;
}

export const collectionService = {
  // create a new collection
  async createCollection(ownerId: string, input: CreateCollectionInput) {
    validateCreateCollection(input);
    return await collectionsRepository.create(ownerId, input);
  },

  // get collections made by user
  async getCollectionsByOwner(ownerId: string) {
    return await collectionsRepository.findAllByOwner(ownerId);
  },

  // get collections shared with user
  async getCollectionsSharedWithUser(userId: string) {
    return await collectionsRepository.findAllSharedWithUser(userId);
  },

  // get all public collections
  async getPublicCollections() {
    return await collectionsRepository.findAllPublic();
  },

  // get a collection by its id: anyone can see a public one; a private one only its owner or a member
  async getCollectionById(id: string, userId?: string) {
    const collection = await collectionsRepository.findById(id);
    if (!collection) {
      throw notFound("Collection not found");
    }
    if (collection.visibility === "public") {
      return collection;
    }
    if (!userId) {
      throw unauthorized("Authentication required.");
    }
    if (collection.owner_id === userId) {
      return collection;
    }
    const role = await collectionsRepository.findMemberRole(id, userId);
    if (role === null) {
      throw forbidden("You do not have access to this collection");
    }
    return collection;
  },

  // update a collection (owner only)
  async updateCollection(
    userId: string,
    id: string,
    input: UpdateCollectionInput,
  ) {
    validateUpdateCollection(input);
    const existingCollection = await collectionsRepository.findById(id);
    if (!existingCollection) {
      throw notFound("Collection not found");
    }
    if (existingCollection.owner_id !== userId) {
      throw forbidden("Only the owner of this collection can do this");
    }
    return await collectionsRepository.update(id, input);
  },

  // delete a collection (owner only)
  async deleteCollection(userId: string, id: string) {
    const existingCollection = await collectionsRepository.findById(id);
    if (!existingCollection) {
      throw notFound("Collection not found");
    }
    if (existingCollection.owner_id !== userId) {
      throw forbidden("Only the owner of this collection can do this");
    }
    await collectionsRepository.delete(id);
  },

  // add a pin to a collection (only the owner or an editor)
  async addPinToCollection(
    collectionId: string,
    pinId: string,
    userId: string,
  ) {
    const collection = await collectionsRepository.findById(collectionId);
    if (!collection) {
      throw notFound("Collection not found");
    }
    if (!(await canEditPins(collection, userId))) {
      throw forbidden(
        "Only the owner or an editor of this collection can do this",
      );
    }
    const pin = await pinsRepository.findById(pinId);
    if (!pin) {
      throw notFound("Pin not found");
    }
    const existing = await collectionsRepository.findCollectionPin(
      collectionId,
      pinId,
    );
    if (existing) {
      throw conflict("Pin is already in this collection");
    }
    return await collectionsRepository.addPin(collectionId, pinId, userId);
  },

  // remove a pin from a collection (only the owner or an editor); the pin itself is not deleted
  async removePinFromCollection(
    collectionId: string,
    pinId: string,
    userId: string,
  ) {
    const collection = await collectionsRepository.findById(collectionId);
    if (!collection) {
      throw notFound("Collection not found");
    }
    if (!(await canEditPins(collection, userId))) {
      throw forbidden(
        "Only the owner or an editor of this collection can do this",
      );
    }
    const existing = await collectionsRepository.findCollectionPin(
      collectionId,
      pinId,
    );
    if (!existing) {
      throw notFound("Pin is not in this collection");
    }
    await collectionsRepository.removePin(collectionId, pinId);
  },
};
