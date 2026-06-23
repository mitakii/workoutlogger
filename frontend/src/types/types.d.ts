export type UserSession = {
  workoutId: string;
  workoutName: string;
  workoutNotes: string;
  startTime: Date;
  endTime: Date;
  userExercises: UserExercise[];
};

export type UserExercise = {
  id: string;
  exerciseName: string;
  order: number;
  exerciseDescription: string;
  imageUrl: string;
  sets: UserSet[] | undefined;
};

export type UserSet = {
  id: string;
  weight: number;
  reps: number;
  order: number;
};

export type Translation = {
  language: string;
  name: string;
  description: string;
};

export type UserProfile = {
  username: string;
  email: string;
  role: "User" | "Admin";
  description: string;
  pfpUrl: string;
};

export type BackendError = {
  code: string;
  description: string;
};

export type GetSessionsApi = {
  username: string;
  page: number;
  pageSize: number;
};
export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string | null;
};
