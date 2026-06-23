import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import type { Exercise } from "@/types/types";
import { Field, FieldError } from "./ui/field";

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
    <Card className="p-2 mt-2">
      <CardHeader className="pl-2">{exercise.name}</CardHeader>
      <CardDescription className="pl-2">{exercise.description}</CardDescription>
      <Field>
        <Button className="m-2" onClick={handleAddExercise}>
          Add Exercise
        </Button>
        <FieldError> {error ?? { error }}</FieldError>
      </Field>
    </Card>
  );
};

export default ExerciseTile;
