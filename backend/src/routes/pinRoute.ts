import { Router } from "express";
// Commented out until the authenticate middleware is implemented.
// import { authenticate } from "../middleware/authenticate.js";
import {
  createPin,
  listPins,
  getPin,
  updatePin,
  deletePin,
} from "../controllers/pinController.js";

const router = Router();

// Authenticate requests before reaching any pin controller.
// router.use(authenticate);

router.post("/", createPin);
router.get("/collection/:collectionId", listPins);
router.get("/:id", getPin);
router.patch("/:id", updatePin);
router.delete("/:id", deletePin);

export default router;