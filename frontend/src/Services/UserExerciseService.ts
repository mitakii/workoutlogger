import { api } from "../Api/api";
import z, { string } from "zod";
import { ExerciseSchema, UserExerciseSchema } from "../Schemas/Exercise.schema";
import type { Exercise } from "../Pages/WorkoutPage";
import type { UserExercise, UserSet } from "../types/types";
export type ExerciseSearch = {
  query: string;
  pageSize: number;
};

export const getUserExercises = async (
  workoutId: string
): Promise<UserExercise> => {
  try {
    const res = await api.get(`/${workoutId}/exercises`);
    const parsed = UserExerciseSchema.parse(res.data);
    return parsed;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addUserSet = async (userSet: UserSet, userExerciseId: string) => {
  try {
    const res = await api.post(`/${userExerciseId}`, userSet);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
