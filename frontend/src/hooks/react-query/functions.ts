import axios from "axios";
import type { UserExercise, UserSession } from "../../types/types";
import { api } from "../../Api/api";
import { UserExerciseSchema } from "../../Schemas/Exercise.schema";

export const getLastSession = async (): Promise<UserSession> => {
  try {
    const res = await axios.get(
      "http://localhost:5241/api/workout/lastWorkout",
      {
        withCredentials: true,
      }
    );

    return {
      ...res.data,
      userExercises: res.data.userExercises ?? [],
    } as UserSession;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const createSession = async (): Promise<UserSession> => {
  try {
    const res = await api.post("/workout/start");
    return {
      ...res.data,
      userExercises: res.data.userExercises ?? [],
    };
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
