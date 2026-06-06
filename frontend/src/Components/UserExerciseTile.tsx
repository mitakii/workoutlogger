import React from "react";
import { UserSetTile } from "./UserSetTile";
import type { UserExercise } from "../types/types";

type Props = {
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ userExercise }: Props) => {
  const onSetFinish = async (reps: number, weight: number) => {
    try {
      console.log(reps, weight);
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
          <UserSetTile userSet={s} onSetFinish={onSetFinish} />
        </div>
      )) ?? <button type="button"> add exercise set </button>}
    </div>
  );
};
