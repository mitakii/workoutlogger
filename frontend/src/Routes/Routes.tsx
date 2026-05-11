import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/HomePage";
import App from "../App";
import { Login } from "../Pages/LoginPage";
import { Register } from "../Pages/RegisterPage";
import WorkoutPage from "../Pages/WorkoutPage";
import { AddExercisePage } from "../Pages/AddExercisePage";
import SearchExercisePage from "../Pages/SearchExercisePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "session/:token", element: <WorkoutPage /> },
      { path: "addexercise", element: <AddExercisePage /> },
      { path: "search", element: <SearchExercisePage /> },
    ],
  },
]);
