import { api } from "./client";

type CreateSessionInput = {
  startedAt: string;
  endedAt?: string;
  notes?: string | null;
};

type SessionResponse = {
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

type CreateEntryInput = {
  exerciseId: string;
};

type EntryResponse = {
  entry: {
    id: string;
    sessionId: string;
    exerciseId: string;
    order: number;
  };
};

type CreateSetInput = {
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
};

type SetResponse = {
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

export async function createSession(input: CreateSessionInput) {
  const { data } = await api.post<SessionResponse>("/sessions", input);
  return data.session;
}

export async function createEntry(sessionId: string, input: CreateEntryInput) {
  const { data } = await api.post<EntryResponse>(`/sessions/${sessionId}/entries`, input);
  return data.entry;
}

export async function createSet(entryId: string, input: CreateSetInput) {
  const { data } = await api.post<SetResponse>(`/entries/${entryId}/sets`, input);
  return data.set;
}