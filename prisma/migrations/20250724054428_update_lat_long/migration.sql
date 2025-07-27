/*
  Warnings:

  - Made the column `latitude` on table `Hotel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `Hotel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Hotel` MODIFY `latitude` DOUBLE DEFAULT 0,
    MODIFY `longitude` DOUBLE DEFAULT 0;
