import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "./helper/setup";
import { getAuthTokenUser } from "./helper/authHelper";

let token: string;

describe("Auth E2E", () => {
  it("Login fails with wrong password", async () => {
    const res = await request(app.server).post("/post/login").send({
      username: "admin1",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("Login and return token", async () => {
    const res = await request(app.server).post("/post/login").send({
      username: "admin1",
      password: "Admin1Admin",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");

    token = res.body.token;
  });

  it("wrong token", async () => {
    const res = await request(app.server)
      .get("/api/touchpoint/flightnumber")
      .set("Authorization", `Bearer 123`)
      .query({ flightNumber: "TRA5690" });

    expect(res.status).toBe(401);
  });

  it("User accessing unaccessable endpoint", async () => {
    const token = getAuthTokenUser();

    const res = await request(app.server)
      .get("/api/touchpoint/flightid")
      .set("Authorization", `Bearer ${token}`)
      .query({ flightID: "638004" });

    expect(res.status).toBe(403);
  });
});
