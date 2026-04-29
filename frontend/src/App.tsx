import { Outlet, Route, Routes } from "react-router-dom";
import UserProvider from "./Context/UserContext";
import Navbar from "./Components/Navbar";
import WorkoutProvider from "./Context/WorkoutContext";

export const App = () => {
  return (
    <>
      <UserProvider>
        <WorkoutProvider>
          <Navbar />
          <Outlet />
        </WorkoutProvider>
      </UserProvider>
    </>
  );
};

export default App;
