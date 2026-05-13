import z from "zod";

export const UserSetScheme = z.object({
  id: z.string(),
  weight: z.string(),
  reps: z.string(),
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

    userSets: data.sets,
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
