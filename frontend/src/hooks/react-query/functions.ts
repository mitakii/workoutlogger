import axios from "axios";
import type {
  Exercise,
  GetSessionsApi,
  Translation,
  UserExercise,
  UserProfile,
  UserSession,
  UserSet,
} from "../../types/types";
import { api } from "../../api/api";
import {
  ExerciseSchema,
  UserExerciseSchema,
} from "../../schemas/Exercise.schema";
import type { Session } from "react-router-dom";

export const getLastSession = async (): Promise<UserSession> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/workout/lastWorkout`,
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

export const getUserExercises = async (
  workoutId: string
): Promise<UserExercise> => {
  try {
    const res = await api.get(`/${workoutId}/exercises`);
    const parsed = UserExerciseSchema.parse(res.data);
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

export const getSession = async (id: string): Promise<Session> => {
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

export const getUserSessions = async (
  request: GetSessionsApi
): Promise<UserSession[]> => {
  try {
    const res = await api.get(`/workout/userWorkouts`, {
      params: {
        username: request.username,
        page: request.page,
        pageSize: request.pageSize,
      },
    });
    return res.data.items;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const addUserSet = async (userSet: UserSet, userExerciseId: string) => {
  try {
    const res = await api.post(`/UserExercise/${userExerciseId}`, userSet);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const updateUserSet = async (userSet: UserSet) => {
  try {
    const res = await api.patch(`/UserExercise/userSet/${userSet.id}`, userSet);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const deleteUserSet = async (userSet: UserSet) => {
  try {
    const res = await api.delete(`/UserExercise/userSet/${userSet.id}`);
    return res.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
// user

export const getUserByName = async (
  username: string
): Promise<UserProfile | null> => {
  try {
    const res = await api.get(`/User/${username}`);
    const user: UserProfile = {
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
      description: res.data.description,
      pfpUrl: res.data.pfpUrl,
    };
    return user;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// settings

export const changeUsername = async (newUsername: string, password: string) => {
  try {
    await api.patch("/User/changeUsername", { newUsername, password });
  } catch (e) {
    throw e;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    await api.patch("/User/changePassword", { oldPassword, newPassword });
  } catch (e) {
    throw e;
  }
};

export const changeLanguage = async (newLanguage: string, password: string) => {
  try {
    await api.patch("/User/changeLanguage", { newLanguage, password });
  } catch (e) {
    throw e;
  }
};

// auth

export const loginApi = async (
  username: string,
  password: string
): Promise<UserProfile> => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
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
    return await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
      username,
      email,
      password,
      language,
    });
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

export const statusApi = async (): Promise<UserProfile | null> => {
  try {
    const res = await axios.get<UserProfile>(
      `${import.meta.env.VITE_API_URL}/status`,
      {
        withCredentials: true,
      }
    );
    const user: UserProfile = {
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
      description: res.data.description,
      pfpUrl: res.data.pfpUrl,
    };
    return user;
  } catch (e) {
    console.log(e);
    if (axios.isAxiosError(e) && e.response?.status == 401) {
      return null;
    }
    throw e;
  }
};
