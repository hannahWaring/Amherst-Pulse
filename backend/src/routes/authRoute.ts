import { Router } from "express";
import {
  login,
  logout,
  refresh,
  signup,
} from "../controllers/authController.js";

export const authRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Credentials:
 *       type: object
 *       required: [username, password]
 *       properties:
 *         username: { type: string }
 *         password: { type: string }
 *     AuthSession:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id: { type: string, format: uuid }
 *             username: { type: string }
 *         access_token: { type: string }
 *         refresh_token: { type: string }
 *         expires_at: { type: integer }
 */

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Create an account and sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Credentials' }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthSession' }
 *       400:
 *         description: "`username and password are required` · `Password should be at least 6 characters.`"
 *       409:
 *         description: "`Username is already taken`"
 */
authRouter.post("/signup", signup);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Sign in
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Credentials' }
 *     responses:
 *       200:
 *         description: Signed in
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthSession' }
 *       400:
 *         description: "`username and password are required`"
 *       401:
 *         description: "`Invalid username or password`"
 */
authRouter.post("/login", login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Sign out (invalidates the access and refresh tokens)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Signed out
 *       401:
 *         description: "`Missing bearer token` · `Invalid or expired token`"
 */
authRouter.post("/logout", logout);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Get a new session from a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refresh_token]
 *             properties:
 *               refresh_token: { type: string }
 *     responses:
 *       200:
 *         description: New session
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthSession' }
 *       400:
 *         description: "`refresh_token is required`"
 *       401:
 *         description: "`Invalid or expired refresh token`"
 */
authRouter.post("/refresh", refresh);
