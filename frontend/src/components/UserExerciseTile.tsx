import { UserSetTile } from "../components/UserSetTile";
import type { UserExercise, UserSet } from "../types/types";
import { useAddUserSet } from "../hooks/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

type Props = {
  sessionId: string;
  userExercise: UserExercise;
};

export const UserExerciseTile = ({ sessionId, userExercise }: Props) => {
  const { mutateAsync: addSet } = useAddUserSet(userExercise.id);

  const handleAddSet = async () => {
    try {
      console.log(userExercise);
      const newSet: UserSet = {
        id: ``,
        weight: 0,
        reps: 0,
        order: userExercise.sets?.length ?? 0,
      };

      await addSet(newSet);
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return (
    <Card className="mt-2">
      <CardHeader>
        <div>
          <CardTitle>{userExercise.exerciseName} </CardTitle>
          <CardDescription>{userExercise.exerciseDescription}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col justify-center">
        {userExercise.sets?.map((s) => (
          <UserSetTile key={s.id} userSet={s} sessionId={sessionId} />
        ))}
        <Button
          variant="default"
          className="m-2 ml-0 mr-0"
          onClick={handleAddSet}
        >
          add exercise set
        </Button>
      </CardContent>
    </Card>
  );
};
