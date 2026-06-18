import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p>{error}</p>}
          <form action="" onSubmit={handleSubmit(handleLogin)}>
            <FieldGroup>
              <Field>
                <FieldLabel>Login</FieldLabel>
                <Input
                  type="text"
                  placeholder="username"
                  {...register("username")}
                />
                <FieldError errors={[errors.username]}></FieldError>
              </Field>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  placeholder="password"
                  {...register("password")}
                />
                <FieldError errors={[errors.password]}></FieldError>
              </Field>
              <Field>
                <Button type="submit"></Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
