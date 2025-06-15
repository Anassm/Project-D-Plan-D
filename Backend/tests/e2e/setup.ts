import { buildApp } from "../../src/server";
import { beforeAll, afterAll } from "@jest/globals";

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

export { app };
