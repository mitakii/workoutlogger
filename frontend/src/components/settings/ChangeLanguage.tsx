import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { changeLanguageScheme } from "@/schemas/settings.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useChangeLanguage } from "@/hooks/react-query";
import { useUserContext } from "@/context/UserContext";
import type z from "zod";
import axios from "axios";
import { useTranslation } from "react-i18next";

export type ChangeLanguageIput = z.infer<typeof changeLanguageScheme>;

const ChangeLanguage = () => {
  const { user } = useUserContext();
  const { t } = useTranslation();
  const [isChanged, setChanged] = useState<boolean>(false);
  const { mutateAsync: changeLanguage } = useChangeLanguage();
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
    reset,
  } = useForm<ChangeLanguageIput>({
    resolver: zodResolver(changeLanguageScheme),
    defaultValues: {
      newLanguage: user?.language ?? "en",
    },
  });

  const handleChangeLanguage = async (form: ChangeLanguageIput) => {
    try {
      await changeLanguage(form);
      setChanged(true);
      reset({ newLanguage: form.newLanguage, password: "" });
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", {
          message: t("errors.unexpectedError"),
        });
        return;
      }
      const status = e.response?.status;
      if (status === 500) {
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
          <CardTitle>{t("settings.changeLanguageTitle")}</CardTitle>
          <CardDescription>
            {t("settings.changeLanguageDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleChangeLanguage)}>
            <Field className="mt-2">
              <FieldLabel>{t("settings.languageLabel")}</FieldLabel>
              <Controller
                name="newLanguage"
                control={control}
                render={({ field }) => {
                  return (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select a Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Languages</SelectLabel>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="pl">Polish</SelectItem>
                          <SelectItem value="uk">Ukrainian</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              ></Controller>
              <FieldError errors={[errors.newLanguage]}></FieldError>
            </Field>
            <Field className="pt-2">
              <FieldLabel>{t("settings.passwordLabel")}</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="password"
                {...register("password")}
              />
              <FieldError errors={[errors.password]}></FieldError>
            </Field>
            <Field className="pt-2">
              <Button type="submit">{t("settings.changeButton")}</Button>
              {isChanged && (
                <div className="pl-2">{t("settings.changedNotice")}</div>
              )}
              <FieldError errors={[errors.root]}></FieldError>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeLanguage;
