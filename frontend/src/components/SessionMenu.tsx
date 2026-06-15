import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useCreateSession, useLastSession } from "../hooks/react-query";

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
    <div className="grid-rows-2 justify-center p-4">
      {isLoggedIn() && lastSession && (
        <Link to={`/session/${lastSession?.workoutId}`}>
          <div className="m-4">open last session</div>
        </Link>
      )}
      <button onClick={handleCreateSession}>Start new session</button>
    </div>
  );
};

export default SessionMenu;
