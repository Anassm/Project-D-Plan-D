import {
    describe,
    expect,
    jest,
    test,
    beforeEach
} from "@jest/globals";
import {
    GetAllFlightsInWindow,
    GetFlightsByFlightNumber,
    GetFlightsByAirline,
    GetFlightsByTouchpoint,
    GetFlightsByAircraftType,
    GetFlightsByFlightID,
    AddFlight,
    DeleteFlightByID,
    UpdateFlightByID,
} from "../../src/controllers/touchpointsController";
// @ts-ignore
import { mockQuery } from "../../__mocks__/pg.ts"; // Import mockQuery directly from your mock file

jest.mock("pg"); // Activate mocking

describe("touch point data tests", () => {
    beforeEach(() => {
        mockQuery.mockClear();
    });

    test("GetAllFlightsInWindow should return flights within a time window", async () => {
        const mockFlight = {
            flightid: 627438,
            timetableid: 711662,
            flightnumber: "TRA5690",
            traffictype: "A",
            scheduledlocal: "2024-09-29T10:30:00.000Z",
            airlineshortname: "TRANSAVIA",
            aircrafttype: "B737W7",
            airport: "Ibiza",
            country: "Spain",
            paxforecast: 145,
            touchpoint: "Aankomsthal",
            touchpointtime: "2024-09-29T10:40:00.000Z",
            touchpointpax: 145,
            actuallocal: "2024-09-29T10:25:00.000Z",
            paxactual: null,
        };

        const mockResult = [mockFlight];
        mockQuery.mockResolvedValue({ rows: mockResult });

        const result = await GetAllFlightsInWindow("2024-09-29", "10:00", "11:00");

        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM touchpoint WHERE ScheduledLocal BETWEEN $1 AND $2`,
            ["2024-09-29T10:00:00.000Z", "2024-09-29T11:00:00.000Z"]
        );
        expect(result[0]).toEqual(mockFlight);
    });

    test("GetFlightsByFlightNumber should return matching flight", async () => {
        const mockFlight = {
            flightid: 638004,
            timetableid: 771440,
            flightnumber: "TFL1611",
            traffictype: "D",
            scheduledlocal: "2024-12-22T07:55:00.000Z",
            airlineshortname: "TUI FLY",
            aircrafttype: "B737W8",
            airport: "Arrecife",
            country: "Spain",
            paxforecast: 194,
            touchpoint: "Passagehal",
            touchpointtime: "2024-12-22T05:45:00.000Z",
            touchpointpax: 9.7,
            actuallocal: "2024-12-22T08:02:00.000Z",
            paxactual: null,
        };

        const mockResult = [mockFlight];
        mockQuery.mockResolvedValue({ rows: mockResult });

        const result = await GetFlightsByFlightNumber("TFL1611");

        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM touchpoint WHERE FlightNumber = $1`,
            ["TFL1611"]
        );
        expect(result[0]).toEqual(mockFlight);
    });

    test("GetFlightsByAirline should return flights by airline", async () => {
        const mockFlight = {
            flightid: 635636,
            timetableid: 771258,
            flightnumber: "LGL8722",
            traffictype: "D",
            scheduledlocal: "2024-11-29T19:55:00.000Z",
            airlineshortname: "LUXAIR",
            aircrafttype: "DHC8-4",
            airport: "Luxembourg",
            country: "Luxembourg",
            paxforecast: 18,
            touchpoint: "Passagehal",
            touchpointtime: "2024-11-29T17:45:00.000Z",
            touchpointpax: 0.9,
            actuallocal: "2024-11-29T19:50:00.000Z",
            paxactual: null,
        };

        const mockResult = [mockFlight];
        mockQuery.mockResolvedValue({ rows: mockResult });

        const result = await GetFlightsByAirline("LUXAIR");

        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM touchpoint WHERE AirlineShortname = $1`,
            ["LUXAIR"]
        );
        expect(result[0]).toEqual(mockFlight);
    });

    test("GetFlightsByTouchpoint should return flights by touchpoint", async () => {
        const mockFlight = {
            flightid: 585154,
            timetableid: 607099,
            flightnumber: "TRA5591",
            traffictype: "D",
            scheduledlocal: "2024-01-01T06:45:00.000Z",
            airlineshortname: "TRANSAVIA",
            aircrafttype: "B737W8",
            airport: "Al-Hoceima",
            country: "Marokko",
            paxforecast: 168,
            touchpoint: "Niet-Schengenhal",
            touchpointtime: "2024-01-01T05:15:00.000Z",
            touchpointpax: 8.4,
            actuallocal: "2024-01-01T06:59:00.000Z",
            paxactual: null,
        };

        const mockResult = [mockFlight];
        mockQuery.mockResolvedValue({ rows: mockResult });

        const result = await GetFlightsByTouchpoint("Niet-Schengenhal");

        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM touchpoint WHERE Touchpoint = $1`,
            ["Niet-Schengenhal"]
        );
        expect(result[0]).toEqual(mockFlight);
    });

    test("GetFlightsByAircraftType should return flights by aircraft type", async () => {
        const mockFlight = {
            flightid: 585146,
            timetableid: 609902,
            flightnumber: "PGT1261",
            traffictype: "A",
            scheduledlocal: "2024-01-01T12:25:00.000Z",
            airlineshortname: "PEGASUS",
            aircrafttype: "A320N",
            airport: "Istanbul",
            country: "Turkey",
            paxforecast: 175,
            touchpoint: "Aankomsthal",
            touchpointtime: "2024-01-01T12:35:00.000Z",
            touchpointpax: 175,
            actuallocal: "2024-01-01T12:14:00.000Z",
            paxactual: null,
        };

        const mockResult = [mockFlight];
        mockQuery.mockResolvedValue({ rows: mockResult });

        const result = await GetFlightsByAircraftType("A320N");

        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM touchpoint WHERE AircraftType = $1`,
            ["A320N"]
        );
        expect(result[0]).toEqual(mockFlight);
    });

    test("GetFlightsByFlightID should return a specific flight", async () => {
        const mockFlight = {
            flightid: 638004,
            timetableid: 771440,
            flightnumber: "TFL1611",
            traffictype: "D",
            scheduledlocal: "2024-12-22T07:55:00.000Z",
            airlineshortname: "TUI FLY",
            aircrafttype: "B737W8",
            airport: "Arrecife",
            country: "Spain",
            paxforecast: 194,
            touchpoint: "Passagehal",
            touchpointtime: "2024-12-22T05:45:00.000Z",
            touchpointpax: 9.7,
            actuallocal: "2024-12-22T08:02:00.000Z",
            paxactual: null,
        };

        const mockResult = [mockFlight];
        mockQuery.mockResolvedValue({ rows: mockResult });

        const result = await GetFlightsByFlightID("638004");

        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM touchpoint WHERE FlightID = $1`,
            ["638004"]
        );
        expect(result[0]).toEqual(mockFlight);
    });
    
    test("AddFlight should insert a flight and return it", async () => {
        const inputData = {
            flightid: "F123",
            timetableid: "T1",
            flightnumber: "AB123",
            traffictype: "A",
            scheduledlocal: "2025-01-01T10:00:00.000Z",
            airlineshortname: "AIRLINE",
            aircrafttype: "A320",
            airport: "JFK",
            country: "USA",
            paxforecast: 180,
            touchpoint: "Gate A",
            touchpointtime: "2025-01-01T10:10:00.000Z",
            touchpointpax: 150,
            actuallocal: "2025-01-01T10:05:00.000Z",
            paxactual: 170,
        };

        mockQuery.mockResolvedValue({ rows: [inputData] });

        const result = await AddFlight(inputData);

        expect(mockQuery).toHaveBeenCalled();
        expect(result).toEqual(inputData);
    });

    test("DeleteFlightByID should delete a flight and return it", async () => {
        const mockFlight = { flightid: "F123" };
        mockQuery.mockResolvedValue({ rows: [mockFlight] });

        const result = await DeleteFlightByID("F123");

        expect(mockQuery).toHaveBeenCalledWith(
            `DELETE FROM touchpoint WHERE FlightID = $1 RETURNING *`,
            ["F123"]
        );
        expect(result).toEqual(mockFlight);
    });

    test("DeleteFlightByID should return null if no flight is found", async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        const result = await DeleteFlightByID("NOPE");

        expect(result).toBeNull();
    });

    test("UpdateFlightByID should update flight and return updated record", async () => {
        const updates = { paxforecast: 200, paxactual: 195 };
        const updatedRow = { flightid: "F123", ...updates };

        mockQuery.mockResolvedValue({ rows: [updatedRow] });

        const result = await UpdateFlightByID("F123", updates);

        expect(mockQuery).toHaveBeenCalledWith(
            expect.stringContaining("UPDATE touchpoint"),
            expect.arrayContaining(["F123", 200, 195])
        );
        expect(result).toEqual(updatedRow);
    });

    test("UpdateFlightByID should throw error if no update fields given", async () => {
        await expect(UpdateFlightByID("F123", {})).rejects.toThrow("No fields provided to update.");
    });
});
