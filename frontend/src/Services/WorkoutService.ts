import { api } from "../Api/api";

export const lastSession = async () => {
  try {
    return await api.get("/lastSession");
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
