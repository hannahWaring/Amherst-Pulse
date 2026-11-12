import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  createCollection,
  listMyCollections,
  listSharedCollections,
  getCollection,
  updateCollection,
  deleteCollection,
  addPin,
  removePin,
} from "../controllers/collectionController.js";

const router = Router();

// Authenticate requests before reaching any collection controller.
router.use(authenticate);

// Create a collection
router.post("/", createCollection);
// Get all collections owned by the logged in user
// ("/mine" and "/shared" must stay above "/:id" so they are not read as an id)
router.get("/mine", listMyCollections);
// Get all collections shared with the logged in user by other users
router.get("/shared", listSharedCollections);
// Get a collection
router.get("/:id", getCollection);
// Update a collection
router.patch("/:id", updateCollection);
// Delete a collection
router.delete("/:id", deleteCollection);
// Add a pin to a collection (owner or editor/collaborator only)
router.post("/:id/addPin", addPin);
// Remove a pin from a collection (owner or editor/collaborator only)
router.delete("/:id/deletePin/:pinId", removePin);

export default router;
