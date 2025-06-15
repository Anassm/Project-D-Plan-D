import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { buildApp } from "./server";

dotenv.config();

const httpsOptions = {
  key: fs.readFileSync(("../certs/localhost-key.pem")),
  cert: fs.readFileSync(("../certs/localhost-cert.pem")),
};

const backendPort = Number(process.env.API_PORT);

const start = async () => {
  const app = await buildApp({ https: httpsOptions });

  try {
    await app.listen({ port: backendPort, host: "0.0.0.0" });
    console.log(`✅ Server listening on https://localhost:${backendPort}`);
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

start();
