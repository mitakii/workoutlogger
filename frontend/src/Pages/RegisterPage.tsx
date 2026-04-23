import { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  userName: z.string().min(4, "Username is required"),
  email: z.email("email is required"),
  password: z.string().min(8, "password is required"),
  language: z.string().max(4, "language is required"),
});

export type RegisterFormInput = z.infer<typeof registerSchema>;

export const Register = () => {
  const { registerUser } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) });

  const handleRegister = (form: RegisterFormInput) => {
    registerUser(form.userName, form.email, form.password, form.language);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(handleRegister)}>
        <input type="text" placeholder="username" {...register("userName")} />
        {errors.userName ? <p>{errors.userName.message}</p> : ""}
        <input type="text" placeholder="email" {...register("email")} />
        {errors.email ? <p>{errors.email.message}</p> : ""}
        <input
          type="password"
          {...register("password")}
          placeholder="password"
        />
        {errors.password ? <p>{errors.password.message}</p> : ""}
        <input type="text" {...register("language")} placeholder="language" />
        <button type="submit"></button>
      </form>
    </div>
  );
};
