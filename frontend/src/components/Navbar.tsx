import { useMatches, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Globe, Menu, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useScrollDirection } from "@/hooks/scrollDirection";
import type { NavAction } from "@/types/types";
import { useEffect } from "react";
import { supportedLanguages } from "@/i18n";

type RouteHandle = {
  nav?: NavAction[];
};

export const getNavFromRoute = (route: any): NavAction[] => {
  return (route?.handle as RouteHandle)?.nav ?? [];
};

const Navbar = () => {
  const { logout, user, isLoggedIn } = useUserContext();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const direction = useScrollDirection();
  const matches = useMatches();

  const navOptions = getNavFromRoute(matches.at(-1));

  const logoutUser = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
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
          <Link to="/" className="font-semibold text-base">
            {t("nav.brand")}
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label={t("nav.toggleTheme")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
            {!isLoggedIn() && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={t("nav.changeLanguage")}
                  >
                    <Globe />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="start">
                  <DropdownMenuLabel>{t("nav.changeLanguage")}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={i18n.language}
                    onValueChange={(lang) => i18n.changeLanguage(lang)}
                  >
                    {supportedLanguages.map((lang) => (
                      <DropdownMenuRadioItem key={lang} value={lang}>
                        {t(`nav.languages.${lang}`)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              {isLoggedIn() ? (
                <div>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t("nav.myAccount")}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigate(`/u/${user?.username}`)}
                    >
                      {t("nav.profile")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/search/user")}>
                      {t("nav.findUser")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t("nav.statistics")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate("/statistics")}>
                      {t("nav.overview")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate("/search/exercise")}
                    >
                      {t("nav.exerciseStats")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t("nav.template")}</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigate("search/template")}
                    >
                      {t("nav.userTemplates")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      {t("nav.settings")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logoutUser}>
                      {t("nav.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              ) : (
                <div>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{t("nav.userAccount")}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      {t("nav.login")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/register")}>
                      {t("nav.register")}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
