//this is just a basic structure so it
//does not really handle most errors yet, need to implement middleware
//does not authenticate if the one who wants to edit is the authorized
import {pinsRepository,} from "../repositories/pinRepository.js";
import type {
  CreatePinInput,
  UpdatePinInput,
} from "../types/pins.js";

export const pinsService = {
  async createPin(creatorId: string,input: CreatePinInput,
  ) {return await pinsRepository.create(creatorId, input);},

  async getPinsByCollection(collectionId: string) {
    return await pinsRepository.findAllByCollection(collectionId);
  },

  async getPinById(id: string) {
    const pin = await pinsRepository.findById(id);
    if (!pin) {
      throw new Error("Pin not found");
    }
    return pin;
  },

  async updatePin(id: string, input: UpdatePinInput) {
    const existingPin = await pinsRepository.findById(id);
    if (!existingPin) {
      throw new Error("Pin not found");
    }
    return await pinsRepository.update(id, input);
  },
  async deletePin(id: string) {
    const existingPin = await pinsRepository.findById(id);
    if (!existingPin) {
      throw new Error("Pin not found");
    }
    await pinsRepository.delete(id);
  },
};
