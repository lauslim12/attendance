/*
  Warnings:

  - A unique constraint covering the columns `[confirmationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `confirmationCode` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_confirmationCode_key` ON `User`(`confirmationCode`);