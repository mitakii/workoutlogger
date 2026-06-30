import type { UserProfile } from "@/types/types";
import React from "react";
import { Card, CardHeader } from "../../ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

type Props = {
  user: UserProfile;
};

const UserTile = ({ user }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="mt-2">
      <Card className="p-2" onClick={() => navigate(`/u/${user.username}`)}>
        <div className="flex items-start gap-4">
          <Avatar className="h-15 w-15 shrink-0">
            <AvatarImage src={`${user.pfpUrl}`} />
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <h2 className="font-semibold text-sm">{user.username}</h2>
              </div>
              <div>{user.description}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserTile;
