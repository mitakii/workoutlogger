import { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormInput = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [error, setError] = useState("");

  const handleLogin = async (form: LoginFormInput) => {
    try {
      await loginUser(form.username, form.password);
      navigate("/");
      console.log("login");
    } catch (e) {
      if (
        axios.isAxiosError(e) &&
        (e.response?.status == 400 || e.response?.status == 401)
      ) {
        setError("invalid credentials");
        console.log(e);
      } else {
        console.log(e);
      }
      reset();
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form action="" onSubmit={handleSubmit(handleLogin)}>
        <input type="text" placeholder="username" {...register("username")} />
        {errors.username ? <p>{errors.username.message}</p> : ""}
        <input
          type="password"
          placeholder="password"
          {...register("password")}
        />
        {errors.password ? <p>{errors.password.message}</p> : ""}
        <button type="submit"></button>
      </form>
    </div>
  );
};
