import React from "react";
import TemplateExerciseTile from "./TemplateExerciseTile";
import type { Exercise } from "@/types/types";
import { useDeleteTemplateExercise } from "@/hooks/react-query";

type Props = {
  exercises: Exercise[];
  templateId: string;
};

const TemplateExerciseList = ({ exercises, templateId }: Props) => {
  const { mutateAsync: deleteTemplateExercise } =
    useDeleteTemplateExercise(templateId);

  const handleRemoveExercise = async (exercise: Exercise) => {
    await deleteTemplateExercise({
      templateId: templateId,
      exerciseId: exercise.id,
    });
  };

  return (
    <div>
      {exercises.map((e) => (
        <TemplateExerciseTile
          key={e.id}
          exercise={e}
          removeExercise={handleRemoveExercise}
        />
      ))}
    </div>
  );
};

export default TemplateExerciseList;
