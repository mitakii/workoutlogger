import type { UserSession } from "@/types/types";
import { UserExerciseTile } from "./UserExerciseTile";
import { useSetUpdateQueue } from "@/hooks/useSetUpdateQueue";

type Props = {
  session: UserSession;
};

const SessionExerciseList = ({ session }: Props) => {
  const queueSetUpdate = useSetUpdateQueue();

  if (!session) {
    return <div> No active session</div>;
  }

  return (
    <div>
      {session.userExercises.map((e) => (
        <UserExerciseTile
          key={e.id}
          userExercise={e}
          queueSetUpdate={queueSetUpdate}
        />
      ))}
    </div>
  );
};

export default SessionExerciseList;
