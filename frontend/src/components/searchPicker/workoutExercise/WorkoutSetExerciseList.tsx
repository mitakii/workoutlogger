import { useAddUserExercise, useLastSession } from "@/hooks/react-query";
import type { Exercise } from "@/types/types";
import ExerciseSetTile from "../ExerciseSetTile";

type Props = {
  exercises: Exercise[];
  workoutId: string;
};

export const WorkoutSetExerciseList = ({ exercises, workoutId }: Props) => {
  const { mutateAsync: addUserExercise } = useAddUserExercise();

  const handleAddExercise = async (exercise: Exercise) => {
    try {
      await addUserExercise({
        workoutId: workoutId,
        exerciseId: exercise.id,
      });
    } catch (e) {
      throw e;
    }
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
