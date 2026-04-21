import { useState } from "react";
import { useUserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type RegisterFormInput = {
  userName: string;
  email: string;
  password: string;
  language: string;
};
const validation = Yup.object().shape({
  userName: Yup.string().min(4).required("Username is required"),
  email: Yup.string().email().required("email is required"),
  password: Yup.string().min(8).required("password is required"),
  language: Yup.string().max(4).required("language is required"),
});

export const Register = () => {
  const { registerUser } = useUserContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({ resolver: yupResolver(validation) });

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
