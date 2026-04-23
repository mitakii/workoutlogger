import { api } from "../Api/api";
import type { UserExercise } from "../Context/WorkoutContext";
import z, { string } from "zod";
import { ExerciseSchema, UserExerciseSchema } from "../Schemas/Exercise.schema";
import type { Exercise } from "../Pages/WorkoutPage";

export type ExerciseSearch = {
  query: string;
  pageSize: number;
};

export const searchExercise = async ({
  query,
  pageSize,
}: ExerciseSearch): Promise<Exercise> => {
  try {
    const res = await api.get(`/exercise/search`, {
      params: { query, pageSize },
    });
    const parsed = ExerciseSchema.parse(res.data);
    return parsed;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addExercise = async (
  nameTag: string,
  mediaUrl: string,
  language: string,
  name: string,
  description: string
) => {
  try {
    const res = await api.post<Exercise>(`/exercise`, {
      nameTag,
      mediaUrl,
      translations: [{ language, name, description }],
    });
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
