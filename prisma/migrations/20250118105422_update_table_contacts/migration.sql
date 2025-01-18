/*
  Warnings:

  - You are about to alter the column `phone` on the `contacts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `contacts` MODIFY `email` VARCHAR(200) NULL,
    MODIFY `phone` VARCHAR(20) NULL;
