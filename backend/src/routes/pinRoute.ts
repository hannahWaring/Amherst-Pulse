import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  createPin,
  listPins,
  listPublicPinsByUser,
  getPin,
  updatePin,
  deletePin,
} from "../controllers/pinController.js";

const router = Router();

// Authenticate requests before reaching any pin controller.
router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
 *     PinFields:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         location_name: { type: string, nullable: true }
 *         latitude: { type: number, nullable: true }
 *         longitude: { type: number, nullable: true }
 *         starts_at: { type: string, nullable: true }
 *         ends_at: { type: string, nullable: true }
 *         is_all_day: { type: boolean, default: false }
 *         recurrence_rule: { type: string, nullable: true }
 *     NewPin:
 *       type: object
 *       required: [title]
 *       properties:
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         location_name: { type: string, nullable: true }
 *         latitude: { type: number, nullable: true }
 *         longitude: { type: number, nullable: true }
 *         starts_at: { type: string, nullable: true }
 *         ends_at: { type: string, nullable: true }
 *         is_all_day: { type: boolean, default: false }
 *         recurrence_rule: { type: string, nullable: true }
 *     Pin:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         creator_id: { type: string, format: uuid }
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         location_name: { type: string, nullable: true }
 *         latitude: { type: number, nullable: true }
 *         longitude: { type: number, nullable: true }
 *         starts_at: { type: string, nullable: true }
 *         ends_at: { type: string, nullable: true }
 *         is_all_day: { type: boolean, default: false }
 *         recurrence_rule: { type: string, nullable: true }
 */

/**
 * @openapi
 * /pins:
 *   post:
 *     summary: Create a pin
 *     tags: [Pins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NewPin' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Pin' }
 *       400:
 *         description: "`Title is required.` · `Unknown field in request.` · `Invalid value in request.` · `Missing required field.`"
 *       401:
 *         description: "`Authentication required.`"
 */
router.post("/", createPin);

/**
 * @openapi
 * /pins/collection/{collectionId}:
 *   get:
 *     summary: List the pins in a collection
 *     tags: [Pins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: collectionId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: Pins (empty if none)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Pin' }
 *       400:
 *         description: "`Invalid collection ID.`"
 *       401:
 *         description: "`Authentication required.`"
 */
router.get("/collection/:collectionId", listPins);

/**
 * @openapi
 * /pins/user/{userId}:
 *   get:
 *     summary: List a user's public pins (not implemented)
 *     tags: [Pins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: userId, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       401:
 *         description: "`Authentication required.`"
 *       501:
 *         description: "`Not implemented`"
 */
router.get("/user/:userId", listPublicPinsByUser);

/**
 * @openapi
 * /pins/{id}:
 *   get:
 *     summary: Get a pin
 *     tags: [Pins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       200:
 *         description: The pin
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Pin' }
 *       400:
 *         description: "`Invalid pin ID.`"
 *       401:
 *         description: "`Authentication required.`"
 *       404:
 *         description: "`Pin not found`"
 */
router.get("/:id", getPin);

/**
 * @openapi
 * /pins/{id}:
 *   patch:
 *     summary: Update a pin (creator only)
 *     tags: [Pins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/PinFields' }
 *     responses:
 *       200:
 *         description: The updated pin
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Pin' }
 *       400:
 *         description: "`Invalid pin ID.` · `Title must be a non-empty string.` · `Unknown field in request.` · `Invalid value in request.` · `Missing required field.`"
 *       401:
 *         description: "`Authentication required.`"
 *       403:
 *         description: "`Only the creator can edit this pin`"
 *       404:
 *         description: "`Pin not found` · `Not found` (empty body)"
 */
router.patch("/:id", updatePin);

/**
 * @openapi
 * /pins/{id}:
 *   delete:
 *     summary: Delete a pin (creator only)
 *     tags: [Pins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     responses:
 *       204:
 *         description: Deleted
 *       400:
 *         description: "`Invalid pin ID.`"
 *       401:
 *         description: "`Authentication required.`"
 *       403:
 *         description: "`Only the creator can delete this pin`"
 *       404:
 *         description: "`Pin not found`"
 */
router.delete("/:id", deletePin);

export default router;
