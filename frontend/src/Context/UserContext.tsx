import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  loginApi,
  logoutApi,
  statusApi,
  registerApi,
} from "../Services/AuthService";

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

type UserProfile = {
  username: string;
  email: string;
};

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await statusApi();
        const userObj: UserProfile = {
          username: res?.data.userName,
          email: res?.data.email,
        };
        setUser(userObj);
      } catch (e) {
        console.log(e);
        setUser(null);
      }
      setIsReady(true);
    };

    checkUser();
  }, []);

  const isLoggedIn = () => !!user;

  const registerUser = async (
    username: string,
    email: string,
    password: string,
    language: string
  ) => {
    try {
      const res = await registerApi(username, email, password, language);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      const res = await loginApi(username, password);
      const userObj = {
        username: res?.data.username,
        email: res?.data.email,
      };
      setUser(userObj);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    try {
      const res = await logoutApi();
      setUser(null);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        isLoggedIn,
        logout,
      }}
    >
      {isReady ? children : <div>Is loading...</div>}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserProvider;
