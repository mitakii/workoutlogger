import { useState } from "react";
import { api } from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!email || !password || !username) {
      return;
    }

    try {
      await api.post("/auth/register", { email, username, password });
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <form action="">
        <label>email</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          placeholder="email"
        />
        <label>username</label>

        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          placeholder="username"
        />
        <label>password</label>

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
