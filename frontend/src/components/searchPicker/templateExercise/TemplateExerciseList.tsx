import type { Exercise } from "@/types/types";
import React from "react";
import ExerciseTile from "../ExerciseTile";
import { useAddTemplateExercise } from "@/hooks/react-query";

type Props = {
  exercises: Exercise[];
  templateId: string;
};

const TemplateExerciseList = ({ exercises, templateId }: Props) => {
  const { mutateAsync: addTemplateExercise } =
    useAddTemplateExercise(templateId);

  const handleAddExercise = async (exercise: Exercise) => {
    try {
      await addTemplateExercise({
        templateId: templateId,
        exerciseId: exercise.id,
      });
    } catch (e) {
      throw e;
    }
  };

  return (
    <div>
      {exercises.map((e) => (
        <ExerciseTile key={e.id} exercise={e} addExercise={handleAddExercise} />
      ))}
    </div>
  );
};

export default TemplateExerciseList;
