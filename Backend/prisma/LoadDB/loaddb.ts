import { Pool } from "pg";
import dotenv from "dotenv";
import { getDMMF } from "@prisma/internals";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
dotenv.config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  max: 30
});

async function getFirstLine(filePath: string): Promise<string> {
  const fileStream = fs.createReadStream(filePath); 
  const rl = readline.createInterface({ input: fileStream });

  for await (const line of rl) {
    const cleanedLine = line
      .trim() 
      .replace(/[^\w,]/g, "") 
      .replace(/\s+/g, "_"); 

    return cleanedLine; 
  }

  return ""; 
}

const getModelNames = async (): Promise<string[]> => {
  const schemaPath = path.join(__dirname, "../../prisma/schema.prisma");
  const schema = fs.readFileSync(schemaPath, "utf8");

  const dmmf = await getDMMF({ datamodel: schema });

  return dmmf.datamodel.models.map((model) => model.name);
};

async function main() {
  const tables: string[] = await getModelNames().catch(() => []);
  if (tables.length === 0) {
    console.log("--->ERROR: No tables found in the Prisma schema.");
    process.exit(1);
  }

  for (const element of tables) {
    const client = await pool.connect();
    try {
      const filepath: string = path.join(__dirname, `${element}.csv`);
      if (!fs.existsSync(filepath)) {
        console.log(`no such file: ${filepath}`);
        continue;
      } else {
        const firstLine = await getFirstLine(filepath); 

        // const firstLine: string = await getFirstLine(filepath);
        console.log(firstLine);
        const fillQuery: string = `COPY ${element} (${firstLine}) FROM '${filepath}' WITH CSV HEADER`;
        console.log(fillQuery);


        const dropQuery: string = `TRUNCATE TABLE ${element};`;
        await client.query(dropQuery);


        await client.query(fillQuery);
      }
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      client.release();
    }
  }
}

main().catch(console.error);
