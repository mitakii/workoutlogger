import { Outlet, Route, Routes } from "react-router-dom";
import UserProvider from "./Context/UserContext";
import Navbar from "./Components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const App = () => {
  return (
    <>
      <UserProvider>
        <Navbar />
        <Outlet />
      </UserProvider>
    </>
  );
};

export default App;
