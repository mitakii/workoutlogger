import type { UserSession } from "@/types/types";
import React from "react";
import { Card, CardDescription, CardHeader } from "../ui/card";

type Props = {
  session: UserSession;
};

const ProfileWorkoutTile = ({ session }: Props) => {
  const date = new Date(session.startTime).toLocaleDateString();

  return (
    <div>
      <Card className="mt-2 p-2">
        <CardHeader>{date}</CardHeader>
        <CardDescription>{date}</CardDescription>
      </Card>
    </div>
  );
};

export default ProfileWorkoutTile;
