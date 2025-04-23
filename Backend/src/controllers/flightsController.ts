import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

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


  