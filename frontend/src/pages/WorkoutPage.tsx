import SessionExerciseList from "../components/SessionExerciseList";
import { Link } from "react-router-dom";
import { useLastSession } from "../hooks/react-query";
import { Button } from "@/components/ui/button";

export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string | null;
};

type Props = {};

const WorkoutPage = (props: Props) => {
  const { data: workout, isLoading } = useLastSession();

  if (isLoading) {
    return <div>workout loading</div>;
  }

  return (
    <div className="flex flex-col m-2">
      <Button asChild>
        <Link to={"/search"}>
          <div>Add Exercise</div>
        </Link>
      </Button>

      <SessionExerciseList
        exercises={workout?.userExercises}
        sessionId={workout?.workoutId}
      />
    </div>
  );
};

export default WorkoutPage;
