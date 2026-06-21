import type { UserSession } from "@/types/types";
import { useState } from "react";
import { Card } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import ProfileExerciseTile from "./ProfileExerciseTile";
type Props = {
  session: UserSession;
};

const ProfileWorkoutTile = ({ session }: Props) => {
  const date = new Date(session.startTime).toLocaleDateString();
  const day = new Date(session.startTime).getDay();
  const [isOpen, setIsOpen] = useState(false);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="mt-2">
      <Card className="p-3">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-4 px-4">
            <h4 className="text-sm font-semibold">
              {date} {days[day]}
            </h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="flex flex-col gap-2">
            {session.userExercises.map((exercise) => (
              <ProfileExerciseTile
                key={exercise.exerciseName + session.workoutId}
                userExercise={exercise}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default ProfileWorkoutTile;
