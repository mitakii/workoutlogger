import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLastSession, createSession, addUserExercise } from "./functions";

export const useLastSession = () => {
  return useQuery({
    queryKey: ["lastSession"],
    queryFn: getLastSession,
    retry: false,
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createSession"],
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
    mutationKey: ["addUserExercise"],
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
