import axios from "axios";
import { api } from "../Api/api";

export const loginApi = async (username: string, password: string) => {
  try {
    return await api.post("/login", { username, password });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const registerApi = async (
  username: string,
  email: string,
  password: string,
  language: string
) => {
  try {
    return await api.post("/register", { username, email, password, language });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const logoutApi = async () => {
  try {
    return await api.post("/logout");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const statusApi = () => {
  return axios.get("http://localhost:5241/api/status", {
    withCredentials: true,
  });
};
