import type { UserSet } from "@/types/types";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

type Props = {
  userSet: UserSet;
};

const ProfileSetTile = ({ userSet }: Props) => {
  return (
    <div className="grid grid-cols-4 place-items-center">
      <div>Weight</div>
      <Input disabled value={userSet.weight} className="text-center"></Input>
      <div>Reps</div>
      <Input disabled value={userSet.reps} className="text-center"></Input>
    </div>
  );
};

export default ProfileSetTile;
