import { create } from "zustand";
import type { Exercise } from "../types/exercise";
import type { WorkoutDraft } from "../types/workout";

type WorkoutState = {
  draft: WorkoutDraft;

  setName: (name: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (workoutExerciseId: string) => void;
  resetDraft: () => void;
};

const initialDraft: WorkoutDraft = {
  name: "New Workout",
  exercises: [],
};

export const useWorkoutStore = create<WorkoutState>((set) => ({
  draft: initialDraft,

  setName: (name) =>
    set((s) => ({
      draft: { ...s.draft, name },
    })),

  addExercise: (exercise) =>
    set((s) => ({
      draft: {
        ...s.draft,
        exercises: [
          ...s.draft.exercises,
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            exercise,
            createdAt: Date.now(),
          },
        ],
      },
    })),

  removeExercise: (workoutExerciseId) =>
    set((s) => ({
      draft: {
        ...s.draft,
        exercises: s.draft.exercises.filter((x) => x.id !== workoutExerciseId),
      },
    })),

  resetDraft: () => set({ draft: initialDraft }),
}));