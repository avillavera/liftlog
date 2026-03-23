import { api } from "./client";

type SessionListItem = {
  id: string;
  userId: string;
  startedAt: string;
  endedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  entries: Array<{
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
    sets: Array<{
      id: string;
      entryId: string;
      setNumber: number;
      weight: number;
      reps: number;
      rpe: number | null;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
};

type SessionDetailResponse = {
  session: {
    id: string;
    userId: string;
    startedAt: string;
    endedAt: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    entries: Array<{
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
      sets: Array<{
        id: string;
        entryId: string;
        setNumber: number;
        weight: number;
        reps: number;
        rpe: number | null;
        createdAt: string;
        updatedAt: string;
      }>;
    }>;
  };
};

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

type GetSessionsResponse = {
  items: SessionListItem[];
  page: number;
  limit: number;
  totalCount: number;
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

export async function getSessions() {
  const { data } = await api.get<GetSessionsResponse>("/sessions");
  return data;
}

export async function getSessionById(sessionId: string) {
  const { data } = await api.get<SessionDetailResponse>(`/sessions/${sessionId}`);
  return data.session;
}

export async function deleteSession(sessionId: string) {
  const { data } = await api.delete<{ success: true }>(`/sessions/${sessionId}`);
  return data;
}