import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
