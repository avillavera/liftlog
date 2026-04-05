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

export type WorkoutSessionSet = {
  id: string;
  entryId: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSessionExercise = {
  id: string;
  sessionId: string;
  exerciseId: string;
  order: number;
  exercise: {
    id: string;
    name: string;
    muscleGroup: string;
    equipment: string;
  };
  sets: WorkoutSessionSet[];
};

export type WorkoutSession = {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  entries: WorkoutSessionExercise[];
};

export type GetSessionsResponse = {
  items: WorkoutSession[];
  page: number;
  limit: number;
  totalCount: number;
  hasMore: boolean;
};

export type GetSessionByIdResponse = {
  session: WorkoutSession;
};

export type CreateSessionResponse = {
  session: {
    id: string;
    userId: string;
    startedAt: string;
    endedAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateEntryResponse = {
  entry: {
    id: string;
    sessionId: string;
    exerciseId: string;
    order: number;
  };
};

export type CreateSetResponse = {
  set: {
    id: string;
    entryId: string;
    setNumber: number;
    weight: number;
    reps: number;
    rpe: number | null;
    createdAt: string;
    updatedAt: string;
  };
};