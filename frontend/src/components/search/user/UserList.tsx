import type { UserProfile } from "@/types/types";
import React, { useState } from "react";
import UserTile from "./UserTile";

type Props = {
  users: UserProfile[];
};

const UserList = ({ users }: Props) => {
  return (
    <div>
      {users.map((u) => (
        <UserTile key={u.username} user={u} />
      ))}
    </div>
  );
};

export default UserList;
