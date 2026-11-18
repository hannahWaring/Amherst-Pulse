import { forbidden, notFound } from "../errors/AppError.js";
import { pinsRepository } from "../repositories/pinRepository.js";
import type { CreatePinInput, UpdatePinInput } from "../types/pins.js";
import {
  validateCreatePin,
  validateUpdatePin,
} from "../validators/pinValidator.js";
import { collectionsRepository } from "../repositories/collectionRepository.js";

function isPinExpired(pin: {
ends_at: string | null;
}): boolean {
if (!pin.ends_at) {
  return false;
}

return new Date(pin.ends_at).getTime() <= Date.now();
}

function addPinStatus<T extends { ends_at: string | null }>(pin: T) {
  return {
    ...pin,
    is_expired: isPinExpired(pin),
  };
}

export const pinsService = {

  async canModifyPin(userId: string, pinId: string, creatorId: string) {
  // Pin creator can always modify their pin
  if (creatorId === userId) {
    return true;
  }
  const collectionIds =
    await pinsRepository.findCollectionIdsByPin(pinId);

  for (const collectionId of collectionIds) {
    const allowed =
      await collectionsRepository.canUserModifyCollection(
        userId,
        collectionId,
      );

    if (allowed) {
      return true;
    }
  }

  return false;
},

  async createPin(creatorId: string, input: CreatePinInput) {
    validateCreatePin(input);
    const pin = await pinsRepository.create(creatorId, input);
    return addPinStatus(pin);
  },

  async getPinsByCollection(collectionId: string) {
    const pins = await pinsRepository.findAllByCollection(collectionId);
    return pins.map(addPinStatus);
  },

  async getPinById(id: string) {
    const pin = await pinsRepository.findById(id);
    if (!pin) {
      throw notFound("Pin not found");
    }
    return addPinStatus(pin);
  },

  async updatePin(userid: string, id: string, input: UpdatePinInput) {
    const existing = await this.getPinById(id);
    if (!(await this.canModifyPin(userid, id, existing.creator_id))) {
    throw forbidden("You do not have permission to modify this pin");
  }
    validateUpdatePin(input);
    const updatedPin = await pinsRepository.update(id, input);
    return addPinStatus(updatedPin);
  },

  async deletePin(userId: string, id: string) {
    const existing = await this.getPinById(id);
    if (!(await this.canModifyPin(userId, id, existing.creator_id))) {
    throw forbidden("You do not have permission to modify this pin");
  }

    await pinsRepository.delete(id);
  },

};
