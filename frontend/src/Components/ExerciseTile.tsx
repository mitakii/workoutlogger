import React, { useState } from "react";
import type { Exercise } from "../Pages/WorkoutPage";
import { useNavigate } from "react-router-dom";

type Props = {
  exercise: Exercise;
  addExercise: (e: Exercise) => void;
};

export const ExerciseTile = ({ exercise, addExercise }: Props) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleAddExercise = async () => {
    try {
      await addExercise(exercise);

      navigate(-1);
    } catch (e) {
      console.log(e);
      setError("exercise already exist");
    }
  };

  return (
    <div>
      {error ?? <div> $`{error}`</div>}
      <br />
      {exercise.name}
      <div>
        <button onClick={handleAddExercise}>addExercise</button>
      </div>
    </div>
  );
};

export default ExerciseTile;
