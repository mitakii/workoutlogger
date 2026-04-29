import axios from "axios";
import { api } from "../Api/api";

export const lastSession = async () => {
  try {
    return await axios.get("http://localhost:5241/api/workout/lastWorkout", {
      withCredentials: true,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const createSession = async () => {
  try {
    return await api.post("/workout/start");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const getSession = async (id: string) => {
  try {
    return await api.get(`/workout/${id}`);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
