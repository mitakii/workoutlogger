import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLastSession,
  createSession,
  addUserExercise,
  searchExercise,
  getSession,
  addUserSet,
  getUserExercises,
  addExercise,
  loginApi,
  registerApi,
  logoutApi,
  statusApi,
} from "./functions";
import type { Translation, UserProfile, UserSet } from "../../types/types";

export const useLastSession = () => {
  return useQuery({
    queryKey: ["lastSession"],
    queryFn: getLastSession,
    retry: false,
  });
};

export const useGetSessionById = (sessionId: string) => {
  return useMutation({
    mutationKey: ["session", sessionId],
    mutationFn: () => getSession(sessionId),
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createSession(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lastSession"],
      });
    },
  });
};

export const useAddUserExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workoutId,
      exerciseId,
    }: {
      workoutId: string;
      exerciseId: string;
    }) => addUserExercise(workoutId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lastSession"] });
    },
  });
};

export const useSearchExercise = (pageSize: number, page: number) => {
  return useMutation({
    mutationFn: (searchValue: string) =>
      searchExercise(searchValue, pageSize, page),
  });
};

export const useGetUserExercises = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessionExercises"],
    queryFn: () => {
      getUserExercises(sessionId);
    },
  });
};

export const useAddExercise = () => {
  return useMutation({
    mutationFn: ({
      nameTag,
      mediaUrl,
      translations,
    }: {
      nameTag: string;
      mediaUrl: string;
      translations: Translation[];
    }) => addExercise(nameTag, mediaUrl, translations),
  });
};

export const useAddUserSet = (userExerciseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userSet: UserSet) => addUserSet(userSet, userExerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lastSession"] });
    },
  });
};

// auth

type UserLogin = {
  username: string;
  password: string;
};
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (login: UserLogin) => loginApi(login.username, login.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
  });
};

type UserRegister = {
  username: string;
  email: string;
  password: string;
  language: string;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (register: UserRegister) =>
      registerApi(
        register.username,
        register.email,
        register.password,
        register.language
      ),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
    },
  });
};

export const useStatus = () => {
  return useQuery<UserProfile | null>({
    queryKey: ["User"],
    queryFn: statusApi,
    retry: false,
  });
};
