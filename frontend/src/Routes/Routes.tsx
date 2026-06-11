import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/HomePage";
import App from "../App";
import { Login } from "../Pages/LoginPage";
import { Register } from "../Pages/RegisterPage";
import WorkoutPage from "../Pages/WorkoutPage";
import { AddExercisePage } from "../Pages/AddExercisePage";
import SearchExercisePage from "../Pages/SearchExercisePage";
import AdminRoute from "./AdminRoute";
import { ProtectedRoute } from "./ProtectedRoute";

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
