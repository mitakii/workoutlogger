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
} from "./functions";
import {
  type Translation,
  type UserExercise,
  type UserProfile,
  type UserSession,
  type UserSet,
} from "../../types/types.d";

export const useLastSession = () => {
  return useQuery({
    queryKey: ["workout-session"],
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
      queryClient.invalidateQueries({ queryKey: ["workout-session"] });
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

export const useDeleteUserSet = (sessionId: string) => {
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
