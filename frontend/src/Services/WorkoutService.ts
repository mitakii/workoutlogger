import axios from "axios";
import { api } from "../Api/api";

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
