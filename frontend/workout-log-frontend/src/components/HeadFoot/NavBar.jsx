import { Link, Links } from "react-router-dom";

export const NavBar = () => {
  return (
    <>
      <Link to={"/login"}> Login </Link>
      <Link to={"/register"}> Register </Link>
    </>
  );
};
