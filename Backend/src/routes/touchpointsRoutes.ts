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
  max: 30
});

const flightSchema = {
  flightid: { type: "integer", example: 585146 },
  timetableid: { type: "integer", example: 609092 },
  flightnumber: { type: "string", example: "PGT1261" },
  traffictype: { type: "string", example: "A" },
  scheduledlocal: {
    type: "string",
    format: "date-time",
    example: "2024-01-01T12:25:00.000Z",
  },
  airlineshortname: { type: "string", example: "PEGASUS" },
  aircrafttype: { type: "string", example: "A320N" },
  airport: { type: "string", example: "Istanbul" },
  country: { type: "string", example: "Turkey" },
  paxforecast: { type: "integer", example: 175 },
  touchpoint: { type: "string", example: "Aankomsthal" },
  touchpointtime: {
    type: "string",
    format: "date-time",
    example: "2024-01-01T12:35:00.000Z",
  },
  touchpointpax: { type: "number", example: 17.5 },
  actuallocal: {
    type: "string",
    format: "date-time",
    example: "2024-01-01T12:14:00.000Z",
  },
  paxactual: { type: ["integer", "null"], example: null },
};

export default async function touchpointRoutes(
  server: FastifyInstance,
  opts: FastifyPluginOptions
) {
  server.post(
    "/post/login",
    {
      schema: {
        description: "Authenticate user and get JWT token",
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };
      // const testHash = await bcrypt.hash(password, 10);
      // console.log(testHash);

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
          role: user.role,
        });

        return reply.send({ token });
      } catch (e) {
        return reply.status(500).send({ message: e });
      }
    }
  );

  server.post(
    "/post/create_account",
    // { preValidation: [server.authenticate, server.authorizeRoles(["administrator"])] },
    async (request, reply) => {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      if (!username || !password) {
        return reply
          .status(400)
          .send({ error: "Missing username or password" });
      }

      try {
        const checkUser = await pool.query(
          "SELECT 1 FROM users WHERE username = $1",
          [username]
        );

        if (!checkUser) {
          reply.status(500).send({ error: "Internal server error" });
        }

        if (checkUser.rowCount && checkUser.rowCount > 0) {
          return reply
            .status(409)
            .send({ error: "ERROR: Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
          `INSERT INTO users (username, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, username, role`,
          [username, hashedPassword, "employee"]
        );

        const newUser = result.rows[0];

        reply.status(201).send({
          message: "Account created successfully",
          user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
          },
        });
      } catch (error) {
        console.error("Error creating account:", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.put(
    "/put/update_role",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles(["head_administrator"]),
      ],
    },
    async (request, reply) => {
      const { username, newRole } = request.body as {
        username: string;
        newRole: string;
      };

      const validRoles = ["employee", "administrator", "head_administrator"];

      if (!username || !newRole) {
        return reply.status(400).send({
          error: "ERROR: Missing username or newRole in request body",
        });
      }

      if (!validRoles.includes(newRole)) {
        return reply.status(400).send({
          error:
            "ERROR: specified role was invalid! Valid roles are: employee, administrator, head_administrator",
        });
      }

      try {
        const result = await pool.query(
          `UPDATE users SET role = $1 WHERE username = $2 RETURNING id, username, role`,
          [newRole, username]
        );

        if (result.rowCount === 0) {
          return reply.status(404).send({ error: "User not found" });
        }

        reply.send({
          message: `Role updated successfully`,
          user: result.rows[0],
        });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "ERROR: Internal server error" });
      }
    }
  );

  // Route to get data between two times on a specific date https://localhost:3000/api/touchpoint/window?date=2024-09-29&from=14:00&to=15:00
  server.get(
    "/api/touchpoint/window",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles([
          "employee",
          "administrator",
          "head_administrator",
        ]),
      ],
      schema: {
        description: "Get flights within a time window on a specific date",
        tags: ["Touchpoints"],
        querystring: {
          type: "object",
          required: ["date", "from", "to"],
          properties: {
            date: { type: "string", format: "date", description: "YYYY-MM-DD" },
            from: { type: "string", description: "XX:XX" },
            to: { type: "string", description: "XX:XX" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: flightSchema,
            },
          },
        },
      },
    },
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

  // Route to get data by Flight Number https://localhost:3000/api/touchpoint/flightnumber?flightNumber=PGT1261
  server.get(
    "/api/touchpoint/flightnumber",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles([
          "employee",
          "administrator",
          "head_administrator",
        ]),
      ],
      schema: {
        description: "Get flights by flight number",
        tags: ["Touchpoints"],
        querystring: {
          type: "object",
          required: ["flightNumber"],
          properties: {
            flightNumber: { type: "string", description: "TRA5690" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: flightSchema,
            },
          },
        },
      },
    },
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

  // Route to get data by Airline https://localhost:3000/api/touchpoint/airline?airlineShortname=PEGASUS
  server.get(
    "/api/touchpoint/airline",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles([
          "employee",
          "administrator",
          "head_administrator",
        ]),
      ],
      schema: {
        description: "Get flights by airline short name",
        tags: ["Touchpoints"],
        querystring: {
          type: "object",
          required: ["airlineShortname"],
          properties: {
            airlineShortname: { type: "string", description: "LUXAIR" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: flightSchema,
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
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

  // Route to get data by Touchpoint https://localhost:3000/api/touchpoint/touchpoint?touchpoint=Aankomsthal
  server.get(
    "/api/touchpoint/touchpoint",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles([
          "employee",
          "administrator",
          "head_administrator",
        ]),
      ],
      schema: {
        description: "Get flights by touchpoint",
        tags: ["Touchpoints"],
        querystring: {
          type: "object",
          required: ["touchpoint"],
          properties: {
            touchpoint: { type: "string", description: "Niet-Schengenhal" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: flightSchema,
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
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

  // Route to get data by Aircraft Type https://localhost:3000/api/touchpoint/aircraft?aircraftType=A320N
  server.get(
    "/api/touchpoint/aircraft",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles([
          "employee",
          "administrator",
          "head_administrator",
        ]),
      ],
      schema: {
        description: "Get flights by aircraft type",
        tags: ["Touchpoints"],
        querystring: {
          type: "object",
          required: ["aircraftType"],
          properties: {
            aircraftType: { type: "string", description: "CRJ900" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: flightSchema,
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
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

  // Route to get data by Flight ID https://localhost:3000/api/touchpoint/flightid?flightID=585146
  server.get(
    "/api/touchpoint/flightid",
    {
      preValidation: [
        server.authenticate,
        server.authorizeRoles(["head_administrator"]),
      ],
      schema: {
        description: "Get flights by flight ID",
        tags: ["Touchpoints"],
        querystring: {
          type: "object",
          required: ["flightID"],
          properties: {
            flightID: { type: "string", description: "638004" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: flightSchema,
            },
          },
          403: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
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

  // TIJDELIJK
  server.get("/health", async (req, res) => {
    res.status(200).send("OK");
  });
}
