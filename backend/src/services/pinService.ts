//validator unfinished
//a lot of these might need to be discussed during meeting or with Dia about how she implemented the collection
//mainly about who have rights to edit a pin
//and where do we verify if a user could create a pin or not
import { forbidden, notFound } from "../errors/AppError.js";
import { pinsRepository } from "../repositories/pinRepository.js";
import type { CreatePinInput, UpdatePinInput } from "../types/pins.js";
import {
  validateCreatePin,
  validateUpdatePin,
} from "../validators/pinValidator.js";

export const pinsService = {
  async createPin(creatorId: string, input: CreatePinInput) {
    validateCreatePin(input);
    return await pinsRepository.create(creatorId, input);
  },

  async getPinsByCollection(collectionId: string) {
    return pinsRepository.findAllByCollection(collectionId);
  },

  async getPinById(id: string) {
    const pin = await pinsRepository.findById(id);
    if (!pin) {
      throw notFound("Pin not found");
    }
    return pin;
  },

  async updatePin(userid: string, id: string, input: UpdatePinInput) {
    const existing = await this.getPinById(id);
    //this needs to be reconsidered(?) could, say the collection owner edit the pin?
    if (existing.creator_id !== userid) {
      throw forbidden("Only the creator can edit this pin");
    }
    validateUpdatePin(input);
    return await pinsRepository.update(id, input);
  },

  async deletePin(userId: string, id: string) {
    const existing = await this.getPinById(id);
    //same as the one in updatePin do we check by owner of collection instead?
    if (existing.creator_id !== userId) {
      throw forbidden("Only the creator can delete this pin");
    }
    await pinsRepository.delete(id);
  },
};
