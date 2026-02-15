-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE');

-- CreateEnum
CREATE TYPE "Equipment" AS ENUM ('BARBELL', 'DUMBBELL', 'MACHINE', 'CABLE', 'BODYWEIGHT');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" "MuscleGroup" NOT NULL,
    "equipment" "Equipment" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");
