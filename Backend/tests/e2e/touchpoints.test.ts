jest.unmock("pg");
import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "./helper/setup";
import { getAuthTokenAdmin } from "./helper/authHelper";
import { TTouchpoint } from "./helper/touchpoint.types";
import { isTouchpoint } from "./helper/methods";

describe("Testing all Touchpoint endpoints regularly on 200", () => {
  it("`/api/touchpoint/window`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/window")
      .set("Authorization", `Bearer ${token}`)
      .query({ date: "2024-09-29", from: "14:00", to: "15:00" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((item: any) => {
      expect(isTouchpoint(item)).toBe(true);
    });
  });

  it("`/api/touchpoint/flightnumber`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/flightnumber")
      .set("Authorization", `Bearer ${token}`)
      .query({ flightNumber: "TRA5690" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((item: any) => {
      expect(isTouchpoint(item)).toBe(true);
    });
  });

  it("`/api/touchpoint/airline`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/airline")
      .set("Authorization", `Bearer ${token}`)
      .query({ airlineShortname: "LUXAIR" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((item: any) => {
      expect(isTouchpoint(item)).toBe(true);
    });
  });

  it("`/api/touchpoint/touchpoint`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/touchpoint")
      .set("Authorization", `Bearer ${token}`)
      .query({ touchpoint: "Niet-Schengenhal" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((item: any) => {
      expect(isTouchpoint(item)).toBe(true);
    });
  });

  it("`/api/touchpoint/aircraft`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/aircraft")
      .set("Authorization", `Bearer ${token}`)
      .query({ aircraftType: "CRJ900" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((item: any) => {
      expect(isTouchpoint(item)).toBe(true);
    });
  });

  it("`/api/touchpoint/flightid`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/flightid")
      .set("Authorization", `Bearer ${token}`)
      .query({ flightID: "638004" });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach((item: any) => {
      expect(isTouchpoint(item)).toBe(true);
    });
  });
});

describe("Specific tests following test plan", () => {
  it("test false input on 400 error code", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/flightid")
      .set("Authorization", `Bearer ${token}`);
    // Impediment:
    // On non-existing input it returns an empty array so still returns 200
    // Workaround is to instead return no query at all

    expect(res.status).toBe(400);
  });

  it("Call a non-existing endpoint", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server).get("/api/verycoolendpoint");

    expect(res.status).toBe(404);
  });

  it("Force an internal error and expect 500 error code", async () => {
    const token = await getAuthTokenAdmin();

    const originalError = console.error;
    console.error = () => {};

    const res = await request(app.server)
      .get("/api/touchpoint/flightid")
      .set("Authorization", `Bearer ${token}`)
      .query({ flightID: "causeerror" });

    console.error = originalError;

    expect(res.status).toBe(500);
  });
});
