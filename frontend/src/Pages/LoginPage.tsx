import { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password is required"),
});

export type LoginFormInput = z.infer<typeof loginSchema>;

export const Login = () => {
  const { loginUser } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({ resolver: zodResolver(loginSchema) });

  const handleLogin = (form: LoginFormInput) => {
    loginUser(form.userName, form.password);
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit(handleLogin)}>
        <input type="text" placeholder="username" {...register("userName")} />
        {errors.userName ? <p>{errors.userName.message}</p> : ""}
        <input type="password" {...register("password")} />
        {errors.password ? <p>{errors.password.message}</p> : ""}
        <button type="submit"></button>
      </form>
    </div>
  );
};
