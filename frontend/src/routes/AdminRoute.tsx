import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const AdminRoute = () => {
  const { user, isLoggedIn } = useUserContext();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "Admin") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
