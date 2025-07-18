import { TTouchpoint } from "./touchpoint.types";

export function isTouchpoint(obj: any): obj is TTouchpoint {
  if (typeof obj !== "object" || obj === null) return false;

  return (
    typeof obj.flightid === "number" &&
    typeof obj.timetableid === "number" &&
    typeof obj.flightnumber === "string" &&
    typeof obj.traffictype === "string" &&
    typeof obj.scheduledlocal === "string" &&
    typeof obj.airlineshortname === "string" &&
    typeof obj.aircrafttype === "string" &&
    typeof obj.airport === "string" &&
    typeof obj.country === "string" &&
    typeof obj.paxforecast === "number" &&
    typeof obj.touchpoint === "string" &&
    typeof obj.touchpointtime === "string" &&
    typeof obj.touchpointpax === "number" &&
    typeof obj.actuallocal === "string" &&
    (typeof obj.paxactual === "number" || obj.paxactual === null)
  );
}