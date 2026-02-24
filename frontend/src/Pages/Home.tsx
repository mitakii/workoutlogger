import { api } from "../Api/api";

export const Home = () => {
  const handle = async () => {
    const user = await api.get("/user/me");
    console.log(user.data);
  };

  return (
    <div>
      <button onClick={handle}></button>
    </div>
  );
};
