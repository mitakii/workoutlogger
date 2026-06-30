import { useAddUserExercise, useLastSession } from "@/hooks/react-query";
import type { Exercise } from "@/types/types";
import ExerciseTile from "./ExerciseTile";

type Props = {
  exercises: Exercise[];
};

export const ExerciseList = ({ exercises }: Props) => {
  const { data: session } = useLastSession();
  const { mutateAsync: addUserExercise } = useAddUserExercise();

  const handleAddExercise = async (exercise: Exercise) => {
    if (!session) return;
    try {
      await addUserExercise({
        workoutId: session.workoutId,
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
