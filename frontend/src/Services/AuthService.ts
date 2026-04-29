import axios from "axios";
import { api } from "../Api/api";

type ApiError = {
  message: string;
  field?: "username" | "password";
};

export const loginApi = async (username: string, password: string) => {
  try {
    const res = await api.post("/login", { username, password });
    return res.data;
  } catch (e) {
    console.log(e);
    if (axios.isAxiosError<ApiError>(e)) {
      throw e.response?.data || { message: "Login failed" };
    }
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
