/*
  Warnings:

  - The primary key for the `flight` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `flight` table. All the data in the column will be lost.
  - The primary key for the `touchpoint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `touchpoint` table. All the data in the column will be lost.
  - You are about to alter the column `traffictype` on the `touchpoint` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(1)`.
  - Made the column `flightid` on table `flight` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flightid` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `traffictype` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scheduledlocal` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `airport` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aircrafttype` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paxforecast` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `touchpoint` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `touchpointtime` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `touchpointpax` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actuallocal` on table `touchpoint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "flight" DROP CONSTRAINT "flight_pkey",
DROP COLUMN "id",
ALTER COLUMN "flightid" SET NOT NULL,
ADD CONSTRAINT "flight_pkey" PRIMARY KEY ("flightid");

-- AlterTable
ALTER TABLE "touchpoint" DROP CONSTRAINT "touchpoint_pkey",
DROP COLUMN "id",
ALTER COLUMN "flightid" SET NOT NULL,
ALTER COLUMN "traffictype" SET NOT NULL,
ALTER COLUMN "traffictype" SET DATA TYPE VARCHAR(1),
ALTER COLUMN "scheduledlocal" SET NOT NULL,
ALTER COLUMN "airport" SET NOT NULL,
ALTER COLUMN "aircrafttype" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "paxforecast" SET NOT NULL,
ALTER COLUMN "touchpoint" SET NOT NULL,
ALTER COLUMN "touchpointtime" SET NOT NULL,
ALTER COLUMN "touchpointpax" SET NOT NULL,
ALTER COLUMN "actuallocal" SET NOT NULL,
ADD CONSTRAINT "touchpoint_pkey" PRIMARY KEY ("flightid", "traffictype", "scheduledlocal", "airport", "aircrafttype", "country", "paxforecast", "touchpoint", "touchpointtime", "touchpointpax", "actuallocal");
