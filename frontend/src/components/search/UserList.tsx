import type { UserProfile } from "@/types/types";
import React, { useState } from "react";
import UserTile from "./UserTile";
import { Pagination } from "../ui/pagination";
import PagePagination from "../profile/PagePagination";

type Props = {
  users: UserProfile[];
};

const UserList = ({ users }: Props) => {
  return (
    <div>
      {users.map((u) => (
        <UserTile user={u} />
      ))}
    </div>
  );
};

export default UserList;
