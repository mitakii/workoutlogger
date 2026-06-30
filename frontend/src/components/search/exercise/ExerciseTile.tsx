import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Exercise } from "@/types/types";
import { Card, CardDescription, CardHeader } from "../../ui/card";
import { Field, FieldError } from "../../ui/field";
import { Button } from "../../ui/button";

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
      setError("Exercise already exist");
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
