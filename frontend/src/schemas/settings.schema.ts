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

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024;
const ALLOWED_PROFILE_PICTURE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const changePfpScheme = z.object({
  profilePicture: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Profile picture is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_PROFILE_PICTURE_SIZE,
      "Image must be smaller than 5MB"
    )
    .refine(
      (files) => ALLOWED_PROFILE_PICTURE_TYPES.includes(files?.[0]?.type),
      "Only JPEG, PNG or WEBP images are allowed"
    ),
  password: z.string().min(1, "Password is required"),
});
