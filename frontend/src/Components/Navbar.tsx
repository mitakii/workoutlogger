import { Link } from "react-router";

const Navbar = () => {
  return (
    <div>
      <Link to={"/login"}> Login </Link>
      <Link to={"/register"}> Register </Link>
    </div>
  );
};

export default Navbar;
