import { create } from "zustand";
import type { Exercise } from "../types/exercise";
import type { WorkoutDraft, WorkoutExercise } from "../types/workout";

type WorkoutState = {
  draft: WorkoutDraft;

  setName: (name: string) => void;
  addExercise: (exercise: Exercise) => void;
  removeExercise: (workoutExerciseId: string) => void;
  resetDraft: () => void;
  addSet: (workoutExerciseId: string) => void;
  updateSet: (args: { workoutExerciseId: string; setId: string; reps: number; weight: number }) => void;
  removeSet: (args: { workoutExerciseId: string; setId: string }) => void;
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
            sets: [],
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

  addSet: (workoutExerciseId) =>
    set((s) => ({
      draft: {
        ...s.draft,
        exercises: s.draft.exercises.map((we) => {
          if (we.id !== workoutExerciseId) return we;
          const newSet = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            reps: 8,
            weight: 0,
          };
          return { ...we, sets: [...we.sets, newSet] };
        }),
      },
    })),

  updateSet: ({ workoutExerciseId, setId, reps, weight }) =>
    set((s) => ({
      draft: {
        ...s.draft,
        exercises: s.draft.exercises.map((we) => {
          if (we.id !== workoutExerciseId) return we;
          return {
            ...we,
            sets: we.sets.map((st) => (st.id === setId ? { ...st, reps, weight } : st)),
          };
        }),
      },
    })),

  removeSet: ({ workoutExerciseId, setId }) =>
    set((s) => ({
      draft: {
        ...s.draft,
        exercises: s.draft.exercises.map((we) => {
          if (we.id !== workoutExerciseId) return we;
          return { ...we, sets: we.sets.filter((st) => st.id !== setId) };
        }),
      },
    })),
}));