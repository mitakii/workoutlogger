import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";

export const App = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
