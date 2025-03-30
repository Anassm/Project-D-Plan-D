import { FastifyInstance } from "fastify";
import { getAllDataFromTable } from "../controllers/touchpointsController";
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

function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

export const showRoutes = (server: FastifyInstance) => {
  server.get("/api/show/:table/:number", async (request, reply) => {
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

  server.get("/api/show/:table", async (request, reply) => {
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

  server.get("/get/:table/:filters", async (request, reply) => {
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
