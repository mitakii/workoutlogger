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
  changePfp,
  searchUser,
  createWorkoutTemplate,
  deleteTemplate,
  workoutToTemplate,
  addTemplateExercise,
  deleteTemplateExercise,
  getUserTemplates,
  getUserTemplate,
  applyTemplate,
  deleteUserExercise,
  deleteWorkout,
  getUserStatistics,
  getDailyStatisticsRange,
  getExerciseStatistics,
  getExercise,
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
import type { ChangePasswordInput } from "@/components/settings/ChangePassword";
import type { ChangeLanguageIput } from "@/components/settings/ChangeLanguage";
import type { ChangePfpInput } from "@/components/settings/ChangePfp";

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
        queryKey: ["workout-session"],
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

export const useDeleteUserExercise = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => deleteUserExercise(exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-session", "Current"],
      });
    },
  });
};

export const useDeleteWorkout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workoutId: string) => deleteWorkout(workoutId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-session"],
      });
    },
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

export const useChangePfp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profilePicture, password }: ChangePfpInput) =>
      changePfp(profilePicture[0], password),
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
  profilePicture: File;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (register: UserRegister) =>
      registerApi(
        register.username,
        register.email,
        register.password,
        register.language,
        register.profilePicture
      ),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User"] });
      queryClient.invalidateQueries({ queryKey: ["workout-session"] });
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

// templates

export const useCreateTemplate = (workoutId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => createWorkoutTemplate(workoutId, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UserTemplates"] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["UserTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["initialData"] });
    },
  });
};

export const useApplyTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workoutId,
      templateId,
    }: {
      workoutId: string;
      templateId: string;
    }) => applyTemplate(workoutId, templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workout-session"],
      });
    },
  });
};

export const useWorkoutToTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workoutId,
      name,
      description,
    }: {
      workoutId: string;
      name: string;
      description: string;
    }) => workoutToTemplate(workoutId, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["UserTemplates"],
      });
    },
  });
};

export const useAddTemplateExercise = (templateId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      exerciseId,
    }: {
      templateId: string;
      exerciseId: string;
    }) => addTemplateExercise(templateId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["UserTemplates", templateId],
      });
    },
  });
};

export const useDeleteTemplateExercise = (templateId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      exerciseId,
    }: {
      templateId: string;
      exerciseId: string;
    }) => deleteTemplateExercise(templateId, exerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["UserTemplates", templateId],
      });
    },
  });
};

export const useGetUserTemplates = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ["UserTemplates", page, pageSize],
    queryFn: () => getUserTemplates(page, pageSize),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetUserTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ["UserTemplates", templateId],
    queryFn: () => getUserTemplate(templateId),
    staleTime: 5 * 60 * 1000,
  });
};

// statistics

export const useUserStatistics = (userId: string) => {
  return useQuery({
    queryKey: ["statistics", "user", userId],
    queryFn: () => getUserStatistics(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useDailyStatisticsRange = (
  userId: string,
  from: Date,
  to: Date
) => {
  const fromKey = from.toISOString().split("T")[0];
  const toKey = to.toISOString().split("T")[0];
  return useQuery({
    queryKey: ["statistics", "daily", userId, fromKey, toKey],
    queryFn: () => getDailyStatisticsRange(from, to),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useExerciseStatistics = (userId: string, exerciseId: string) => {
  return useQuery({
    queryKey: ["statistics", "exercise", userId, exerciseId],
    queryFn: () => getExerciseStatistics(exerciseId),
    enabled: !!userId && !!exerciseId,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

export const useGetExercise = (exerciseId: string) => {
  return useQuery({
    queryKey: ["exercise", exerciseId],
    queryFn: () => getExercise(exerciseId),
    enabled: !!exerciseId,
    staleTime: 5 * 60 * 1000,
  });
};
