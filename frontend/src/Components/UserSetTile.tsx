import React, { useState } from "react";
import type { UserSet } from "../Context/WorkoutContext";

type Props = {
  userSet: UserSet;
  onSetFinish: (reps: string, weight: string) => void;
};

export const UserSetTile = ({ userSet, onSetFinish }: Props) => {
  const [reps, setReps] = useState(userSet.reps);
  const [weight, setWeight] = useState(userSet.weight);
  const [finished, setFinished] = useState(false);

  const handleSubmit = async () => {
    try {
      await onSetFinish(reps, weight);
      setFinished(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <input
        value={reps}
        type="text"
        onChange={(e) => {
          setReps(e.target.value);
        }}
      />
      <input
        value={weight}
        type="text"
        onChange={(e) => {
          setWeight(e.target.value);
        }}
      />
      <button type="button" onClick={handleSubmit}>
        Finished
      </button>
    </div>
  );
};
