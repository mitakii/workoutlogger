import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/hooks/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordScheme } from "@/schemas/settings.schema";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

export type ChangePasswordInput = z.infer<typeof changePasswordScheme>;

const ChangePassword = () => {
  const { t } = useTranslation("common");
  const { mutateAsync: changePassword } = useChangePassword();
  const [isChanged, setChanged] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordScheme),
  });

  const handleChangePassword = async (form: ChangePasswordInput) => {
    try {
      await changePassword(form);
      setChanged(true);
      reset();
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", {
          message: t("errors.unexpectedError"),
        });
        return;
      }

      const status = e.response?.status;
      if (status === 400) {
        setError("root", {
          message: e.response?.data,
        });
      } else if (status === 401) {
        setError("oldPassword", {
          message: t("errors.invalidPassword"),
        });
      } else if (status === 500) {
        setError("root", {
          message: t("errors.internalServerError"),
        });
      } else {
        setError("root", {
          message: t("errors.somethingWentWrong"),
        });
      }
    }
  };

  return (
    <div className="pt-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.changePasswordTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleChangePassword)}>
            <Field className="">
              <FieldLabel>{t("settings.oldPasswordLabel")}</FieldLabel>
              <Input
                id="oldPassword"
                placeholder="old password"
                type="password"
                {...register("oldPassword")}
              />
              <FieldError errors={[errors.oldPassword]}></FieldError>
            </Field>
            <Field className="pt-2">
              <FieldLabel>{t("settings.newPasswordLabel")}</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                placeholder="new password"
                {...register("newPassword")}
              />
              <FieldError errors={[errors.newPassword]}></FieldError>
            </Field>
            <Field className="pt-2">
              <FieldLabel>{t("settings.confirmPasswordLabel")}</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="password"
                {...register("confirmPassword")}
              />
              <FieldError errors={[errors.confirmPassword]}></FieldError>
            </Field>
            <Field className="pt-2">
              <Button type="submit">{t("settings.changeButton")}</Button>
              <FieldError errors={[errors.root]}></FieldError>
              {isChanged && (
                <div className="pl-2">{t("settings.passwordChangedNotice")}</div>
              )}
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
