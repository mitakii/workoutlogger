import type { UserSet } from "@/types/types";
import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";

type Props = {
  userSet: UserSet;
};

const ProfileSetTile = ({ userSet }: Props) => {
  const { t } = useTranslation("profile");
  return (
    <div className="grid grid-cols-4 place-items-center">
      <div>{t("profileSetTile.weightLabel")}</div>
      <Input disabled value={userSet.weight} className="text-center"></Input>
      <div>{t("profileSetTile.repsLabel")}</div>
      <Input disabled value={userSet.reps} className="text-center"></Input>
    </div>
  );
};

export default ProfileSetTile;
