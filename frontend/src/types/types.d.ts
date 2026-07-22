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
  id: string;
  username: string;
  email: string;
  role: "User" | "Admin";
  description: string;
  pfpUrl: string;
  language: string;
};

export type UserStatistics = {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  totalDistanceKm: number;
  consecutiveWeeksActive: number;
  longestStreak: number;
  maxBenchPress: number;
  maxDeadlift: number;
  maxSquat: number;
  lastUpdated: string;
};

export type DailyStatistic = {
  id: string;
  userId: string;
  date: string;
  totalWorkouts: number;
  totalVolume: number;
  totalDistanceKm: number;
  totalExercises: number;
  totalSets: number;
};

export type ExerciseStatistics = {
  exerciseId: string;
  maxWeight: number;
  maxDuration: number;
  maxDistanceKm: number;
  totalSets: number;
  totalVolume: number;
  totalDuration: number;
  totalDistanceKm: number;
  totalProgression: Record<string, number>;
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

export type UserTemplate = {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
};

export type SearchType = "user" | "template" | "exercise";
export type SearchResults = UserProfile[] | UserTemplate[] | Exercise[];

export type SearchPickerType = "workoutExercise" | "templateExercise";
export type SearchPickerResults = Exercise[];

export type NavAction = {
  label: string;
  to?: string;
};
