import { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type LoginFormInput = {
  userName: string;
  password: string;
};
const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const Login = () => {
  const { loginUser, isLoggedIn } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormInput) => {
    console.log("here");
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
