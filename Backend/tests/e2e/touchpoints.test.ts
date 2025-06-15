jest.unmock("pg");
import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "./helper/setup";
import { getAuthTokenAdmin } from "./helper/authHelper";

describe("Testing Touchpoint endpoints", () => {
  it("`/api/touchpoint/window`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/window")
      .set("Authorization", `Bearer ${token}`)
      .query({ date: "2024-09-29", from: "14:00", to: "15:00" });

    expect(res.status).toBe(200);
  });

  it("`/api/touchpoint/flightnumber`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/flightnumber")
      .set("Authorization", `Bearer ${token}`)
      .query({ flightNumber: "TRA5690" });

    expect(res.status).toBe(200);
  });

  it("`/api/touchpoint/airline`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/airline")
      .set("Authorization", `Bearer ${token}`)
      .query({ airlineShortname: "LUXAIR" });

    expect(res.status).toBe(200);
  });

  it("`/api/touchpoint/touchpoint`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/touchpoint")
      .set("Authorization", `Bearer ${token}`)
      .query({ touchpoint: "Niet-Schengenhal" });

    expect(res.status).toBe(200);
  });

  it("`/api/touchpoint/aircraft`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/aircraft")
      .set("Authorization", `Bearer ${token}`)
      .query({ aircraftType: "CRJ900" });

    expect(res.status).toBe(200);
  });

  it("`/api/touchpoint/flightid`", async () => {
    const token = await getAuthTokenAdmin();

    const res = await request(app.server)
      .get("/api/touchpoint/flightid")
      .set("Authorization", `Bearer ${token}`)
      .query({ flightID: "638004" });

    expect(res.status).toBe(200);
  });
});
