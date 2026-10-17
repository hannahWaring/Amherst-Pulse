
import { findAllPins } from "../repositories/pinRepo.js";

export async function getAllPins() {
  return await findAllPins();
}
