import { useState } from "react";
import { api } from "../api/api";
import { AuthState } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const { setUser, setLoading } = AuthState();
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!username || !password) {
      return;
    }

    try {
      await api.post("/auth/login", { username, password });
      setLoading(true);
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <form action="">
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          placeholder="username"
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={submitHandler}></button>
      </form>
    </div>
  );
};
