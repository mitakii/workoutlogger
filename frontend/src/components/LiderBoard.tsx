import { useTranslation } from "react-i18next";

const LiderBoard = () => {
  const { t } = useTranslation("home");
  return <div>{t("liderBoard.placeholder")}</div>;
};

export default LiderBoard;
