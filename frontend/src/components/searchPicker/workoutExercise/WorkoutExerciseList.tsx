import { useAddUserExercise, useLastSession } from "@/hooks/react-query";
import type { Exercise } from "@/types/types";
import ExerciseTile from "../ExerciseTile";

type Props = {
  exercises: Exercise[];
  workoutId: string;
};

export const WorkoutExerciseList = ({ exercises, workoutId }: Props) => {
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
        <ExerciseTile key={e.id} exercise={e} addExercise={handleAddExercise} />
      ))}
    </div>
  );
};
