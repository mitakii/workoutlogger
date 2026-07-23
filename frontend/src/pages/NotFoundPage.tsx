import { useTranslation } from "react-i18next";

export const NotFound = () => {
  const { t } = useTranslation("common");
  return <div>{t("notFound.message")}</div>;
};
