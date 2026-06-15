import z from "zod";

export const UserSetScheme = z.object({
  id: z.string(),
  weight: z.number(),
  reps: z.number(),
  order: z.number(),
});

export const BackendUserExerciseSchema = z.object({
  id: z.string(),
  order: z.number(),
  exerciseName: z.string(),
  imageUrl: z.string(),
  exerciseDescription: z.string(),
  sets: z.array(UserSetScheme),
});

export const UserExerciseSchema = BackendUserExerciseSchema.transform(
  (data) => ({
    id: data.id,
    order: data.order,

    exerciseName: data.exerciseName,
    imageUrl: data.imageUrl,
    exerciseDescription: data.exerciseDescription,

    sets: data.sets,
  })
);

export const ExerciseSchema = z.array(
  z.object({
    name: z.string(),
    id: z.string(),
    description: z.string(),
    imageUrl: z.nullable(z.string()),
  })
);

export const TranslationSchema = z.object({
  language: z
    .string()
    .min(2, "Language is required")
    .max(4, "language too long"),
  description: z.string().min(1, "Description required").max(200),
  name: z.string().min(1, "Name required"),
});
