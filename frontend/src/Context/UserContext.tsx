import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  loginApi,
  logoutApi,
  meApi as statusApi,
  registerApi,
} from "../Services/AuthService";

const UserContext = createContext<UserContextType>({} as UserContextType);

type UserProviderProps = {
  children: React.ReactNode;
};

type UserContextType = {
  user: UserProfile | null;
  login: (username: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type UserProfile = {
  username: string;
  email: string;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      statusApi()
        .then((res) => {
          if (res) {
            const userObj = {
              username: res?.data.username,
              email: res?.data.email,
            };
            setUser(userObj);
          }
        })
        .catch(() => setUser(null))
        .finally(() => setIsReady(true));
      console.log(user);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const isLoggedIn = () => !!user;

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    await registerApi(username, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((e) => console.log(e));
  };

  const login = async (username: string, password: string) => {
    await loginApi(username, password)
      .then((res) => {
        if (res) {
          const userObj = {
            username: res?.data.username,
            email: res?.data.email,
          };

          setUser(userObj);
        }
        navigate("/");
      })
      .catch((e) => console.log(e));
  };

  const logout = async () => {
    await logoutApi()
      .then(() => {
        setUser(null);
      })
      .catch((e) => {
        console.log(e);
      });
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        isLoggedIn,
        logout,
      }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(UserContext);
};

export default UserProvider;
