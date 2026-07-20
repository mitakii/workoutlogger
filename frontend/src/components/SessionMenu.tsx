import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useCreateSession, useLastSession } from "../hooks/react-query";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FieldError } from "./ui/field";

const SessionMenu = () => {
  const navigate = useNavigate();
  const { data: lastSession } = useLastSession();
  const { mutateAsync: createSession } = useCreateSession();
  const [error, setError] = useState("");

  const handleCreateSession = async () => {
    try {
      const newSession = await createSession();
      navigate(`/session/${newSession.workoutId}`);
    } catch (e) {
      setError("Failed to start a new session");
    }
  };

  return (
    <Card className="mt-4 flex flex-col gap-2 p-4">
      {lastSession && (
        <Button asChild>
          <Link to={`/session/${lastSession.workoutId}`}>
            Open last session
          </Link>
        </Button>
      )}
      <Button onClick={handleCreateSession}>Start new session</Button>
      {error && <FieldError>{error}</FieldError>}
    </Card>
  );
};

export default SessionMenu;
