import axios from "axios";
import type {
  DailyStatistic,
  Exercise,
  ExerciseStatistics,
  GetSessionsApi,
  Translation,
  UserExercise,
  UserProfile,
  UserSession,
  UserSet,
  UserStatistics,
  UserTemplate,
} from "../../types/types";
import { api } from "../../api/api";
import {
  ExerciseSchema,
  UserExerciseSchema,
} from "../../schemas/Exercise.schema";
import type { Session } from "react-router-dom";

export const getLastSession = async (): Promise<UserSession | null> => {
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
    if (
      axios.isAxiosError(e) &&
      (e.response?.status === 404 || e.response?.status === 401)
    ) {
      return null;
    }
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
    return res.data;
  } catch (e) {
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
    throw e;
  }
};

export const addUserSet = async (userSet: UserSet, userExerciseId: string) => {
  try {
    const res = await api.post(`/UserExercise/${userExerciseId}`, userSet);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteUserExercise = async (exerciseId: string) => {
  try {
    const res = await api.delete(`/Workout/exercise/${exerciseId}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const updateUserSet = async (userSet: UserSet) => {
  try {
    const res = await api.patch(`/UserExercise/userSet/${userSet.id}`, userSet);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteUserSet = async (userSet: UserSet) => {
  try {
    const res = await api.delete(`/UserExercise/userSet/${userSet.id}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};
//search
export const searchExercise = async (
  query: string,
  pageSize: number,
  page: number
): Promise<Exercise[]> => {
  try {
    const res = await api.get(`/exercise/search`, {
      params: { query, pageSize, page },
    });
    const parsed = ExerciseSchema.parse(res.data.items);
    return parsed;
  } catch (e) {
    throw e;
  }
};
export const searchUser = async (
  query: string,
  pageSize: number,
  page: number
): Promise<UserProfile[]> => {
  try {
    const res = await api.get(`/User/search`, {
      params: { query, pageSize, page },
    });
    return res.data.items;
  } catch (e) {
    throw e;
  }
};
export const searchTemplate = async (
  query: string,
  pageSize: number,
  page: number
): Promise<UserTemplate[]> => {
  try {
    const res = await api.get(`/Template/search`, {
      params: { query, pageSize, page },
    });
    return res.data.items;
  } catch (e) {
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
      id: res.data.id,
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
      description: res.data.description,
      pfpUrl: res.data.pfpUrl,
    };
    return user;
  } catch (e) {
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
    throw e;
  }
};

export const logoutApi = async () => {
  try {
    return await api.post("/logout");
  } catch (e) {
    throw e;
  }
};

export const statusApi = async (): Promise<UserProfile | null> => {
  try {
    const res = await api.get(`/status`);
    const user: UserProfile = {
      id: res.data.id,
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
      description: res.data.description,
      pfpUrl: res.data.pfpUrl,
    };
    return user;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 401) {
      return null;
    }
    throw e;
  }
};

const fmtDate = (d: Date) => d.toISOString().split("T")[0];

export const getUserStatistics = async (
  userId: string
): Promise<UserStatistics> => {
  const res = await api.get<UserStatistics>(`/Statistics/user/${userId}`);
  return res.data;
};

export const getDailyStatisticsRange = async (
  from: Date,
  to: Date
): Promise<DailyStatistic[]> => {
  try {
    const res = await api.get<DailyStatistic[]>(
      `/Statistics/day/from/${fmtDate(from)}/to/${fmtDate(to)}`
    );
    return res.data;
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 404) return [];
    throw e;
  }
};

export const getExerciseStatistics = async (
  exerciseId: string
): Promise<ExerciseStatistics> => {
  const res = await api.get<ExerciseStatistics>(
    `/Statistics/exercise/${exerciseId}`
  );
  return res.data;
};

//templates

export const createWorkoutTemplate = async (
  name: string,
  description: string,
  workoutId: string
): Promise<string> => {
  try {
    const res = await api.post("/Template/createTemplate", {
      WorkoutId: workoutId,
      name: name,
      description: description,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const deleteTemplate = async (templateId: string) => {
  try {
    await api.delete(`Template/deleteTemplate/${templateId}`);
  } catch (e) {
    throw e;
  }
};

export const applyTemplate = async (workoutId: string, templateId: string) => {
  try {
    await api.patch("Template/applyTemplate", {
      WorkoutId: workoutId,
      TemplateWorkoutId: templateId,
    });
  } catch (e) {
    throw e;
  }
};

export const workoutToTemplate = async (
  workoutId: string,
  name: string,
  description: string
): Promise<string> => {
  try {
    const res = await api.post("Template/toTemplate", {
      workoutId: workoutId,
      name: name,
      description: description,
    });
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const addTemplateExercise = async (
  templateId: string,
  exerciseId: string
) => {
  try {
    await api.post(`Template/${templateId}/addExercise/${exerciseId}`);
  } catch (e) {
    throw e;
  }
};

export const deleteTemplateExercise = async (
  templateId: string,
  exerciseId: string
) => {
  try {
    await api.delete(`Template/${templateId}/deleteExercise/${exerciseId}`);
  } catch (e) {
    throw e;
  }
};

export const updateTemplate = async (
  templateId: string,
  name: string,
  description: string
) => {
  try {
    await api.patch(`Template/update/${templateId}`, {
      name: name,
      description: description,
    });
  } catch (e) {
    throw e;
  }
};

export const getUserTemplates = async (
  page: number,
  pageSize: number
): Promise<UserTemplate[]> => {
  try {
    const res = await api.get("Template/userTemplates", {
      params: {
        page,
        pageSize,
      },
    });
    return res.data.items;
  } catch (e) {
    throw e;
  }
};

export const getUserTemplate = async (
  templateId: string
): Promise<UserTemplate> => {
  try {
    const res = await api.get(`Template/userTemplate/${templateId}`);
    return res.data;
  } catch (e) {
    throw e;
  }
};
