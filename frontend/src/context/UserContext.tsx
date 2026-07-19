import React, { createContext, useContext } from "react";
import type { UserProfile } from "../types/types";
import {
  useLogin,
  useLogout,
  useRegister,
  useStatus,
} from "../hooks/react-query";
import { Spinner } from "@/components/ui/spinner";

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
    language: string,
    profilePicture: File
  ) => void;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
};

const UserProvider = ({ children }: Props) => {
  const { data: user, isLoading } = useStatus();
  const { mutateAsync: registerApi } = useRegister();
  const { mutateAsync: loginApi } = useLogin();
  const { mutateAsync: logoutApi } = useLogout();

  const isLoggedIn = () => user != null;

  const registerUser = async (
    username: string,
    email: string,
    password: string,
    language: string,
    profilePicture: File
  ) => {
    await registerApi({ username, email, password, language, profilePicture });
  };

  const loginUser = async (username: string, password: string) => {
    await loginApi({ username, password });
  };

  const logout = async () => {
    await logoutApi();
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
