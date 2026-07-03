import type { Exercise } from "@/types/types";
import React, { useState } from "react";
import { Card, CardDescription, CardHeader } from "../ui/card";
import { Field, FieldError } from "../ui/field";
import { Button } from "../ui/button";
type Props = {
  exercise: Exercise;
  removeExercise: (e: Exercise) => void;
};

const TemplateExerciseTile = ({ exercise, removeExercise }: Props) => {
  const [error, setError] = useState("");

  const handleAddExercise = async () => {
    try {
      await removeExercise(exercise);
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
          Remove Exercise
        </Button>
        <FieldError> {error ?? { error }}</FieldError>
      </Field>
    </Card>
  );
};

export default TemplateExerciseTile;
