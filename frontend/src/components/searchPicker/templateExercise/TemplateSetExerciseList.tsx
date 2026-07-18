import type { Exercise } from "@/types/types";
import React from "react";
import ExerciseSetTile from "../ExerciseSetTile";
import { useAddTemplateExercise } from "@/hooks/react-query";

type Props = {
  exercises: Exercise[];
  templateId: string;
};

const TemplateSetExerciseList = ({ exercises, templateId }: Props) => {
  const { mutateAsync: addTemplateExercise } =
    useAddTemplateExercise(templateId);

  const handleAddExercise = async (exercise: Exercise) => {
    await addTemplateExercise({
      templateId: templateId,
      exerciseId: exercise.id,
    });
  };

  return (
    <div>
      {exercises.map((e) => (
        <ExerciseSetTile
          key={e.id}
          exercise={e}
          addExercise={handleAddExercise}
        />
      ))}
    </div>
  );
};

export default TemplateSetExerciseList;
