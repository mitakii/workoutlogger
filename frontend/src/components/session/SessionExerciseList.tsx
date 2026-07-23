import type { UserSession } from "@/types/types";
import { UserExerciseTile } from "./UserExerciseTile";
import { useSetUpdateQueue } from "@/hooks/useSetUpdateQueue";
import { useTranslation } from "react-i18next";

type Props = {
  session: UserSession;
};

const SessionExerciseList = ({ session }: Props) => {
  const { t } = useTranslation("session");
  const queueSetUpdate = useSetUpdateQueue();

  if (!session) {
    return <div>{t("sessionExerciseList.noActiveSession")}</div>;
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
