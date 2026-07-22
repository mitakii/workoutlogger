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
import { useDeleteWorkout } from "@/hooks/react-query";
import ConfirmDialog from "../ConfirmDialog";
import { useUserContext } from "@/context/UserContext";

type Props = {
  session: UserSession;
  isCurrentUser: boolean;
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

const ProfileWorkoutTile = ({ session, isCurrentUser }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const date = new Date(session.startTime).toLocaleDateString();
  const day = new Date(session.startTime).getDay();
  const { mutateAsync: deleteWorkout } = useDeleteWorkout();

  const handleCreateTemplate = () => {
    navigate(`/createTemplate/${session.workoutId}`);
  };

  const handleDeleteWorkout = async () => {
    try {
      await deleteWorkout(session.workoutId);
    } catch (e) {
      console.error("Failed to delete workout", e);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="mt-2">
      <Card className="p-3">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="flex flex-col gap-2"
        >
          <div className="flex flex-row gap-4 items-center">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
            <div className="">
              <h4 className="text-sm font-semibold">
                {date} {days[day]}
              </h4>
            </div>
            <div className="ml-auto">
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
                      {isCurrentUser && (
                        <>
                          {" "}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                          >
                            Delete Workout
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuGroup>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete workout?"
                description="This will permanently delete this workout and all its exercises and sets. This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={handleDeleteWorkout}
              />
            </div>
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
