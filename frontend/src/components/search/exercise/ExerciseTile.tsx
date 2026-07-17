import { useNavigate } from "react-router-dom";
import type { Exercise } from "@/types/types";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";

type Props = {
  exercise: Exercise;
};

const ExerciseTile = ({ exercise }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      className="p-2 mt-2"
      onClick={() => navigate(`/statistics/exercise/${exercise.id}`)}
    >
      <CardHeader className="pl-2">{exercise.name}</CardHeader>
      {exercise.description && (
        <CardDescription className="pl-2">
          {exercise.description}
        </CardDescription>
      )}
    </Card>
  );
};

export default ExerciseTile;
