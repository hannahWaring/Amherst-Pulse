import { Router } from "express";
import {
  listMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "../controllers/collectionMemberController.js";

// Mounted at /collections/:id/members, so the collection id is passed through (mergeParams).
const router = Router({ mergeParams: true });

// List the members of a collection (owner only)
router.get("/", listMembers);
// Add a member by username (owner only)
router.post("/", addMember);
// Change a member's role (owner only)
router.patch("/:userId", updateMemberRole);
// Remove a member (owner only)
router.delete("/:userId", removeMember);

export default router;
