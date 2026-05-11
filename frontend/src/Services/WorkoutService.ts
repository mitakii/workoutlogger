import axios from "axios";
import { api } from "../Api/api";

export const lastSession = async () => {
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
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const createSession = async () => {
  try {
    const res = await api.post("/workout/start");
    const norm = {
      ...res.data,
      userExercises: res.data.userExercises ?? [],
    };
    return norm;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getSession = async (id: string) => {
  try {
    const res = await api.get(`/workout/${id}`);
    return {
      ...res.data,
      userExercises: res.data.userExercises ?? [],
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
