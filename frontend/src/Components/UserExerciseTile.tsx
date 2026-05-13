import React from "react";
import type { UserExercise } from "../Context/WorkoutContext";
import { UserSetTile } from "./UserSetTile";

type Props = {
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ userExercise }: Props) => {
  const onSetFinish = async (reps: string, weight: string) => {
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
      <div>
        {userExercise.userSets?.map((s) => (
          <div key={s.id}>
            <UserSetTile userSet={s} onSetFinish={onSetFinish} />
          </div>
        )) ?? <button type="button"> add exercise </button>}
      </div>
    </div>
  );
};
