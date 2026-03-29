export type Exercise1RMPoint = {
  sessionId: string;
  date: string;
  estimated1RM: number;
};

export type Exercise1RMResponse = {
  exerciseId: string;
  points: Exercise1RMPoint[];
};