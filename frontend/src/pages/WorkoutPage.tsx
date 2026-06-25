import SessionExerciseList from "../components/SessionExerciseList";
import { Link } from "react-router-dom";
import { useLastSession } from "../hooks/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const WorkoutPage = () => {
  const { data: session, isLoading } = useLastSession();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-128">
        <Spinner />
      </div>
    );
  }

  if (!session) return <div>No workout session found</div>;

  return (
    <div className=" flex flex-col m-2 max-w-3xl mx-auto">
      <Button asChild>
        <Link to={"/search/exercise"}>
          <div>Add Exercise</div>
        </Link>
      </Button>

      <SessionExerciseList session={session} />
    </div>
  );
};

export default WorkoutPage;
