import ChangeLanguage from "@/components/settings/ChangeLanguage";
import ChangePassword from "@/components/settings/ChangePassword";
import ChangeUsername from "@/components/settings/ChangeUsername";
import React from "react";

type Props = {};

const SettingsPage = (props: Props) => {
  return (
    <div className=" flex flex-col max-w-3xl mx-auto p-2">
      <ChangeUsername />
      <ChangePassword />
      <ChangeLanguage />
    </div>
  );
};

export default SettingsPage;
