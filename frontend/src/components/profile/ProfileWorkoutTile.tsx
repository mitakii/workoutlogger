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
import { useWorkoutToTemplate } from "@/hooks/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

type Props = {
  session: UserSession;
};

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ProfileWorkoutTile = ({ session }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: createTemplate } = useWorkoutToTemplate();
  const navigate = useNavigate();
  const date = new Date(session.startTime).toLocaleDateString();
  const day = new Date(session.startTime).getDay();

  const handleCreateTemplate = async () => {
    try {
      var templateId = await createTemplate({
        workoutId: session.workoutId,
        name: date,
        description: " ",
      });
      navigate(`/editTemplate/${templateId}`);
    } catch (e) {}
  };

  return (
    <div className="mt-2">
      <Card className="p-3">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-4 px-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
            <h4 className="text-sm font-semibold">
              {date} {days[day]}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">☰</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <div>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleCreateTemplate()}>
                      Create Template
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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
