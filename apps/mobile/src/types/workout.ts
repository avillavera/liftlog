import type { Exercise } from "./exercise";

export type WorkoutSet = {
  id: string;
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  id: string; // unique id for this entry in the workout
  exercise: Exercise;
  sets: WorkoutSet[];
  createdAt: number;
};

export type WorkoutDraft = {
  name: string;
  exercises: WorkoutExercise[];
};