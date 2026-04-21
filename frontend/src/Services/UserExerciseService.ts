import { api } from "../Api/api";

export type ExerciseSearch = {
  query: string;
  pageSize: number;
};

export const searchExercise = async ({ query, pageSize }: ExerciseSearch) => {
  try {
    return await api.get(`/exercise/search`, { params: { query, pageSize } });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getUserExercises = async (workoutId: string) => {
  try {
    const res = await api.get(`/${workoutId}/exercises`);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addUserExercise = async (
  workoutId: string,
  exerciseId: string
) => {
  try {
    const res = await api.post(`/workout/${workoutId}/exercise/${exerciseId}`);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
