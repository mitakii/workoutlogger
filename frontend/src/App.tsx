import { Route, Routes } from "react-router-dom";
import { Login } from "./Pages/Login";
import { Register } from "./Pages/Register";
import UserProvider from "./Context/UserContext";
import { NotFound } from "./Pages/NotFound";
import { Home } from "./Pages/Home";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
