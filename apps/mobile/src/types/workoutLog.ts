import type { WorkoutDraft } from "./workout";

export type WorkoutLog = {
    id: string;
    createdAt: number;
    workout: WorkoutDraft; //snapshot of time of save
};