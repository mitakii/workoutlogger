import { api } from "../Api/api";
import type { UserExercise } from "../Context/WorkoutContext";
import z, { string } from "zod";
import { ExerciseSchema, UserExerciseSchema } from "../Schemas/Exercise.schema";
import type { Exercise } from "../Pages/WorkoutPage";

type Translation = {
  language: string;
  name: string;
  description: string;
};

export const searchExercise = async (
  query: string,
  pageSize: number,
  page: number
): Promise<Exercise[]> => {
  try {
    const res = await api.get(`/exercise/search`, {
      params: { query, pageSize, page },
    });
    console.log(res.data.items);
    const parsed = ExerciseSchema.parse(res.data.items);
    return parsed;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addExercise = async (
  nameTag: string,
  mediaUrl: string,
  translations: Translation[]
) => {
  try {
    const res = await api.post<Exercise>(`/exercise`, {
      nameTag,
      mediaUrl,
      translations,
    });
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
