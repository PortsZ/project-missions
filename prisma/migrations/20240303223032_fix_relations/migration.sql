/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `Church` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `Church` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ChurchAdmin` DROP FOREIGN KEY `ChurchAdmin_churchId_fkey`;

-- AlterTable
ALTER TABLE `Church` ADD COLUMN `adminId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Church_adminId_key` ON `Church`(`adminId`);

-- AddForeignKey
ALTER TABLE `Church` ADD CONSTRAINT `Church_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `ChurchAdmin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
