import {
  describe,
  it,
  expect,
  jest,
  test,
  beforeAll,
  afterAll,
} from "@jest/globals";

import { server } from "../../src/index";

export const app = server;

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test("basic test", async () => {
  const response = await server.inject({
    method: "GET",
    url: "/health",
  });
  expect(response.statusCode).toBe(200);
});
