import SessionMenu from "../components/SessionMenu";
import LiderBoard from "../components/LiderBoard";
import "../index.css";

export const Home = () => {
  return (
    <div className="max-w-3xl mx-auto px-2">
      <SessionMenu />
      <LiderBoard />
    </div>
  );
};
