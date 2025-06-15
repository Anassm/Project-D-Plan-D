import {
  describe,
  it,
  expect,
} from "@jest/globals";
import { app } from "./setup.test";
import request from "supertest";

describe("Auth E2E", () => {
  it("Login and return token", async () => {
    const res = await request(app.server).post("/post/login").send({
      username: "admin1",
      password: "Admin1Admin",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });
});
