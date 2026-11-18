import { Router } from "express";
import { collectionController } from "../controllers/collectionController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// Authenticate requests before reaching any collection controller.
router.use(authenticate);

/**
 * @openapi
 * components:
 *   schemas:
 *     CollectionFields:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         visibility: { type: string, enum: [private, public], default: private }
 *         viewer_can_add_pins: { type: boolean, default: false }
 *     NewCollection:
 *       type: object
 *       required: [owner_id, title]
 *       properties:
 *         owner_id: { type: string, format: uuid }
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         visibility: { type: string, enum: [private, public], default: private }
 *         viewer_can_add_pins: { type: boolean, default: false }
 *     Collection:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         owner_id: { type: string, format: uuid }
 *         title: { type: string }
 *         description: { type: string, nullable: true }
 *         visibility: { type: string, enum: [private, public], default: private }
 *         viewer_can_add_pins: { type: boolean, default: false }
 *     CollectionPin:
 *       type: object
 *       properties:
 *         collection_id: { type: string, format: uuid }
 *         pin_id: { type: string, format: uuid }
 *         added_by: { type: string, format: uuid }
 *   parameters:
 *     CollectionId: { in: path, name: id, required: true, schema: { type: string, format: uuid } }
 *     UserId: { in: path, name: userId, required: true, schema: { type: string, format: uuid } }
 */

/**
 * @openapi
 * /collections:
 *   post:
 *     summary: Create a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NewCollection' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Collection' }
 *       401:
 *         description: "`Authentication required.`"
 *       500:
 *         description: "`null value in column \"<column>\" of relation \"collections\" violates not-null constraint` · `invalid input syntax for type uuid: \"<value>\"` · `insert or update on table \"collections\" violates foreign key constraint \"collections_owner_id_fkey\"`"
 */
router.post("/", collectionController.create);

/**
 * @openapi
 * /collections:
 *   get:
 *     summary: List all public collections (not implemented)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *         description: "`Authentication required.`"
 *       501:
 *         description: "`Not implemented`"
 */
router.get("/", collectionController.listPublic);

/**
 * @openapi
 * /collections/user/{userId}:
 *   get:
 *     summary: List the collections a user owns
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Collections (empty if none)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Collection' }
 *       401:
 *         description: "`Authentication required.`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<userId>\"`"
 */
router.get("/user/:userId", collectionController.getByUser);

/**
 * @openapi
 * /collections/user/{userId}/shared:
 *   get:
 *     summary: List the collections shared with a user
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/UserId'
 *     responses:
 *       200:
 *         description: Collections (empty if none)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Collection' }
 *       401:
 *         description: "`Authentication required.`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<userId>\"`"
 */
router.get("/user/:userId/shared", collectionController.getSharedWithUser);

/**
 * @openapi
 * /collections/{id}:
 *   get:
 *     summary: Get a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *     responses:
 *       200:
 *         description: The collection
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Collection' }
 *       401:
 *         description: "`Authentication required.`"
 *       404:
 *         description: "`Collection not found`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<id>\"`"
 */
router.get("/:id", collectionController.getById);

/**
 * @openapi
 * /collections/{id}:
 *   patch:
 *     summary: Update a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CollectionFields' }
 *     responses:
 *       200:
 *         description: The updated collection
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Collection' }
 *       401:
 *         description: "`Authentication required.`"
 *       404:
 *         description: "`Collection not found`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<id>\"` · `Cannot coerce the result to a single JSON object` (empty body)"
 */
router.patch("/:id", collectionController.update);

/**
 * @openapi
 * /collections/{id}:
 *   delete:
 *     summary: Delete a collection
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: "`Authentication required.`"
 *       404:
 *         description: "`Collection not found`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<id>\"`"
 */
router.delete("/:id", collectionController.delete);

/**
 * @openapi
 * /collections/{id}/addPin:
 *   post:
 *     summary: Add a pin to a collection (user_id must be the owner or a collaborator)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pin_id, user_id]
 *             properties:
 *               pin_id: { type: string, format: uuid }
 *               user_id: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Added
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/CollectionPin' }
 *       401:
 *         description: "`Authentication required.`"
 *       403:
 *         description: "`Only the owner or an editor of this collection can do this`"
 *       404:
 *         description: "`Collection not found` · `Pin not found`"
 *       409:
 *         description: "`Pin is already in this collection`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<value>\"`"
 */
router.post("/:id/addPin", collectionController.addPin);

/**
 * @openapi
 * /collections/{id}/deletePin/{pinId}:
 *   delete:
 *     summary: Remove a pin from a collection (user_id must be the owner or a collaborator)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *       - { in: path, name: pinId, required: true, schema: { type: string, format: uuid } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id]
 *             properties:
 *               user_id: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Removed
 *       401:
 *         description: "`Authentication required.`"
 *       403:
 *         description: "`Only the owner or an editor of this collection can do this`"
 *       404:
 *         description: "`Collection not found` · `Pin is not in this collection`"
 *       500:
 *         description: "`invalid input syntax for type uuid: \"<value>\"`"
 */
router.delete("/:id/deletePin/:pinId", collectionController.removePin);

/**
 * @openapi
 * /collections/{id}/share:
 *   post:
 *     summary: Share a collection with a user (not implemented)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *     responses:
 *       401:
 *         description: "`Authentication required.`"
 *       501:
 *         description: "`Not implemented`"
 */
router.post("/:id/share", collectionController.share);

/**
 * @openapi
 * /collections/{id}/revoke:
 *   delete:
 *     summary: Revoke a user's access to a collection (not implemented)
 *     tags: [Collections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/CollectionId'
 *     responses:
 *       401:
 *         description: "`Authentication required.`"
 *       501:
 *         description: "`Not implemented`"
 */
router.delete("/:id/revoke", collectionController.revoke);

export default router;
