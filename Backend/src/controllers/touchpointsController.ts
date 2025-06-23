import { Pool } from "pg";

import dotenv from "dotenv";

export interface Flight {
  flightid: number;
  timetableid: number;
  flightnumber: string;
  traffictype: string;
  scheduledlocal: string;
  airlineshortname: string;
  aircrafttype: string;
  airport: string;
  country: string;
  paxforecast: number;
  touchpoint: string;
  touchpointtime: string;
  touchpointpax: number;
  actuallocal: string;
  paxactual: number | null;
}

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

export async function GetAllFlightsInWindow(
  datum: string, // verwacht nu bv 2024-09-29
  vanTijd: string, // verwacht nu bv 14:00
  totTijd: string // verwacht nu bv 15:00
): Promise<Flight[]> {
  try {
    const db = await pool.connect();

    // Maak de datums
    let van = new Date(`${datum}T${vanTijd}`);
    let tot = new Date(`${datum}T${totTijd}`);

    van.setHours(van.getHours() + 2);
    tot.setHours(tot.getHours() + 2);

    if (isNaN(van.getTime()) || isNaN(tot.getTime())) {
      console.log("Invalid van or tot date:", van, tot);
    }

    const res = await db.query(
      `SELECT * FROM touchpoint WHERE ScheduledLocal BETWEEN $1 AND $2`,
      [van.toISOString(), tot.toISOString()]
    );

    return res.rows;
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByFlightNumber(
  flightNumber: string
): Promise<Flight[]> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE FlightNumber = $1`,
      [flightNumber]
    );
    return Promise.resolve(res.rows);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByAirline(
  airlineShortname: string
): Promise<Flight[]> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE AirlineShortname = $1`,
      [airlineShortname]
    );
    return Promise.resolve(res.rows);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByTouchpoint(
  touchpoint: string
): Promise<Flight[]> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE Touchpoint = $1`,
      [touchpoint]
    );
    return Promise.resolve(res.rows);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByAircraftType(
  aircraftType: string
): Promise<Flight[]> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE AircraftType = $1`,
      [aircraftType]
    );
    return Promise.resolve(res.rows);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByFlightID(flightID: string): Promise<Flight[]> {
  try {
    const db = await pool.connect();
    const res = await db.query(`SELECT * FROM touchpoint WHERE FlightID = $1`, [
      flightID,
    ]);
    return Promise.resolve(res.rows);
  } catch (err) {
    throw err;
  }
}

// add touchpoints
export async function AddFlight(data: any): Promise<any> {
  try {
    const db = await pool.connect();

    // Define SQL INSERT query with parameterized values
    const query = `
      INSERT INTO touchpoint (
        flightid, timetableid, flightnumber, traffictype, scheduledlocal, airlineshortname,
        aircrafttype, airport, country, paxforecast, touchpoint, touchpointtime,
        touchpointpax, actuallocal, paxactual
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15
      ) RETURNING *;
    `;

    // incoming data
    const values = [
      data.flightid, data.timetableid, data.flightnumber, data.traffictype, data.scheduledlocal, data.airlineshortname,
      data.aircrafttype, data.airport, data.country, data.paxforecast, data.touchpoint, data.touchpointtime,
      data.touchpointpax, data.actuallocal, data.paxactual
    ];
    const result = await db.query(query, values);
    db.release();
    return result.rows[0];
  } catch (err) {
    throw err;
  }
}



// delete a touchPoint by id
export async function DeleteFlightByID(flightID: string): Promise<any> {
  try {
    const db = await pool.connect();
    const result = await db.query(
      `DELETE FROM touchpoint WHERE FlightID = $1 RETURNING *`,
      [flightID]
    );
    db.release();
    // return the deleted row or null
    return result.rows[0] || null;
  } catch (err) {
    throw err;
  }
}


// update/put
export async function UpdateFlightByID(flightID: string, data: Partial<any>): Promise<any> {
  try {
    const db = await pool.connect();

    // get keys of fields to update
    const keys = Object.keys(data);
    if (keys.length === 0) {
      throw new Error("No fields provided to update.");
    }

    // Build an array of "field = $index" expressions for SQL SET clause
    const setClauses = keys.map((key, idx) => `${key} = $${idx + 2}`);
    // Create values array: [flightID, ...updated values]
    const values = [flightID, ...keys.map(key => data[key])];

    const query = `
      UPDATE touchpoint
      SET ${setClauses.join(', ')}
      WHERE FlightID = $1
      RETURNING *;
    `;

    const result = await db.query(query, values);
    db.release();

    return result.rows[0] || null; // Return updated row or null if not found
  } catch (err) {
    throw err;
  }
}