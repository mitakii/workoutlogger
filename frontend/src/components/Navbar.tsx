import { useMatches, useNavigate } from "react-router";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useScrollDirection } from "@/hooks/scrollDirection";
import type { NavAction } from "@/types/types";
import { useEffect } from "react";

type RouteHandle = {
  nav?: NavAction[];
};

export const getNavFromRoute = (route: any): NavAction[] => {
  return (route?.handle as RouteHandle)?.nav ?? [];
};

const Navbar = () => {
  const { logout, user, isLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const matches = useMatches();

  const navOptions = getNavFromRoute(matches.at(-1));

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
              {isLoggedIn() ? (
                <div>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigate(`/u/${user?.username}`)}
                    >
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/search/user")}>
                      Find user
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => navigate("search/template")}
                    >
                      Templates
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logoutUser}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              ) : (
                <div>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>User Account</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      Register
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
