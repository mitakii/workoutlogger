import { api } from "../Api/api";
import SessionMenu from "../Components/SessionMenu";
import LiderBoard from "../Components/LiderBoard";
import "../index.css";

export const Home = () => {
  return (
    <div>
      <SessionMenu />
      <LiderBoard />
    </div>
  );
};
