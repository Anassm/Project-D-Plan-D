import { Pool } from "pg";
import dotenv from "dotenv";
import { DateTime } from "luxon";

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


export async function GetAllFlightsInWindow(
  datum: string,              // verwacht nu "2024-09-29"
  vanTijd: string,            // verwacht nu "14:00"
  totTijd: string             // verwacht nu "15:00"
): Promise<JSON> {
  try {
    //database connection setup
    const db = await pool.connect();

    // Voeg de tijd toe aan de datum in het juiste formaat
    const vanDateStr = `${datum}T${vanTijd}`;
    const totDateStr = `${datum}T${totTijd}`;

    // Maak de datums
    const van = DateTime.fromFormat(`${datum} ${vanTijd}`, "yyyy-MM-dd HH:mm", { zone: "Europe/Amsterdam" }).plus({ hours: 2 });
    const tot = DateTime.fromFormat(`${datum} ${totTijd}`, "yyyy-MM-dd HH:mm", { zone: "Europe/Amsterdam" }).plus({ hours: 2 });

    const vanUTC = van.toUTC().toISO();
    const totUTC = tot.toUTC().toISO();
    // Controleer of de datums valide zijn
    if (!van.isValid || !tot.isValid) {
      console.log("Invalid date(s):", van.toISO(), tot.toISO());
    }

    // Voer de database query uit
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE ScheduledLocal BETWEEN $1 AND $2`,
      [van, tot]
    );

    return res.rows as unknown as JSON;
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByFlightNumber(flightNumber: string): Promise<JSON> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE FlightNumber = $1`,
      [flightNumber]
    );
    return Promise.resolve(res.rows as unknown as JSON);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByAirline(airlineShortname: string): Promise<JSON> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE AirlineShortname = $1`,
      [airlineShortname]
    );
    return Promise.resolve(res.rows as unknown as JSON);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByTouchpoint(touchpoint: string): Promise<JSON> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE Touchpoint = $1`,
      [touchpoint]
    );
    return Promise.resolve(res.rows as unknown as JSON);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByAircraftType(aircraftType: string): Promise<JSON> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE AircraftType = $1`,
      [aircraftType]
    );
    return Promise.resolve(res.rows as unknown as JSON);
  } catch (err) {
    throw err;
  }
}

export async function GetFlightsByFlightID(flightID: string): Promise<JSON> {
  try {
    const db = await pool.connect();
    const res = await db.query(
      `SELECT * FROM touchpoint WHERE FlightID = $1`,
      [flightID]
    );
    return Promise.resolve(res.rows as unknown as JSON);
  } catch (err) {
    throw err;
  }
}

