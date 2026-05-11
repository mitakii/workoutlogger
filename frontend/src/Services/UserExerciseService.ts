import { api } from "../Api/api";
import type { UserExercise } from "../Context/WorkoutContext";
import z, { string } from "zod";
import { ExerciseSchema, UserExerciseSchema } from "../Schemas/Exercise.schema";
import type { Exercise } from "../Pages/WorkoutPage";

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

export const addUserExercise = async (
  workoutId: string,
  exerciseId: string
): Promise<UserExercise> => {
  try {
    const res = await api.post<UserExercise>(
      `/workout/${workoutId}/exercise/${exerciseId}`
    );
    console.log(res.data);
    const parsed = UserExerciseSchema.parse(res.data);
    return parsed;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
