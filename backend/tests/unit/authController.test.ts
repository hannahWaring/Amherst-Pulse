import { jest, describe, test, expect, beforeEach } from "@jest/globals";
import type { Request, Response } from "express";

type AnyFn = (...args: any[]) => any;

const signInWithPassword = jest.fn<AnyFn>();
const signOut = jest.fn<AnyFn>();
const maybeSingle = jest.fn<AnyFn>();
const usernameToEmail = jest.fn<AnyFn>();

const eq = jest.fn<AnyFn>(() => ({ maybeSingle }));
const select = jest.fn<AnyFn>(() => ({ eq }));
const from = jest.fn<AnyFn>(() => ({ select }));

jest.unstable_mockModule("../../src/lib/supabase.js", () => ({
  supabasePublic: {
    auth: { signInWithPassword },
  },
  supabaseAdmin: {
    auth: { admin: { signOut } },
    from,
  },
  usernameToEmail,
}));

const { login, logout } = await import(
  "../../src/controllers/authController.js"
);

function mockResponse() {
  const res = {
    status: jest.fn<AnyFn>(),
    json: jest.fn<AnyFn>(),
    end: jest.fn<AnyFn>(),
  };

  res.status.mockReturnValue(res);
  return res;
}

describe("Authentication Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    usernameToEmail.mockImplementation(
      (username: string) => `${username}@example.com`
    );
  });

  describe("Login", () => {
    test("logs in a user with valid credentials", async () => {
      const req = {
        body: {
          username: "testuser",
          password: "password123",
        },
      } as Request;

      const res = mockResponse();

      const session = {
        user: { id: "u1" },
        access_token: "access123",
        refresh_token: "refresh123",
        expires_at: 1234567890,
      };

      signInWithPassword.mockResolvedValue({
        data: {
          user: { id: "u1" },
          session,
        },
        error: null,
      });

      maybeSingle.mockResolvedValue({
        data: { username: "testuser" },
        error: null,
      });

      await login(req, res as unknown as Response);

      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "testuser@example.com",
        password: "password123",
      });

      expect(res.json).toHaveBeenCalledWith({
        user: {
          id: "u1",
          username: "testuser",
        },
        access_token: "access123",
        refresh_token: "refresh123",
        expires_at: 1234567890,
      });
    });

    test("rejects invalid login credentials", async () => {
      const req = {
        body: {
          username: "testuser",
          password: "wrongpassword",
        },
      } as Request;

      const res = mockResponse();

      signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: {
          code: "invalid_credentials",
          message: "Invalid credentials",
        },
      });

      await expect(
        login(req, res as unknown as Response)
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid username or password",
      });

      expect(res.json).not.toHaveBeenCalled();
    });

    test("rejects login with missing password", async () => {
      const req = {
        body: { username: "testuser" },
      } as Request;

      const res = mockResponse();

      await expect(
        login(req, res as unknown as Response)
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(signInWithPassword).not.toHaveBeenCalled();
    });

    test("rejects login with missing username", async () => {
      const req = {
        body: { password: "password123" },
      } as Request;

      const res = mockResponse();

      await expect(
        login(req, res as unknown as Response)
      ).rejects.toMatchObject({
        statusCode: 400,
      });

      expect(signInWithPassword).not.toHaveBeenCalled();
    });
  });

  describe("Logout", () => {
    test("successfully logs out authenticated user", async () => {
      const req = {
        headers: {
          authorization: "Bearer validtoken",
        },
      } as Request;

      const res = mockResponse();

      signOut.mockResolvedValue({ error: null });

      await logout(req, res as unknown as Response);

      expect(signOut).toHaveBeenCalledWith(
        "validtoken",
        "local"
      );

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalledTimes(1);
    });

    test("rejects logout without authentication token", async () => {
      const req = {
        headers: {},
      } as Request;

      const res = mockResponse();

      await expect(
        logout(req, res as unknown as Response)
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Missing bearer token",
      });

      expect(signOut).not.toHaveBeenCalled();
    });

    test("rejects logout with invalid token", async () => {
      const req = {
        headers: {
          authorization: "Bearer invalidtoken",
        },
      } as Request;

      const res = mockResponse();

      signOut.mockResolvedValue({
        error: { message: "Invalid token" },
      });

      await expect(
        logout(req, res as unknown as Response)
      ).rejects.toMatchObject({
        statusCode: 401,
        message: "Invalid or expired token",
      });

      expect(res.end).not.toHaveBeenCalled();
    });
  });
});

