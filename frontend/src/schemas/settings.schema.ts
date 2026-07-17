import z from "zod";

export const changeUsernameScheme = z.object({
  newUsername: z.string().min(4, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordScheme = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z.string(),
    oldPassword: z.string().min(1, "Password required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changeLanguageScheme = z.object({
  newLanguage: z.string().max(4, "language is required"),
  password: z.string().min(1, "Password is required"),
});
