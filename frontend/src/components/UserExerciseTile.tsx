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
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{userExercise.exerciseName} </CardTitle>
          <CardDescription>{userExercise.exerciseDescription}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {userExercise.sets?.map((s) => (
          <UserSetTile key={s.id} userSet={s} sessionId={sessionId} />
        ))}
        <button type="button" onClick={handleAddSet}>
          add exercise set
        </button>
      </CardContent>
    </Card>
  );
};
