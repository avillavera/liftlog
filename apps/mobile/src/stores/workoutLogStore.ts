/* import { create } from "zustand";
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
}));  */

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WorkoutLog } from "../types/workoutLog";
import type { WorkoutDraft } from "../types/workout";

const STORAGE_KEY = "liftlog.workoutLogs.v1";

type WorkoutLogState = {
  logs: WorkoutLog[];
  hasHydrated: boolean;

  hydrate: () => Promise<void>;
  addLog: (draft: WorkoutDraft) => Promise<WorkoutLog>;
  clearLogs: () => Promise<void>;
};

async function saveLogs(logs: WorkoutLog[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export const useWorkoutLogStore = create<WorkoutLogState>((set, get) => ({
  logs: [],
  hasHydrated: false,

  hydrate: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      set({ hasHydrated: true });
      return;
    }

    try {
      const parsed = JSON.parse(raw) as WorkoutLog[];
      set({ logs: parsed, hasHydrated: true });
    } catch {
      // corrupted storage -> reset
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ logs: [], hasHydrated: true });
    }
  },

  addLog: async (draft) => {
    const log: WorkoutLog = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
      workout: JSON.parse(JSON.stringify(draft)) as WorkoutDraft,
    };

    const next = [log, ...get().logs];
    set({ logs: next });
    await saveLogs(next);

    return log;
  },

  clearLogs: async () => {
    set({ logs: [] });
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
}));