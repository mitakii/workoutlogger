import SessionMenu from "../components/SessionMenu";
import LiderBoard from "../components/LiderBoard";
import "../index.css";

export const Home = () => {
  return (
    <div className="mr-2 ml-2 max-w-3xl mx-auto">
      <SessionMenu />
      <LiderBoard />
    </div>
  );
};
