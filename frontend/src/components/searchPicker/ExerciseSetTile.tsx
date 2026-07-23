import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import type { Exercise } from "@/types/types";
import { Card } from "../ui/card";
import { Field, FieldError } from "../ui/field";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

type Props = {
  exercise: Exercise;
  addExercise: (e: Exercise) => void;
};

export const ExerciseSetTile = ({ exercise, addExercise }: Props) => {
  const { t } = useTranslation("searchPicker");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddExercise = async () => {
    try {
      await addExercise(exercise);
      navigate(-1);
    } catch (e) {
      setError(t("exerciseSetTile.alreadyExists"));
    }
  };

  return (
    <Card className="mt-2 p-3">
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
      <Field>
        <Button className="mt-3 w-full" onClick={handleAddExercise}>
          {t("exerciseSetTile.addExercise")}
        </Button>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    </Card>
  );
};

export default ExerciseSetTile;
