-- CreateTable
CREATE TABLE "touchpoint" (
    "flightid" INTEGER NOT NULL,
    "timetableid" INTEGER NOT NULL,
    "flightnumber" INTEGER NOT NULL,
    "traffictype" VARCHAR NOT NULL,
    "scheduledlocal" TIMESTAMP(3) NOT NULL,
    "airlineshortname" VARCHAR NOT NULL,
    "aircrafttype" VARCHAR NOT NULL,
    "country" VARCHAR NOT NULL,
    "paxforecast" INTEGER NOT NULL,
    "touchpoint" VARCHAR NOT NULL,
    "touchpointtime" TIMESTAMP(3) NOT NULL,
    "touchpointpax" DOUBLE PRECISION NOT NULL,
    "actuallocal" TIMESTAMP(3) NOT NULL,
    "paxactual" VARCHAR,

    CONSTRAINT "touchpoint_pkey" PRIMARY KEY ("flightid")
);

