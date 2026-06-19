import React from "react";
import { Card } from "../ui/card";
import type { UserSession } from "@/types/types";
import ProfileWorkoutTile from "./ProfileWorkoutTile";

type Props = {
  sessions: UserSession[];
};

const ProfileWorkoutsList = ({ sessions }: Props) => {
  return (
    <div>
      {sessions.map((session) => (
        <ProfileWorkoutTile key={session.workoutId} session={session} />
      ))}
    </div>
  );
};

export default ProfileWorkoutsList;
