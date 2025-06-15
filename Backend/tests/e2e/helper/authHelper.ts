import request from "supertest";
import { app } from "./setup";

let cachedToken: Record<string, string> = {};

export async function getAuthTokenAdmin(): Promise<string> {
  const res = await request(app.server).post("/post/login").send({
    username: "admin1",
    password: "Admin1Admin",
  });

  if (res.status !== 200) {
    throw new Error(
      `Login failed: ${res.status} - ${JSON.stringify(res.body)}`
    );
  }

  cachedToken.admin = res.body.token;

  console.log("ADMIN TOKENNNNNN: ", cachedToken);
  
  return cachedToken.admin;
}

export async function getAuthTokenUser(): Promise<string> {
  const res = await request(app.server).post("/post/login").send({
    username: "Anass",
    password: "Moussadi",
  });

  if (res.status !== 200) {
    throw new Error(
      `Login failed: ${res.status} - ${JSON.stringify(res.body)}`
    );
  }

  cachedToken.user = res.body.token;

  console.log("USER TOKENNNNNN: ", cachedToken);

  return cachedToken.user;
}
