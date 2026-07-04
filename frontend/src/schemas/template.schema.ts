import z from "zod";

export const createTemplateSchema = z.object({
  workoutId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
});
