import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../ui/card";
import type { UserExercise } from "@/types/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import ProfileSetTile from "./ProfileSetTile";

type Props = {
  userExercise: UserExercise;
};

const ProfileExerciseTile = ({ userExercise }: Props) => {
  const { t } = useTranslation("profile");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="ml-2 mr-2 p-2">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-4 px-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">
                {t("profileExerciseTile.toggleDetails")}
              </span>
            </Button>
          </CollapsibleTrigger>
          <h4 className="text-sm font-semibold">{userExercise.exerciseName}</h4>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          {userExercise.sets?.map((set) => (
            <ProfileSetTile key={set.id} userSet={set} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ProfileExerciseTile;
