import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { UserProfile } from "../types/types";
import {
  useLogin,
  useLogout,
  useRegister,
  useStatus,
} from "../hooks/react-query";

const UserContext = createContext<UserContextType>({} as UserContextType);

type Props = {
  children: React.ReactNode;
};

type UserContextType = {
  user: UserProfile | null;
  loginUser: (username: string, password: string) => void;
  registerUser: (
    username: string,
    email: string,
    password: string,
    language: string
  ) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useStatus();
  const { mutateAsync: registerApi } = useRegister();
  const { mutateAsync: loginApi } = useLogin();
  const { mutateAsync: logoutApi } = useLogout();

  const isLoggedIn = () => user != null;

  const registerUser = async (
    username: string,
    email: string,
    password: string,
    language: string
  ) => {
    try {
      const res = await registerApi({ username, email, password, language });
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      console.log({ username, password });
      const res = await loginApi({ username, password });
      navigate("/");
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      const res = await logoutApi();
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: user ?? null,
        loginUser,
        registerUser,
        isLoggedIn,
        logout,
      }}
    >
      {!isLoading ? children : <div>Is loading...</div>}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserProvider;
