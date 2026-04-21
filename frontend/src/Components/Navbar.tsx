import { Link } from "react-router";
import "../index.css";
import { useUserContext } from "../Context/UserContext";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useUserContext();

  const logoutUser = () => {
    logout();
    console.log("is user authorized: " + isLoggedIn());
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to={"/"}
          className="text-xl font-bold"
          onClick={() => console.log(user)}
        >
          logo
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn() ? (
            <>
              <button
                onClick={logoutUser}
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link
                to={"/login"}
                className="px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Login
              </Link>
              <Link
                to={"/register"}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
