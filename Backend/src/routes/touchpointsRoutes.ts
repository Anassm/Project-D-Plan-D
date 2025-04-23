import bcrypt from 'bcrypt';
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { getAllDataFromTable } from "../controllers/touchpointsController";
import { Pool } from "pg";
import dotenv from "dotenv";
import test from 'node:test';

dotenv.config();

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_URL,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
  ssl: {
    rejectUnauthorized: false // for dev use; true if you use a real cert
  }
});

function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

export default async function showRoutes(server: FastifyInstance, opts: FastifyPluginOptions) {
  server.post("/post/login", async (request, reply) => {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };
    const testHash = await bcrypt.hash(password, 10);
    console.log(testHash);

    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        return reply.status(401).send({ message:'Invalid username or password' });
      }

      const doesPasswordMatch = await bcrypt.compare(password, user.password_hash);

      if (!doesPasswordMatch) {
        return reply.status(401).send({ message:'Invalid username or password' });
      }
      
      const token = server.jwt.sign({
        id: user.id,
        username: user.username
      });

      return reply.send({ token });

    }
    catch (e) {
      return reply.status(500).send({ message: e });
    }
  });

  server.get("/api/show/:table/:number", { preValidation: [server.authenticate] }, async (request, reply) => {
    try {
      const { table, number } = request.params as {
        table: string;
        number: number;
      };
      const data = await getAllDataFromTable(table, number);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  server.get("/api/show/:table", { preValidation: [server.authenticate] }, async (request, reply) => {
    try {
      const { table, number } = request.params as {
        table: string;
        number: number;
      };
      const data = await getAllDataFromTable(table);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  server.get("/get/:table/:filters", { preValidation: [server.authenticate] }, async (request, reply) => {
    try {
      //database connection setup
      const Client = await pool.connect();
      //get the table and filters from the request (URL)
      const { table, filters } = request.params as { table: string, filters: string};
      //split the filters into an array
      const filters_split: String[] = filters.split(";");
      //initialize the query
      let Query: string = `SELECT * FROM ${table}`;
      //loop through the filters
      //add the filters to the query 1 by 1
      for (let i = 0; i < filters_split.length; i++) {
        if (filters_split.length == 0) {
          break;
        }
        //add where (only first time)
        if (filters_split.length >= 1  && i == 0) {
          const filter = filters_split[i].split("=");
          if (isNumeric(filter[1])) {
            Query +=` WHERE ${filter[0]} = ${filter[1]}`;
          }
          else{
            Query +=` WHERE ${filter[0]} = '${filter[1]}'`;
          }
        }
        //add AND + filter for the rest
        else{
          const filter = filters_split[i].split("=");
          if(isNumeric(filter[1])){
            Query += ` AND ${filter[0]} = ${filter[1]}`;
          }
          else{
            Query += ` AND ${filter[0]} = '${filter[1]}'`;
          }
        }
      }
        //get the data from db with the created query
        // limit to 10 rows (so browser can show it, if you want to show more, remove the limit)
        //use command in terminal: 'curl http://localhost:3000/get/tableName/columnName=filterValue' (if you get too many values for browser)
        const data = (await Client.query(Query+ ` LIMIT 10`)).rows;
        //send the data with API
        reply.send(data);
      //catch errors
      } catch (err) {
        //log the error
        console.error("Error:", err);
        //send a status 500 with error message
        reply.status(500).send({ error: err });
      }
    });
};
