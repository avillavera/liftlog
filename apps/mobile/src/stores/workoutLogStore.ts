import { create } from "zustand";
import type { WorkoutLog } from "../types/workoutLog";
import type { WorkoutDraft } from "../types/workout";

type WorkoutLogState = {
  logs: WorkoutLog[];
  addLog: (draft: WorkoutDraft) => WorkoutLog;
  clearLogs: () => void;
};

export const useWorkoutLogStore = create<WorkoutLogState>((set, get) => ({
  logs: [],

  addLog: (draft) => {
    const log: WorkoutLog = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      workout: JSON.parse(JSON.stringify(draft)) as WorkoutDraft, // simple deep copy
    };

    set({ logs: [log, ...get().logs] });
    return log;
  },

  clearLogs: () => set({ logs: [] }),
}));