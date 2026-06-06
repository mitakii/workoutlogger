import React, { useEffect, useState } from "react";
import { data, Link, Navigate, useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";
import { useCreateSession } from "../hooks/react-query";

type Props = {};

const SessionMenu = (props: Props) => {
  const { isLoggedIn } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: createSession, data: session } = useCreateSession();

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
      {isLoggedIn() && session !== null && (
        <Link to={`/session/${session?.workoutId}`}>
          <div className="m-4">open last session</div>
        </Link>
      )}
      <button onClick={handleCreateSession}>Start new session</button>
    </div>
  );
};

export default SessionMenu;
