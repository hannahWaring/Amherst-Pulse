import { forbidden, notFound } from "../errors/AppError.js";
import {pinsRepository,} from "../repositories/pinRepository.js";
import type {
  CreatePinInput,
  UpdatePinInput,
} from "../types/pins.js";

export const pinsService = {
  async createPin(creatorId: string,input: CreatePinInput,
  ) {return await pinsRepository.create(creatorId, input);},

  async getPinsByCollection(collectionId: string) {
    const pin= await pinsRepository.findAllByCollection(collectionId);
    if (!pin) throw notFound("Pin not found");
    return pin;
  },

  async getPinById(id: string) {
    const pin = await pinsRepository.findById(id);
    if (!pin) {
      throw new Error("Pin not found");
    }
    return pin;
  },

  async updatePin(userid:string,id: string, input: UpdatePinInput) {
    const existingPin = await pinsRepository.findById(id);
    if (!existingPin) {
      throw new Error("Pin not found");
    }
  const existing = await this.getPinById(id);
  //this needs to be reconsidered(?) could, say the collection owner edit the pin?
  if (existing.creator_id !== userid) {
    throw forbidden("Only the creator can edit this pin");
  }
  //need to check if the input is valid here
    return await pinsRepository.update(id, input);
  },

  async deletePin(userId:string,id: string) {
    const existingPin = await pinsRepository.findById(id);
    if (!existingPin) {
      throw new Error("Pin not found");
    }
      const existing = await this.getPinById(id);
    //same as the one in updatePin do we check by owner of collection instead?
  if (existing.creator_id !== userId) {
    throw forbidden("Only the creator can delete this pin");
  }
    await pinsRepository.delete(id);
  },
};
