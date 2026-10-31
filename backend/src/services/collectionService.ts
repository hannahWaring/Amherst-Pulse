//this is just a basic structure (same as pinService)
//does not authenticate if the one who wants to edit is the authorized
import { collectionsRepository } from "../repositories/collectionRepository.js";
import { pinsRepository } from "../repositories/pinRepository.js";
import type {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../types/collections.js";

export const COLLECTION_NOT_FOUND = "Collection not found";
export const PIN_NOT_FOUND = "Pin not found";
export const PIN_NOT_IN_COLLECTION = "Pin is not in this collection";
export const PIN_ALREADY_IN_COLLECTION = "Pin is already in this collection";
export const NOT_OWNER_OR_EDITOR = "Only the owner or an editor of this collection can do this";

// Editors are members with the "collaborator" role (the database only allows "collaborator" or "viewer")
const EDITOR_ROLE = "collaborator";

// Owner or editor of the collection
async function canEditPins(collection: Collection, userId: string): Promise<boolean> {
  if (collection.owner_id === userId) {
    return true;
  }
  const role = await collectionsRepository.findMemberRole(collection.id, userId);
  return role === EDITOR_ROLE;
}

export const collectionService = {
  // create a new collection
  async createCollection(ownerId: string, input: CreateCollectionInput) {
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

  // get a collection by its id
  async getCollectionById(id: string) {
    const collection = await collectionsRepository.findById(id);
    if (!collection) {
      throw new Error(COLLECTION_NOT_FOUND);
    }
    return collection;
  },

  // update a collection
  async updateCollection(id: string, input: UpdateCollectionInput) {
    const existingCollection = await collectionsRepository.findById(id);
    if (!existingCollection) {
      throw new Error(COLLECTION_NOT_FOUND);
    }
    return await collectionsRepository.update(id, input);
  },

  // delete a collection
  async deleteCollection(id: string) {
    const existingCollection = await collectionsRepository.findById(id);
    if (!existingCollection) {
      throw new Error(COLLECTION_NOT_FOUND);
    }
    await collectionsRepository.delete(id);
  },

  // add a pin to a collection (only the owner or an editor)
  async addPinToCollection(collectionId: string, pinId: string, userId: string) {
    const collection = await collectionsRepository.findById(collectionId);
    if (!collection) {
      throw new Error(COLLECTION_NOT_FOUND);
    }
    if (!(await canEditPins(collection, userId))) {
      throw new Error(NOT_OWNER_OR_EDITOR);
    }
    const pin = await pinsRepository.findById(pinId);
    if (!pin) {
      throw new Error(PIN_NOT_FOUND);
    }
    const existing = await collectionsRepository.findCollectionPin(collectionId, pinId);
    if (existing) {
      throw new Error(PIN_ALREADY_IN_COLLECTION);
    }
    return await collectionsRepository.addPin(collectionId, pinId, userId);
  },

  // remove a pin from a collection (only the owner or an editor); the pin itself is not deleted
  async removePinFromCollection(collectionId: string, pinId: string, userId: string) {
    const collection = await collectionsRepository.findById(collectionId);
    if (!collection) {
      throw new Error(COLLECTION_NOT_FOUND);
    }
    if (!(await canEditPins(collection, userId))) {
      throw new Error(NOT_OWNER_OR_EDITOR);
    }
    const existing = await collectionsRepository.findCollectionPin(collectionId, pinId);
    if (!existing) {
      throw new Error(PIN_NOT_IN_COLLECTION);
    }
    await collectionsRepository.removePin(collectionId, pinId);
  },
};
