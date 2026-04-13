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
  { name: "Incline Bench Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.BARBELL },
  { name: "Decline Bench Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.BARBELL },
  { name: "Dumbbell Bench Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.DUMBBELL },
  { name: "Incline Dumbbell Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.DUMBBELL },
  { name: "Decline Dumbbell Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.DUMBBELL },
  { name: "Chest Fly", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.CABLE },
  { name: "Machine Chest Fly", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.MACHINE },
  { name: "Push-Up", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.BODYWEIGHT },
  { name: "Chest Press", muscleGroup: MuscleGroup.CHEST, equipment: Equipment.MACHINE },

  // BACK
  { name: "Deadlift", muscleGroup: MuscleGroup.BACK, equipment: Equipment.BARBELL },
  { name: "Barbell Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.BARBELL },
  { name: "Pendlay Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.BARBELL },
  { name: "Lat Pulldown", muscleGroup: MuscleGroup.BACK, equipment: Equipment.CABLE },
  { name: "Wide-Grip Lat Pulldown", muscleGroup: MuscleGroup.BACK, equipment: Equipment.CABLE },
  { name: "Seated Cable Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.CABLE },
  { name: "One-Arm Dumbbell Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.DUMBBELL },
  { name: "Pull-Up", muscleGroup: MuscleGroup.BACK, equipment: Equipment.BODYWEIGHT },
  { name: "Chin-Up", muscleGroup: MuscleGroup.BACK, equipment: Equipment.BODYWEIGHT },
  { name: "Machine Row", muscleGroup: MuscleGroup.BACK, equipment: Equipment.MACHINE },

  // LEGS
  { name: "Back Squat", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.BARBELL },
  { name: "Front Squat", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.BARBELL },
  { name: "Bulgarian Split Squat", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.DUMBBELL },
  { name: "Walking Lunge", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.DUMBBELL },
  { name: "Leg Press", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.MACHINE },
  { name: "Romanian Deadlift", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.BARBELL },
  { name: "Leg Curl", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.MACHINE },
  { name: "Leg Extension", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.MACHINE },
  { name: "Standing Calf Raise", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.MACHINE },
  { name: "Seated Calf Raise", muscleGroup: MuscleGroup.LEGS, equipment: Equipment.MACHINE },

  // SHOULDERS
  { name: "Overhead Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.BARBELL },
  { name: "Seated Dumbbell Shoulder Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },
  { name: "Dumbbell Shoulder Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },
  { name: "Arnold Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },
  { name: "Lateral Raise", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },
  { name: "Cable Lateral Raise", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.CABLE },
  { name: "Rear Delt Fly", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.DUMBBELL },
  { name: "Machine Shoulder Press", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.MACHINE },
  { name: "Face Pull", muscleGroup: MuscleGroup.SHOULDERS, equipment: Equipment.CABLE },

  // ARMS
  { name: "Barbell Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.BARBELL },
  { name: "EZ Bar Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.BARBELL },
  { name: "Bicep Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.DUMBBELL },
  { name: "Hammer Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.DUMBBELL },
  { name: "Incline Dumbbell Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.DUMBBELL },
  { name: "Preacher Curl", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.MACHINE },
  { name: "Tricep Pushdown", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.CABLE },
  { name: "Overhead Tricep Extension", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.CABLE },
  { name: "Skullcrusher", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.BARBELL },
  { name: "Close-Grip Bench Press", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.BARBELL },
  { name: "Dips", muscleGroup: MuscleGroup.ARMS, equipment: Equipment.BODYWEIGHT },

  // CORE
  { name: "Plank", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Side Plank", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Hanging Knee Raise", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Hanging Leg Raise", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Cable Crunch", muscleGroup: MuscleGroup.CORE, equipment: Equipment.CABLE },
  { name: "Crunch", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
  { name: "Ab Wheel Rollout", muscleGroup: MuscleGroup.CORE, equipment: Equipment.BODYWEIGHT },
];

async function main() {
  // For MVP/dev seeding, keeping it deterministic.
  // Might adjust this to avoid wiping user created exercises if supported later.
  await prisma.exercise.deleteMany();
  await prisma.exercise.createMany({
    data: EXERCISES,
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
