import { useState } from "react";
import { api } from "../Api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/UserContext";

export const Register = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const { register } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!email || !password || !username) {
      return;
    }

    await register(username, email, password);
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
