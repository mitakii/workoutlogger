import { api } from "../Api/api";

export const loginApi = async (username: string, password: string) => {
  try {
    const data = await api.post("/login", { username, password });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const registerApi = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const data = await api.post("/register", { username, email, password });
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const logoutApi = async () => {
  try {
    const data = await api.post("/logout");
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const meApi = async () => {
  try {
    const data = await api.get("/status");
    return data;
  } catch (e) {
    console.log(e);
  }
};
