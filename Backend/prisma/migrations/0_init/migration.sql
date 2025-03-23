-- CreateTable
CREATE TABLE "touchpoints" (
    "flightid" INTEGER,
    "timetableid" INTEGER,
    "flightnumber" VARCHAR,
    "traffictype" VARCHAR,
    "scheduledlocal" TIMESTAMP(3),
    "airlineshortname" VARCHAR,
    "aircrafttype" VARCHAR,
    "airport" VARCHAR,
    "country" VARCHAR,
    "paxforecast" INTEGER,
    "touchpoint" VARCHAR,
    "touchpointtime" TIMESTAMP(3),
    "touchpointpax" DOUBLE PRECISION,
    "actuallocal" TIMESTAMP(3),
    "paxactual" VARCHAR
    );

