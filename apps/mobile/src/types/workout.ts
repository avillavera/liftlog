import type { Exercise } from "./exercise";

export type WorkoutExercise = {
  id: string; // unique id for this entry in the workout
  exercise: Exercise;
  createdAt: number;
};

export type WorkoutDraft = {
  name: string;
  exercises: WorkoutExercise[];
};