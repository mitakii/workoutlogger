import type { Exercise } from "@/types/types";
import ExerciseTile from "./ExerciseTile";

type Props = {
  exercises: Exercise[];
};

const ExerciseList = ({ exercises }: Props) => {
  return (
    <div>
      {exercises.map((e) => (
        <ExerciseTile key={e.id} exercise={e} />
      ))}
    </div>
  );
};

export default ExerciseList;
