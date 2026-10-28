import { Router } from "express";
import { collectionController } from "../controllers/collectionController.js";

///this a copy paste from pin route, so unfinshed yet

const router = Router();
// Routes commented out until collectionController is implemented.
// // Create a collection.
// router.post("/", collectionController.create);
// // Get all collections by user
// router.get(
//   "/collections/:collectionId/pins",
//   collectionController.getByUser,
// );
// // Get one collection.
// router.get("/:id", collectionController.getById);
// // Update a collection.
// router.patch("/:id", collectionController.update);
// // Delete a collection.
// router.delete("/:id", collectionController.delete);
export default router;
