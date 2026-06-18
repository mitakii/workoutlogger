import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useCreateSession, useLastSession } from "../hooks/react-query";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

const SessionMenu = () => {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const { data: lastSession } = useLastSession();
  const { mutateAsync: createSession } = useCreateSession();

  const handleCreateSession = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const newSession = await createSession();
      navigate(`/session/${newSession.workoutId}`);

      return;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card className="grid-rows-2 justify-center p-4">
      {isLoggedIn() && lastSession && (
        <Button asChild>
          <Link to={`/session/${lastSession?.workoutId}`}>
            <div className="">open last session</div>
          </Link>
        </Button>
      )}

      <Button onClick={handleCreateSession}>Start new session</Button>
    </Card>
  );
};

export default SessionMenu;
