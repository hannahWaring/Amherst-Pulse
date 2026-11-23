import { describe, it, test, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app.js";
import { supabaseAdmin, supabasePublic } from "../../src/lib/supabase.js";

beforeAll(async () => {
  // Note: It would be better to do this via Supabase admin, but this is fine for now.
  // Creates preexisting user to be used in other tests
  const res = await request(app)
    .post("/auth/signup")
    .send({ username: "user", password: "password" });

  expect(res.status).toBe(201);
});

describe("/auth/signup tests", () => {
  it("Signing up fresh account returns 201 and creates entry in profiles", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "user1", password: "testpassword" });

    res.status;
    res.body;
    expect(res.status).toBe(201);

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("username", "user1")
      .maybeSingle();

    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.id).toBe(res.body.user.id);
  });

  it("Signing up fresh account returns working access and refresh token", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "user3", password: "testpassword" });

    res.status;
    res.body;
    expect(res.status).toBe(201);

    const access_token = res.body.access_token;
    const refresh_token = res.body.refresh_token;

    // Checks that the access token is valid
    {
      const { data, error } = await supabaseAdmin.auth.getUser(access_token);
      expect(error).toBeNull();
      expect(data).not.toBeNull();
    }

    // Checks that the refresh token works
    {
      const { data, error } = await supabasePublic.auth.refreshSession({
        refresh_token: refresh_token,
      });
      expect(error).toBeNull();
      expect(data).not.toBeNull();
    }
  });

  // With mocking maybe these next three tests could become unit tests
  it("Signing up with duplicated username fails with code 409", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "user", password: "password" });

    res.status;
    res.body;
    expect(res.status).toBe(409);
  });

  it("Signing up with empty password fails with code 400", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "user2", password: "" });

    res.status;
    res.body;
    expect(res.status).toBe(400);
  });

  it("Signing up with empty username fails with code 400", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ username: "", password: "password" });

    res.status;
    res.body;
    expect(res.status).toBe(400);
  });
});

describe("/auth/login tests", () => {
  it("Logging in to existing account returns 200", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });
    expect(res.status).toBe(200);
  });

  it("Logging in to existing account returns working authentication and refresh token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });
    expect(res.status).toBe(200);

    const access_token = res.body.access_token;
    const refresh_token = res.body.refresh_token;

    // Checks that the access token is valid
    {
      const { data, error } = await supabaseAdmin.auth.getUser(access_token);
      expect(error).toBeNull();
      expect(data).not.toBeNull();
    }

    // Checks that the refresh token works
    {
      const { data, error } = await supabasePublic.auth.refreshSession({
        refresh_token: refresh_token,
      });
      expect(error).toBeNull();
      expect(data).not.toBeNull();
    }
  });

  it("Logging in to existing account with wrong password returns 401", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });

  it("Logging in to with empty username fails", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "", password: "password" });
    expect(res.status).toBe(400);
  });

  it("Logging in to with empty password fails", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "" });
    expect(res.status).toBe(400);
  });
});

describe("/auth/logout tests", () => {
  it("Logging out with valid token returns 204", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const token = login.body.access_token;

    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("After logging out, the token should be invalid", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const token = login.body.access_token;

    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);

    // Checks that the access token is invalid
    {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      expect(error).not.toBeNull();
      expect(data.user).toBeNull();
    }
  });

  it("Logging out fails with invalid token", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    //const token = login.body.access_token;
    const token = "invalidtoken";

    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  it("Logging out fails with missing token", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    //const token = login.body.access_token;
    const token = "";

    const res = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(401);
  });
});

describe("/auth/refresh tests", () => {
  it("Refreshing with valid refresh token returns 200", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const refresh_token = login.body.refresh_token;

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token });
    expect(res.status).toBe(200);
  });

  it("Refreshing with valid refresh token returns working access token", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const refresh_token = login.body.refresh_token;

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token });

    const access_token = res.body.access_token;

    // Checks that the access token is valid
    const { data, error } = await supabaseAdmin.auth.getUser(access_token);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  it("Refreshing without refresh token fails with code 400", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const refresh_token = "";

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token });

    expect(res.status).toBe(400);
  });

  it("Refreshing with invalid refresh token fails with code 401", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const refresh_token = "invalidtoken";

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token });

    expect(res.status).toBe(401);
  });

  it("Refresh token does not work after logging out", async () => {
    const login = await request(app)
      .post("/auth/login")
      .send({ username: "user", password: "password" });

    expect(login.status).toBe(200);

    const lgout = await request(app)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${login.body.access_token}`);

    const refresh_token = login.body.refresh_token;

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refresh_token });

    expect(res.status).toBe(401);
  });
});
