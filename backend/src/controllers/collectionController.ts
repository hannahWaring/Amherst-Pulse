import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../errors/AppError.js";
import { collectionService } from "../services/collectionService.js";

// Check whether a string is a valid UUID.
function isValidUUID(id: unknown): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  );
}

// Create a collection (the owner is the logged-in user)
export async function createCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    // req.body is undefined in Express 5 when no JSON body was sent.
    const body = req.body ?? {};
    const collection = await collectionService.createCollection(user.id, body);
    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
}

// Get the collections owned by the logged-in user
export async function listMyCollections(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    const collections = await collectionService.getCollectionsByOwner(user.id);
    res.status(200).json(collections);
  } catch (error) {
    next(error);
  }
}

// Get the collections other users shared with the logged-in user
export async function listSharedCollections(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    const collections = await collectionService.getCollectionsSharedWithUser(
      user.id,
    );
    res.status(200).json(collections);
  } catch (error) {
    next(error);
  }
}

// Get one collection
export async function getCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    const collection = await collectionService.getCollectionById(id);
    res.status(200).json(collection);
  } catch (error) {
    next(error);
  }
}

// Update a collection
export async function updateCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    // req.body is undefined in Express 5 when no JSON body was sent.
    const body = req.body ?? {};
    const collection = await collectionService.updateCollection(id, body);
    res.status(200).json(collection);
  } catch (error) {
    next(error);
  }
}

// Delete a collection
export async function deleteCollection(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    await collectionService.deleteCollection(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

// Add a pin to a collection (owner or editor only); body: { pin_id }
export async function addPin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    const id = req.params.id;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    // req.body is undefined in Express 5 when no JSON body was sent.
    const pinId = req.body?.pin_id;

    if (!isValidUUID(pinId)) {
      next(badRequest("Invalid pin ID."));
      return;
    }

    const collectionPin = await collectionService.addPinToCollection(
      id,
      pinId,
      user.id,
    );
    res.status(201).json(collectionPin);
  } catch (error) {
    next(error);
  }
}

// Remove a pin from a collection (owner or editor only); the pin itself is not deleted
export async function removePin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    const id = req.params.id;
    const pinId = req.params.pinId;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    if (!isValidUUID(pinId)) {
      next(badRequest("Invalid pin ID."));
      return;
    }

    await collectionService.removePinFromCollection(id, pinId, user.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
