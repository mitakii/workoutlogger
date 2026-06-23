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
  updateUserSet,
  deleteUserSet,
  getUserByName,
  getUserSessions,
  changeUsername,
  changePassword,
  changeLanguage,
} from "./functions";
import {
  type GetSessionsApi,
  type Translation,
  type UserExercise,
  type UserProfile,
  type UserSession,
  type UserSet,
} from "../../types/types.d";
import type { ChangeUsernameInput } from "@/components/settings/ChangeUsername";
import { useMultiStateValidator } from "react-use";
import type { ChangePasswordInput } from "@/components/settings/ChangePassword";
import type { ChangeLanguageIput } from "@/components/settings/ChangeLanguage";

export const useLastSession = () => {
  return useQuery({
    queryKey: ["workout-session", "Current"],
    queryFn: getLastSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSessionById = (sessionId: string) => {
  return useMutation({
    mutationFn: () => getSession(sessionId),
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createSession(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-session", "Current"],
      });
    },
  });
};

export const useGetUserSessions = (request: GetSessionsApi) => {
  return useQuery({
    queryKey: [
      "workout-session",
      request.username,
      request.page,
      request.pageSize,
    ],
    queryFn: () => getUserSessions(request),
    enabled: !!request.username,
    staleTime: 5 * 60 * 1000,
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
      queryClient.invalidateQueries({
        queryKey: ["workout-session", "Current"],
      });
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
    queryKey: ["sessionExercises", sessionId],
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
      queryClient.invalidateQueries({ queryKey: ["workout-session"] });
    },
  });
};

export const useUpdateUserSet = (sessionId: string, userSet: UserSet) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userSet: UserSet) => updateUserSet(userSet),

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["workout-session", sessionId],
      });

      const previous = queryClient.getQueryData<UserSession>([
        "workout-session",
        sessionId,
      ]);

      queryClient.setQueryData(
        ["workout-session", sessionId],
        (old: UserSession) => {
          if (!old) return old;
          return {
            ...old,
            userExercises: old.userExercises.map((exercise: UserExercise) => ({
              ...exercise,
              sets: exercise.sets?.map((set) =>
                set.id === userSet.id ? { ...set, weight: userSet.weight } : set
              ),
            })),
          };
        }
      );
      return { previous };
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["workout-session", sessionId],
        context?.previous
      );
    },
  });
};

export const useDeleteUserSet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userSet: UserSet) => deleteUserSet(userSet),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-session"],
      });
    },
  });
};

//user

export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ["User", username],
    queryFn: () => getUserByName(username),
    staleTime: 5 * 60 * 1000,
  });
};

// settings

export const useChangeUsername = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ newUsername, password }: ChangeUsernameInput) =>
      changeUsername(newUsername, password),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["User", "currentUser"],
      });
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: ChangePasswordInput) =>
      changePassword(oldPassword, newPassword),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["User", "currentUser"],
      });
    },
  });
};

export const useChangeLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ newLanguage, password }: ChangeLanguageIput) =>
      changeLanguage(newLanguage, password),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["User", "currentUser"],
      });
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
      queryClient.invalidateQueries({ queryKey: ["User", "currentUser"] });
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
      queryClient.invalidateQueries({ queryKey: ["User", "currentUser"] });
    },
  });
};

export const useStatus = () => {
  return useQuery<UserProfile | null>({
    queryKey: ["User", "currentUser"],
    queryFn: statusApi,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
