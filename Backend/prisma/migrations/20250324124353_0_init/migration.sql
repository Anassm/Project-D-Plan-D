-- CreateTable
CREATE TABLE "touchpoint" (
    "id" SERIAL NOT NULL,
    "flightid" INTEGER,
    "timetableid" INTEGER,
    "flightnumber" TEXT,
    "traffictype" VARCHAR,
    "scheduledlocal" TIMESTAMP(3),
    "airlineshortname" VARCHAR,
    "airport" TEXT,
    "aircrafttype" VARCHAR,
    "country" VARCHAR,
    "paxforecast" INTEGER,
    "touchpoint" VARCHAR,
    "touchpointtime" TIMESTAMP(3),
    "touchpointpax" DOUBLE PRECISION,
    "actuallocal" TIMESTAMP(3),
    "paxactual" VARCHAR,

    CONSTRAINT "touchpoint_pkey" PRIMARY KEY ("id")
);
