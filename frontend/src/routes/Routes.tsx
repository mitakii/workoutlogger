import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/HomePage";
import App from "../App";
import { Login } from "../pages/auth/LoginPage";
import { Register } from "../pages/auth/RegisterPage";
import WorkoutPage from "../pages/WorkoutPage";
import { AddExercisePage } from "../pages/admin/AddExercisePage";
import SearchExercisePage from "../pages/SearchExercisePage";
import AdminRoute from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import UserProfilePage from "@/pages/UserProfilePage";
import SettingsPage from "@/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "session/:token", element: <WorkoutPage /> },
          { path: "search", element: <SearchExercisePage /> },
          { path: "u/:token", element: <UserProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },

      {
        path: "admin",
        element: <AdminRoute />,
        children: [{ path: "addexercise", element: <AddExercisePage /> }],
      },
    ],
  },
]);
