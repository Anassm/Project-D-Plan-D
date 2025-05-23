import bcrypt from "bcrypt";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import {
  GetAllFlightsInWindow,
  GetFlightsByAircraftType,
  GetFlightsByAirline,
  GetFlightsByFlightNumber,
  GetFlightsByTouchpoint,
  GetFlightsByFlightID,
} from "../controllers/touchpointsController";
import { Pool } from "pg";
import dotenv from "dotenv";
import { AddFlight } from "../controllers/touchpointsController";
import { DeleteFlightByID } from "../controllers/touchpointsController";
import { UpdateFlightByID } from "../controllers/touchpointsController";
import test from "node:test";

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

export default async function touchpointRoutes(
  server: FastifyInstance,
  opts: FastifyPluginOptions
) {
  server.post("/post/login", async (request, reply) => {
    const { username, password } = request.body as {
      username: string;
      password: string;
    };
    const testHash = await bcrypt.hash(password, 10);
    console.log(testHash);

    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = result.rows[0];

      if (!user) {
        return reply
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      const doesPasswordMatch = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!doesPasswordMatch) {
        return reply
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      const token = server.jwt.sign({
        id: user.id,
        username: user.username,
      });

      return reply.send({ token });
    } catch (e) {
      return reply.status(500).send({ message: e });
    }
  });

  // Route to get data between two times on a specific date http://localhost:3000/api/touchpoint/window?date=2024-09-29&from=14:00&to=15:00
  server.get(
    "/api/touchpoint/window",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { date, from, to } = request.query as {
          date: string;
          from: string;
          to: string;
        };

        if (!date || !from || !to) {
          return reply
            .status(400)
            .send({ error: "Missing date, from, or to query params" });
        }
        const data = await GetAllFlightsInWindow(date, from, to);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // Route to get data by Flight Number http://localhost:3000/api/touchpoint/flightnumber?flightNumber=PGT1261
  server.get(
    "/api/touchpoint/flightnumber",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { flightNumber } = request.query as { flightNumber: string };
        if (!flightNumber) {
          return reply
            .status(400)
            .send({ error: "Missing flightNumber query param" });
        }
        const data = await GetFlightsByFlightNumber(flightNumber);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // Route to get data by Airline http://localhost:3000/api/touchpoint/airline?airlineShortname=PEGASUS
  server.get(
    "/api/touchpoint/airline",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { airlineShortname } = request.query as {
          airlineShortname: string;
        };
        if (!airlineShortname) {
          return reply
            .status(400)
            .send({ error: "Missing airlineShortname query param" });
        }
        const data = await GetFlightsByAirline(airlineShortname);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  // Route to get data by Touchpoint http://localhost:3000/api/touchpoint/touchpoint?touchpoint=Aankomsthal
  server.get(
    "/api/touchpoint/touchpoint",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { touchpoint } = request.query as { touchpoint: string };
        if (!touchpoint) {
          return reply
            .status(400)
            .send({ error: "Missing touchpoint query param" });
        }
        const data = await GetFlightsByTouchpoint(touchpoint);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  // Route to get data by Aircraft Type http://localhost:3000/api/touchpoint/aircraft?aircraftType=A320N
  server.get(
    "/api/touchpoint/aircraft",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { aircraftType } = request.query as { aircraftType: string };
        if (!aircraftType) {
          return reply
            .status(400)
            .send({ error: "Missing aircraftType query param" });
        }
        const data = await GetFlightsByAircraftType(aircraftType);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  // Route to get data by Flight ID http://localhost:3000/api/touchpoint/flightid?flightID=585146
  server.get(
    "/api/touchpoint/flightid",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { flightID } = request.query as { flightID: string };
        if (!flightID) {
          return reply
            .status(400)
            .send({ error: "Missing flightID query param" });
        }
        const data = await GetFlightsByFlightID(flightID);
        reply.send(data);
      } catch (err) {
        console.error("Error:", err);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  // TIJDELIJK VERWIJDER LATER
  server.get("/health", async (req, res) => {
    res.status(200).send("OK");
  });

  // add
  // http://localhost:3000/api/touchpoint/add
  // to test in postman make a json in the body with the new touchPoint

  server.post("/api/touchpoint/add", { preValidation: [server.authenticate] }, async (request, reply) => {
    try {
      // Save new flight data
      const newFlight = await AddFlight(request.body);
      reply.send({
        message: "Flight added",
        // Return inserted flight row
        data: newFlight
      });
    } catch (err) {
      reply.status(500).send({ error: "Failed to add flight", details: (err as any).message });
    }
  });

  // delete touchPoint by FlightID
  // http://localhost:3000/api/touchpoint/delete?flightid=(id of flight to delete) 
  server.delete(
    "/api/touchpoint/delete",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        // Extract flightid from query
        const { flightid } = request.query as { flightid: string };

        if (!flightid) {
          return reply
            .status(400)
            .send({ error: "Missing flightID query param" });
        }

        const deletedFlight = await DeleteFlightByID(flightid);

        if (!deletedFlight) {
          return reply.status(404).send({ error: "Flight not found" });
        }

        reply.send({
          message: "Flight deleted successfully",
          data: deletedFlight,
        });
      } catch (err) {
        console.error("Error deleting flight:", err);
        reply
          .status(500)
          .send({ error: "Failed to delete flight", details: (err as any).message });
      }
    }
  );

  // Update a flight by FlightID
  // PUT http://localhost:3000/api/touchpoint/update?flightid=(flightid to update)
  // to test use postman, make a json in the body and add the items to change.
  server.put(
    "/api/touchpoint/update",
    { preValidation: [server.authenticate] },
    async (request, reply) => {
      try {
        const { flightid } = request.query as { flightid: string };

        if (!flightid) {
          return reply
            .status(400)
            .send({ error: "Missing flightID query param" });
        }

        const updatedFlight = await UpdateFlightByID(flightid, request.body as Partial<any>);

        if (!updatedFlight) {
          return reply.status(404).send({ error: "Flight not found" });
        }

        reply.send({
          message: "Flight updated successfully",
          data: updatedFlight,
        });
      } catch (err) {
        console.error("Error updating flight:", err);
        reply.status(500).send({ error: "Failed to update flight", details: (err as any).message });
      }
    }
  );

}

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
