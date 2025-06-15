import request from "supertest";
import { app } from "./setup";

let cachedToken: string;

export async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const res = await request(app.server).post("/post/login").send({
    username: "admin1",
    password: "Admin1Admin",
  });

  if (res.status !== 200) {
    throw new Error(
      `Login failed: ${res.status} - ${JSON.stringify(res.body)}`
    );
  }

  cachedToken = res.body.token;
  return cachedToken;
}
