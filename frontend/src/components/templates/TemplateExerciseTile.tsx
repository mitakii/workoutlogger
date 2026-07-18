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

  const handleRemoveExercise = async () => {
    try {
      await removeExercise(exercise);
    } catch (e) {
      setError("Failed to remove exercise");
    }
  };

  return (
    <Card className="p-2 mt-2">
      <CardHeader className="pl-2">{exercise.name}</CardHeader>
      <CardDescription className="pl-2">{exercise.description}</CardDescription>
      <Field className="">
        <Button className="" onClick={handleRemoveExercise}>
          Remove Exercise
        </Button>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    </Card>
  );
};

export default TemplateExerciseTile;
