import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../errors/AppError.js";
import { collectionMemberService } from "../services/collectionMemberService.js";

// Check whether a string is a valid UUID.
function isValidUUID(id: unknown): id is string {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  );
}

// List the members of a collection (owner only)
export async function listMembers(
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

    const members = await collectionMemberService.listMembers(id, user.id);
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
}

// Add a member by username (owner only); body: { username, role }
export async function addMember(
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
    const body = req.body ?? {};
    const member = await collectionMemberService.addMember(id, user.id, body);
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
}

// Change a member's role (owner only); body: { role }
export async function updateMemberRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    const id = req.params.id;
    const memberId = req.params.userId;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    if (!isValidUUID(memberId)) {
      next(badRequest("Invalid user ID."));
      return;
    }

    // req.body is undefined in Express 5 when no JSON body was sent.
    const body = req.body ?? {};
    const member = await collectionMemberService.updateMemberRole(
      id,
      user.id,
      memberId,
      body,
    );
    res.status(200).json(member);
  } catch (error) {
    next(error);
  }
}

// Remove a member (owner only)
export async function removeMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = req.user!;
    const id = req.params.id;
    const memberId = req.params.userId;

    if (!isValidUUID(id)) {
      next(badRequest("Invalid collection ID."));
      return;
    }

    if (!isValidUUID(memberId)) {
      next(badRequest("Invalid user ID."));
      return;
    }

    await collectionMemberService.removeMember(id, user.id, memberId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
