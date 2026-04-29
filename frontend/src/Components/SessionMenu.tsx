import React, { useEffect, useState } from "react";
import { data, Link, Navigate, useNavigate } from "react-router-dom";
import { lastSession, createSession } from "../Services/WorkoutService";
import { useUserContext } from "../Context/UserContext";
import { useWorkoutContext } from "../Context/WorkoutContext";
import type { UserSession } from "../Context/WorkoutContext";

type Props = {};

const SessionMenu = (props: Props) => {
  const { isLoggedIn } = useUserContext();
  const { session, createNewSession } = useWorkoutContext();
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    try {
      const newSession = await createNewSession();
      navigate(`/session/${newSession.workoutId}`);
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
