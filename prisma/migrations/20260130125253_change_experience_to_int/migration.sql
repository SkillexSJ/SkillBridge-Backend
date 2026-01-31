/*
  Warnings:

  - The `experience` column on the `tutor_profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tutor_profiles" DROP COLUMN "experience",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;
