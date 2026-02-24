import { useState } from "react";
import { useAuth } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!username || !password) {
      return;
    }

    await login(username, password);
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
