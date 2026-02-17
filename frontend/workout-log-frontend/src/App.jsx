import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import AuthProvider from "./context/AuthContext";
import { NavBar } from "./components/HeadFoot/NavBar";
import { NotFound } from "./Pages/NotFound";
import { Home } from "./Pages/Home";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
