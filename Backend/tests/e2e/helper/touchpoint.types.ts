export type TTouchpoint = {
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
};
