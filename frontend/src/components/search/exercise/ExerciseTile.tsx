import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import type { Exercise } from "@/types/types";
import { Card } from "@/components/ui/card";

type Props = {
  exercise: Exercise;
};

const ExerciseTile = ({ exercise }: Props) => {
  const navigate = useNavigate();

  return (
    <Card
      className="mt-2 cursor-pointer p-3 transition-colors hover:bg-accent/50"
      onClick={() => navigate(`/statistics/exercise/${exercise.id}`)}
    >
      <div className="flex items-center gap-3">
        {exercise.imageUrl ? (
          <img
            src={exercise.imageUrl}
            alt={exercise.name}
            className="h-16 w-16 shrink-0 rounded-lg bg-muted object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Dumbbell className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{exercise.name}</h3>
          {exercise.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {exercise.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExerciseTile;
