import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import type { UserExercise, UserSet } from "@/types/types";
import { useAddUserSet, useDeleteUserExercise } from "@/hooks/react-query";
import { UserSetTile } from "./UserSetTile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  sessionId: string;
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ sessionId, userExercise }: Props) => {
  const { mutateAsync: addSet } = useAddUserSet(userExercise.id);
  const { mutateAsync: deleteExercise } = useDeleteUserExercise();

  const handleAddSet = async () => {
    try {
      const newSet: UserSet = {
        id: ``,
        weight: 0,
        reps: 0,
        order: userExercise.sets?.length ?? 0,
      };

      await addSet(newSet);
    } catch (e) {
      throw e;
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExercise(exerciseId);
    } catch (e) {
      throw e;
    }
  };

  return (
    <Card className="mt-2">
      <CardHeader>
        <div className="flex flex-row gap-4 items-center">
          <CardTitle>{userExercise.exerciseName} </CardTitle>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">☰</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <div>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleDeleteExercise(userExercise.id)}
                    >
                      Delete exercise
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardDescription>{userExercise.exerciseDescription}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col justify-center">
        <div className="grid grid-cols-2 place-items-center mb-2">
          <div className="pr-8">Weight</div>
          <div className="pr-21">Reps</div>
        </div>
        {userExercise.sets?.map((s) => (
          <UserSetTile key={s.id} userSet={s} sessionId={sessionId} />
        ))}
        <Button
          variant="default"
          className="m-2 ml-0 mr-0"
          onClick={handleAddSet}
        >
          Add set
        </Button>
      </CardContent>
    </Card>
  );
};
