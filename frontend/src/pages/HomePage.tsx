import SessionMenu from "../components/SessionMenu";
import LiderBoard from "../components/LiderBoard";
import QuickStartTemplates from "../components/QuickStartTemplates";
import RecentActivity from "../components/RecentActivity";
import { useUserContext } from "@/context/UserContext";

export const Home = () => {
  const { isLoggedIn } = useUserContext();

  return (
    <div className="max-w-3xl mx-auto px-2 pb-10">
      <SessionMenu />
      {isLoggedIn() && (
        <>
          <QuickStartTemplates />
          <RecentActivity />
        </>
      )}
    </div>
  );
};
