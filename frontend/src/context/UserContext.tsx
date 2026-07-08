import React, { createContext, useContext } from "react";
import type { UserProfile } from "../types/types";
import {
  useLogin,
  useLogout,
  useRegister,
  useStatus,
} from "../hooks/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Underline } from "lucide-react";

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
  const { data: user, isLoading } = useStatus();
  const { mutateAsync: registerApi } = useRegister();
  const { mutateAsync: loginApi } = useLogin();
  const { mutateAsync: logoutApi } = useLogout();

  const isLoggedIn = () => user != null || user != undefined;

  const registerUser = async (
    username: string,
    email: string,
    password: string,
    language: string
  ) => {
    try {
      await registerApi({ username, email, password, language });
    } catch (e) {
      throw e;
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      await loginApi({ username, password });
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      throw e;
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
      {!isLoading ? children : <Spinner />}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserProvider;
