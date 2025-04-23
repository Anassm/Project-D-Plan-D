import { FastifyInstance } from "fastify";
import { 
  GetAllFlightsInWindow,
  GetFlightsByAircraftType,
  GetFlightsByAirline,
  GetFlightsByFlightNumber,
  GetFlightsByTouchpoint,
  GetFlightsByFlightID
 } from "../controllers/touchpointsController";
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


export const touchpointRoutes = (server: FastifyInstance) => {
  // Route to get data between two times on a specific date
  server.get("/api/touchpoint/window", async (request, reply) => {
    try {
      const { date, from, to } = request.query as {
        date: string;
        from: string;
        to: string;
      };

      if (!date || !from || !to) {
        return reply.status(400).send({ error: "Missing date, from, or to query params" });
      }
      const data = await GetAllFlightsInWindow(date, from, to);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
  // Route to get data by Flight Number
  server.get("/api/touchpoint/flightnumber", async (request, reply) => {
    try {
      const { flightNumber } = request.query as { flightNumber: string };
      if (!flightNumber) {
        return reply.status(400).send({ error: "Missing flightNumber query param" });
      }
      const data = await GetFlightsByFlightNumber(flightNumber);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
  // Route to get data by Airline
  server.get("/api/touchpoint/airline", async (request, reply) => {
    try {
      const { airlineShortname } = request.query as { airlineShortname: string };
      if (!airlineShortname) {
        return reply.status(400).send({ error: "Missing airlineShortname query param" });
      }
      const data = await GetFlightsByAirline(airlineShortname);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
    // Route to get data by Touchpoint
    server.get("/api/touchpoint/touchpoint", async (request, reply) => {
      try {
        const { touchpoint } = request.query as { touchpoint: string };
        if (!touchpoint) {
          return reply.status(400).send({ error: "Missing touchpoint query param" });
        }
        const data = await GetFlightsByTouchpoint(touchpoint);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    });
      // Route to get data by Aircraft Type
  server.get("/api/touchpoint/aircraft", async (request, reply) => {
    try {
      const { aircraftType } = request.query as { aircraftType: string };
      if (!aircraftType) {
        return reply.status(400).send({ error: "Missing aircraftType query param" });
      }
      const data = await GetFlightsByAircraftType(aircraftType);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
  // Route to get data by Flight ID
  server.get("/api/touchpoint/flightid", async (request, reply) => {
    try {
      const { flightID } = request.query as { flightID: string };
      if (!flightID) {
        return reply.status(400).send({ error: "Missing flightID query param" });
      }
      const data = await GetFlightsByFlightID(flightID);
      reply.send(data);
    } catch (err) {
      console.error("Error:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });
};





















// function isNumeric(str: string): boolean {
//   return /^[0-9]+$/.test(str);
// }
// server.get("/api/show/:table/:number", async (request, reply) => {
//   try {
//     const { table, number } = request.params as {
//       table: string;
//       number: number;
//     };
//     const data = await getAllDataFromTable(table, number);
//     reply.send(data);
//   } catch (err) {
//     console.error("Error:", err);
//     reply.status(500).send({ error: "Internal server error" });
//   }
// });
// server.get("/api/show/:table", async (request, reply) => {
//   try {
//     const { table, number } = request.params as {
//       table: string;
//       number: number;
//     };
//     const data = await getAllDataFromTable(table);
//     reply.send(data);
//   } catch (err) {
//     console.error("Error:", err);
//     reply.status(500).send({ error: "Internal server error" });
//   }
// });

// server.get("/get/:table/:filters", async (request, reply) => {
//   try {
//     //database connection setup
//     const Client = await pool.connect();
//     //get the table and filters from the request (URL)
//     const { table, filters } = request.params as { table: string, filters: string };
//     //split the filters into an array
//     const filters_split: String[] = filters.split(";");
//     //initialize the query
//     let Query: string = `SELECT * FROM ${table}`;
//     //loop through the filters
//     //add the filters to the query 1 by 1
//     for (let i = 0; i < filters_split.length; i++) {
//       if (filters_split.length == 0) {
//         break;
//       }
//       //add where (only first time)
//       if (filters_split.length >= 1 && i == 0) {
//         const filter = filters_split[i].split("=");
//         if (isNumeric(filter[1])) {
//           Query += ` WHERE ${filter[0]} = ${filter[1]}`;
//         }
//         else {
//           Query += ` WHERE ${filter[0]} = '${filter[1]}'`;
//         }
//       }
//       //add AND + filter for the rest
//       else {
//         const filter = filters_split[i].split("=");
//         if (isNumeric(filter[1])) {
//           Query += ` AND ${filter[0]} = ${filter[1]}`;
//         }
//         else {
//           Query += ` AND ${filter[0]} = '${filter[1]}'`;
//         }
//       }
//     }
//     //get the data from db with the created query
//     // limit to 10 rows (so browser can show it, if you want to show more, remove the limit)
//     //use command in terminal: 'curl http://localhost:3000/get/tableName/columnName=filterValue' (if you get too many values for browser)
//     const data = (await Client.query(Query + ` LIMIT 10`)).rows;
//     //send the data with API
//     reply.send(data);
//     //catch errors
//   } catch (err) {
//     //log the error
//     console.error("Error:", err);
//     //send a status 500 with error message
//     reply.status(500).send({ error: err });
//   }
// });
