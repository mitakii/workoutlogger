import SessionExerciseList from "../components/SessionExerciseList";
import { Link } from "react-router-dom";
import { useLastSession } from "../hooks/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string | null;
};

const WorkoutPage = () => {
  const { data: session, isLoading, isFetching } = useLastSession();

  if (isLoading || isFetching) {
    return (
      <div className="flex h-screen w-screen items-center justify-center relative h-128">
        <Spinner />
      </div>
    );
  }

  if (!session) return <div>No workout session found</div>;

  return (
    <div className=" flex flex-col m-2 max-w-3xl mx-auto">
      <Button asChild>
        <Link to={"/search"}>
          <div>Add Exercise</div>
        </Link>
      </Button>

      <SessionExerciseList session={session} />
    </div>
  );
};

export default WorkoutPage;
