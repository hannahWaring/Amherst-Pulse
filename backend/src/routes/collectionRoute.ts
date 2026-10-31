import { Router } from "express";
import { collectionController } from "../controllers/collectionController.js";

const router = Router();
// Create a collection
router.post("/", collectionController.create);
// Get all collections owned by the logged in user
router.get("/user/:userId", collectionController.getByUser);
// Get all collections shared with the logged in user by other users
router.get("/user/:userId/shared", collectionController.getSharedWithUser);
// Get a collection
router.get("/:id", collectionController.getById);
// Update a collection
router.patch("/:id", collectionController.update);
// Delete a collection
router.delete("/:id", collectionController.delete);
// Add a pin to a collection (owner or editor/collaborator only)
router.post("/:id/addPin", collectionController.addPin);
// Remove a pin from a collection (owner or editor/collaborator only)
router.delete("/:id/deletePin/:pinId", collectionController.removePin);
export default router;
