import React from "react";

import { UserExerciseTile } from "./UserExerciseTile";
import type { UserExercise } from "../types/types";
import { useLastSession } from "../hooks/react-query";

type Props = {
  exercises: UserExercise[] | undefined;
  sessionId: string | undefined;
};

const SessionExerciseList = ({ exercises }: Props) => {
  const { data: session } = useLastSession();

  if (!session) {
    return <div> No active session</div>;
  }

  return (
    <div>
      exercise list:
      {session.userExercises.map((e) => (
        <div key={e.id}>
          {" "}
          <UserExerciseTile userExercise={e} sessionId={session.workoutId} />
          <br />
        </div>
      ))}
    </div>
  );
};

export default SessionExerciseList;
