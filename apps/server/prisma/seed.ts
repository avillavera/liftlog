import { PrismaClient, Prisma, MuscleGroup, Equipment } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


const EXERCISES: Prisma.ExerciseCreateManyInput[] = [
  // CHEST
  { name: "Bench Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.BARBELL },
  { name: "Incline Dumbbell Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.DUMBBELL },
  { name: "Chest Fly", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.CABLE },

  // BACK
  { name: "Lat Pulldown", muscleGroup: MuscleGroup.BACK, equipment: Equipment.CABLE },
  { name: "Seated Cable Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.CABLE },
  { name: "One-Arm Dumbbell Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.DUMBBELL },

  // LEGS
  { name: "Back Squat", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.BARBELL },
  { name: "Leg Press", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.MACHINE },
  { name: "Romanian Deadlift", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.BARBELL },

  // SHOULDERS
  { name: "Overhead Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.BARBELL },
  { name: "Dumbbell Shoulder Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },
  { name: "Lateral Raise", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },

  // ARMS
  { name: "Bicep Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.DUMBBELL },
  { name: "Tricep Pushdown", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.CABLE },
  { name: "Hammer Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.DUMBBELL },

  // CORE
  { name: "Plank", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Hanging Knee Raise", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Cable Crunch", muscleGroup: MuscleGroup.CORE, equipment: Equipment.CABLE },
];

async function main() {
  // For MVP/dev seeding, keeping it deterministic.
  // Might adjust this to avoid wiping user created exercises if supported later.
  await prisma.exercise.deleteMany();
  await prisma.exercise.createMany({ data: EXERCISES });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
