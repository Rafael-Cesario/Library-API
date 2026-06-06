/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `authors` will be added. If there are existing duplicate values, this will fail.
  - Made the column `bio` on table `authors` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "authors" ALTER COLUMN "bio" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "authors_name_key" ON "authors"("name");
