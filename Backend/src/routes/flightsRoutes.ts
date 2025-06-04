import { FastifyInstance } from "fastify";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  ssl: {
    rejectUnauthorized: false, // safe for dev, use certs in prod
  },
});

export const flightsRoutes = (server: FastifyInstance) => {};
