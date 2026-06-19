import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export const App = () => {
  return (
    <>
      <Navbar />
      <div className="mt-17">
        <Outlet />
      </div>
    </>
  );
};

export default App;
