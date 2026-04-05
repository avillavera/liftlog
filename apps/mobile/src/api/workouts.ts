import { api } from "./client";
import type {
  CreateEntryResponse,
  CreateSessionResponse,
  CreateSetResponse,
  GetSessionByIdResponse,
  GetSessionsResponse,
} from "../types/workout";

type CreateSessionInput = {
  startedAt: string;
  endedAt?: string;
  notes?: string | null;
};

type CreateEntryInput = {
  exerciseId: string;
};

type CreateSetInput = {
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number;
};

type GetSessionsParams = {
  page?: number;
  limit?: number;
};

export async function createSession(input: CreateSessionInput) {
  const { data } = await api.post<CreateSessionResponse>("/sessions", input);
  return data.session;
}

export async function createEntry(sessionId: string, input: CreateEntryInput) {
  const { data } = await api.post<CreateEntryResponse>(`/sessions/${sessionId}/entries`, input);
  return data.entry;
}

export async function createSet(entryId: string, input: CreateSetInput) {
  const { data } = await api.post<CreateSetResponse>(`/entries/${entryId}/sets`, input);
  return data.set;
}

export async function getSessions(params: GetSessionsParams = {}) {
  const { page = 1, limit = 10 } = params;

  const { data } = await api.get<GetSessionsResponse>("/sessions", {
    params: { page, limit },
  });
  
  return data;
}

export async function getSessionById(sessionId: string) {
  const { data } = await api.get<GetSessionByIdResponse>(`/sessions/${sessionId}`);
  return data.session;
}

export async function deleteSession(sessionId: string) {
  const { data } = await api.delete<{ success: true }>(`/sessions/${sessionId}`);
  return data;
}