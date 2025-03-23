import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
});

export async function getAllDataFromTable(
  table: string,
  amount: number = 0
): Promise<any> {
  const client = await pool.connect();
  try {
    if (amount == 0) {
      const res = await client.query(`SELECT * FROM ${table}`);
      return res.rows;
    }
    const res = await client.query(`SELECT * FROM ${table} LIMIT ${amount}`);
    return res.rows;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    client.release();
  }
}
