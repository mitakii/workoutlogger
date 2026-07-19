import ChangeLanguage from "@/components/settings/ChangeLanguage";
import ChangePassword from "@/components/settings/ChangePassword";
import ChangePfp from "@/components/settings/ChangePfp";
import ChangeUsername from "@/components/settings/ChangeUsername";

const SettingsPage = () => {
  return (
    <div className=" flex flex-col max-w-3xl mx-auto p-2">
      <ChangePfp />
      <ChangeUsername />
      <ChangePassword />
      <ChangeLanguage />
    </div>
  );
};

export default SettingsPage;
