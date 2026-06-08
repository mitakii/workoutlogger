import React from "react";
import { UserSetTile } from "./UserSetTile";
import type { UserExercise, UserSet } from "../types/types";
import { useAddUserSet } from "../hooks/react-query";

type Props = {
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ userExercise }: Props) => {
  const { mutateAsync: addSet } = useAddUserSet(userExercise.id);
  const onSetFinish = async (reps: number, weight: number) => {
    try {
      console.log(userExercise);
      const newSet: UserSet = {
        id: "",
        weight: weight,
        reps: reps,
        order: 0,
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
          <UserSetTile userSet={s} onSetFinish={onSetFinish} />
        </div>
      )) ?? <button type="button"> add exercise set </button>}
    </div>
  );
};
