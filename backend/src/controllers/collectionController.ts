import type { Request, Response } from "express";
import {
  COLLECTION_NOT_FOUND,
  NOT_OWNER_OR_EDITOR,
  PIN_ALREADY_IN_COLLECTION,
  PIN_NOT_FOUND,
  PIN_NOT_IN_COLLECTION,
  collectionService,
} from "../services/collectionService.js";

// Status code for each known error message from the service; anything else is 500
const ERROR_STATUS: Record<string, number> = {
  [COLLECTION_NOT_FOUND]: 404,
  [PIN_NOT_FOUND]: 404,
  [PIN_NOT_IN_COLLECTION]: 404,
  [NOT_OWNER_OR_EDITOR]: 403,
  [PIN_ALREADY_IN_COLLECTION]: 409,
};

// For now every error returns its exact message so it is easier to debug.
// Supabase errors are plain objects with a `message`, not always `Error` instances.
function errorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === "object" && err !== null && "message" in err) {
    return String(err.message);
  }
  return String(err);
}

function sendError(res: Response, err: unknown) {
  const message = errorMessage(err);
  const status = ERROR_STATUS[message] ?? 500;
  res.status(status).json({ error: message });
}

export const collectionController = {
  // POST / — creates a new collection
  // owner comes from the request body for now (no auth check yet)
  // owner id- is the id of the person who made the collection
  async create(req: Request, res: Response) {
    try {
      const { owner_id, ...input } = req.body ?? {};
      const collection = await collectionService.createCollection(owner_id, input);
      res.status(201).json(collection);
    } catch (err) {
      sendError(res, err);
    }
  },

  // GET /user/:userId — collections owned by the user
  async getByUser(req: Request<{ userId: string }>, res: Response) {
    try {
      const collections = await collectionService.getCollectionsByOwner(req.params.userId);
      res.json(collections);
    } catch (err) {
      sendError(res, err);
    }
  },

  // GET /user/:userId/shared — collections shared with the user by others
  async getSharedWithUser(req: Request<{ userId: string }>, res: Response) {
    try {
      const collections = await collectionService.getCollectionsSharedWithUser(req.params.userId);
      res.json(collections);
    } catch (err) {
      sendError(res, err);
    }
  },

  // GET /:id - get/search for a collection by the collection id
  async getById(req: Request<{ id: string }>, res: Response) {
    try {
      const collection = await collectionService.getCollectionById(req.params.id);
      res.json(collection);
    } catch (err) {
      sendError(res, err);
    }
  },

  // PATCH /:id - basically update a collection
  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const collection = await collectionService.updateCollection(req.params.id, req.body ?? {});
      res.json(collection);
    } catch (err) {
      sendError(res, err);
    }
  },

  // DELETE /:id - delete a collection by the collection id
  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      await collectionService.deleteCollection(req.params.id);
      res.status(204).end();
    } catch (err) {
      sendError(res, err);
    }
  },

  // POST /:id/addPin — add a pin to a collection (owner or editor only)
  // body: { pin_id, user_id } — user_id is who is adding it, from the request for now (no auth check yet)
  async addPin(req: Request<{ id: string }>, res: Response) {
    try {
      const { pin_id, user_id } = req.body ?? {};
      const collectionPin = await collectionService.addPinToCollection(req.params.id, pin_id, user_id);
      res.status(201).json(collectionPin);
    } catch (err) {
      sendError(res, err);
    }
  },

  // DELETE /:id/deletePin/:pinId — remove a pin from a collection (owner or editor only)
  // body: { user_id } — who is removing it, from the request for now (no auth check yet)
  async removePin(req: Request<{ id: string; pinId: string }>, res: Response) {
    try {
      const { user_id } = req.body ?? {};
      await collectionService.removePinFromCollection(req.params.id, req.params.pinId, user_id);
      res.status(204).end();
    } catch (err) {
      sendError(res, err);
    }
  },
};
