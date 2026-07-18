import SessionExerciseList from "../components/session/SessionExerciseList";
import { Link } from "react-router-dom";
import { useLastSession } from "../hooks/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const WorkoutPage = () => {
  const { data: session, isLoading, isError } = useLastSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-128">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
        Failed to load workout session. Try again later.
      </p>
    );
  }

  if (!session) return <div>No workout session found</div>;

  return (
    <div className=" flex flex-col p-2 max-w-3xl mx-auto">
      <Button asChild>
        <Link to={`/searchPicker/workoutExercise/${session.workoutId}`}>
          <div>Add Exercise</div>
        </Link>
      </Button>

      <SessionExerciseList session={session} />
    </div>
  );
};

export default WorkoutPage;
