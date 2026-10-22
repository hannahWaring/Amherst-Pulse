import { Router } from "express";
import { pinController } from "../controllers/pinController.js";
const router = Router();
// Create a pin.
router.post("/", pinController.create);
// Get all pins in a collection.
router.get(
  "/collections/:collectionId/pins",
  pinController.getByCollection,
);
// Get one pin.
router.get("/:id", pinController.getById);
// Update a pin.
router.patch("/:id", pinController.update);
// Delete a pin.
router.delete("/:id", pinController.delete);
export default router;