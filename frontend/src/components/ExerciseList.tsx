import type { Exercise } from "../pages/WorkoutPage";
import ExerciseTile from "./ExerciseTile";
import { useAddUserExercise, useLastSession } from "../hooks/react-query";

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
      console.log(e);
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
