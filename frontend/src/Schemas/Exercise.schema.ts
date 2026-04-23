import z from "zod";

export const UserSetScheme = z.object({
  id: z.string(),
  weight: z.number(),
  reps: z.number(),
  order: z.number(),
});

export const UserExerciseSchema = z.object({
  id: z.string(),
  order: z.number(),
  exerciseName: z.string(),
  imageUrl: z.string(),
  exerciseDescription: z.string(),
  userSets: z.array(UserSetScheme),
  userExerciseId: z.string(),
  exerciseId: z.string(),
});

export const ExerciseSchema = z.object({
  name: z.string(),
  id: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});
