import { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(8, "Password is required"),
});

export type LoginFormInput = z.infer<typeof loginSchema>;

export const Login = () => {
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
    } catch (e: any) {
      if (e.status === 400) {
        setError("invalid credentials");
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
