import ProfileWorkoutsList from "@/components/profile/ProfileWorkoutsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserByUsername, useGetUserSessions } from "@/hooks/react-query";
import { cn } from "@/lib/utils";
import { Underline } from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

type Props = {};

const UserProfilePage = (props: Props) => {
  const pageSize = 10;
  const { token } = useParams<{ token?: string }>();
  const { data: userProfile, isLoading } = useGetUserByUsername(token ?? "");
  const username = userProfile?.username;
  const [page, setPage] = useState<number>(1);
  const { data: sessions, isLoading: sessionsLoading } = useGetUserSessions({
    username: username ?? "",
    page,
    pageSize: 10,
  });

  if (isLoading) return <div>Loading user...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <div className="flex items-start gap-4 mt-4">
        <Avatar
          className="h-20 w-20 shrink-0"
          onClick={() => console.log(userProfile)}
        >
          <AvatarImage src={`${userProfile?.pfpUrl}`} />
          <AvatarFallback>{userProfile?.username.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <h2 className="font-semibold text-sm">{userProfile?.username}</h2>
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-xs px-2"
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-wrap">{userProfile?.description}</div>

      <div>
        {sessionsLoading ? (
          <div className="flex h-screen w-screen items-center justify-center relative h-128">
            <Spinner />
          </div>
        ) : !sessions ? (
          <div>No workouts yet</div>
        ) : (
          <div>
            <ProfileWorkoutsList sessions={sessions} />
            <Pagination className="mt-2 mb-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : undefined
                    }
                    onClick={() => {
                      if (page >= 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={
                      sessions?.length < pageSize
                        ? "pointer-events-none opacity-50"
                        : undefined
                    }
                    onClick={() => {
                      if (sessions?.length >= pageSize) setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
