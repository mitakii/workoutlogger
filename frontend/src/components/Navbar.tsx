import { Link, useNavigate } from "react-router";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useScrollDirection } from "@/hooks/scrollDirection";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useUserContext();
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const logoutUser = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur
      px-4 py-3
      transition-transform duration-300 ease-in-out
      ${direction === "down" ? "-translate-y-full" : "translate-y-0"}
      `}
    >
      <div className="">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-base" onClick={() => navigate("/")}>
            Logger
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">☰</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigate(`/u/${user?.username}`)}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Find user</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={logoutUser}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
