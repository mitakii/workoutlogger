import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/HomePage";
import App from "../App";
import { Login } from "../pages/auth/LoginPage";
import { Register } from "../pages/auth/RegisterPage";
import WorkoutPage from "../pages/WorkoutPage";
import { AddExercisePage } from "../pages/admin/AddExercisePage";
import SearchPage from "../pages/SearchPage";
import AdminRoute from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import UserProfilePage from "@/pages/UserProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import { NotFound } from "@/pages/NotFoundPage";
import SearchPickerPage from "@/pages/SearchPickerPage";
import TemplateEditPage from "@/pages/templates/TemplateEditPage";
import CreateTemplatePage from "@/pages/templates/CreateTemplatePage";
import StatisticsPage from "@/pages/statistics/StatisticsPage";
import ExerciseStatisticsPage from "@/pages/statistics/ExerciseStatisticsPage";

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
          {
            path: "session/:token",
            element: <WorkoutPage />,
          },
          { path: "search/:type", element: <SearchPage /> },
          { path: "u/:token", element: <UserProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "searchPicker/:type/:id", element: <SearchPickerPage /> },
          { path: "editTemplate/:id", element: <TemplateEditPage /> },
          { path: "createTemplate/:id", element: <CreateTemplatePage /> },
          { path: "statistics", element: <StatisticsPage /> },
          {
            path: "statistics/exercise/:exerciseId",
            element: <ExerciseStatisticsPage />,
          },
        ],
      },

      {
        path: "admin",
        element: <AdminRoute />,
        children: [{ path: "addexercise", element: <AddExercisePage /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
