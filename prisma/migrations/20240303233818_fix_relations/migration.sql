-- DropForeignKey
ALTER TABLE `Missionary` DROP FOREIGN KEY `Missionary_churchId_fkey`;

-- DropIndex
DROP INDEX `ChurchAdmin_churchId_key` ON `ChurchAdmin`;

-- AlterTable
ALTER TABLE `ChurchAdmin` MODIFY `churchId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Missionary` MODIFY `churchId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Missionary` ADD CONSTRAINT `Missionary_churchId_fkey` FOREIGN KEY (`churchId`) REFERENCES `Church`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
