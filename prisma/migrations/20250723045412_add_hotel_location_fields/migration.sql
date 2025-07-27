/*
  Warnings:

  - Added the required column `userEmail` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Booking` ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Hotel` ADD COLUMN `address` TEXT NOT NULL,
    ADD COLUMN `latitude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;
