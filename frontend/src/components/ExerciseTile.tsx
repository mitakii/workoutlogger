import { useState } from "react";
import type { Exercise } from "../pages/WorkoutPage";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

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
    <Card>
      {error ?? <div> $`{error}`</div>}
      <CardHeader>{exercise.name}</CardHeader>

      <Button onClick={handleAddExercise}>addExercise</Button>
    </Card>
  );
};

export default ExerciseTile;
