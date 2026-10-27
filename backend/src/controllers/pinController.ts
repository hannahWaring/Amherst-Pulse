import type { Request, Response, NextFunction } from "express";
import { pinsService } from "../services/pinService.js";

// 401 checks commented out for now: the authenticate middleware already
// rejects unauthenticated requests before they reach these handlers.
// // Get the authenticated user attached by authenticate middleware.
// function requireUser(req: Request, res: Response) {
//   //this need to be changed according to how the authentication looks
//   const user = req.user;
//   if (!user) {
//     res.status(401).json({ error: "Authentication required." });
//     return null;
//   }
//   return user;
// }

// Check whether a string is a valid UUID.
function isValidUUID(id: unknown): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  );
}

// Create a pin
export async function createPin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // const user = requireUser(req, res);
    // if (!user) return;
    const user = req.user!;
    const { title } = req.body;
    if (typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ error: "Title is required." });
      return;
    }
    const input = {
      ...req.body,
      title: title.trim(),
    };
    const pin = await pinsService.createPin(user.id, input);
    res.status(201).json(pin);
  } catch (error) {
    next(error);
  }
}

// Get all pins in a collection
export async function listPins(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const collectionId = req.params.collectionId;

    if (!isValidUUID(collectionId)) {
      res.status(400).json({ error: "Invalid collection ID." });
      return;
    }

    const pins = await pinsService.getPinsByCollection(collectionId);

    res.status(200).json(pins);
  } catch (error) {
    next(error);
  }
}

// Get one pin
export async function getPin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = req.params.id;

    if (!isValidUUID(id)) {
      res.status(400).json({ error: "Invalid pin ID." });
      return;
    }

    // Use the actual method name defined in pinService.ts.
    const pin = await pinsService.getPinById(id);

    res.status(200).json(pin);
  } catch (error) {
    next(error);
  }
}

// Update a pin
export async function updatePin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // const user = requireUser(req, res);
    // if (!user) return;
    const user = req.user!;

    const id = req.params.id;

    if (!isValidUUID(id)) {
      res.status(400).json({ error: "Invalid pin ID." });
      return;
    }

    if (
      req.body.title !== undefined &&
      (typeof req.body.title !== "string" || req.body.title.trim() === "")
    ) {
      res.status(400).json({
        error: "Title must be a non-empty string.",
      });
      return;
    }

    const input = {
      ...req.body,
      ...(typeof req.body.title === "string"
        ? { title: req.body.title.trim() }
        : {}),
    };

    const pin = await pinsService.updatePin(user.id, id, input);

    res.status(200).json(pin);
  } catch (error) {
    next(error);
  }
}

// Delete a pin
export async function deletePin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // const user = requireUser(req, res);
    // if (!user) return;
    const user = req.user!;

    const id = req.params.id;

    if (!isValidUUID(id)) {
      res.status(400).json({ error: "Invalid pin ID." });
      return;
    }

    await pinsService.deletePin(user.id, id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
