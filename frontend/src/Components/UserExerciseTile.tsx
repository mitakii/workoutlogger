import React from "react";
import { UserSetTile } from "./UserSetTile";
import type { UserExercise, UserSet } from "../types/types";
import { useAddUserSet, useUpdateUserSet } from "../hooks/react-query";
import { useUpdate } from "react-use";

type Props = {
  sessionId: string;
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ sessionId, userExercise }: Props) => {
  const { mutateAsync: addSet } = useAddUserSet(userExercise.id);

  const handleAddSet = async () => {
    try {
      console.log(userExercise);
      const newSet: UserSet = {
        id: ``,
        weight: 0,
        reps: 0,
        order: userExercise.sets?.length ?? 0,
      };

      await addSet(newSet);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return (
    <div>
      <div> {userExercise.exerciseName}</div>
      <div>{userExercise.exerciseDescription}</div>

      {userExercise.sets?.map((s) => (
        <div key={s.id}>
          <UserSetTile userSet={s} sessionId={sessionId} />
        </div>
      ))}
      <button type="button" onClick={handleAddSet}>
        {" "}
        add exercise set{" "}
      </button>
    </div>
  );
};
