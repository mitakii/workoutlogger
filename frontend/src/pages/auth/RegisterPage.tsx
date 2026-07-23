import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Camera, Loader2 } from "lucide-react";
import { registerSchema } from "@/schemas/auth.schema";
import type { BackendError } from "@/types/types";
import { useTranslation } from "react-i18next";

export type RegisterFormInput = z.infer<typeof registerSchema>;

export const Register = () => {
  const { t } = useTranslation("auth");
  const { registerUser } = useUserContext();
  const navigate = useNavigate();
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) });

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPfpPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleRegister = async (form: RegisterFormInput) => {
    try {
      await registerUser(
        form.userName,
        form.email,
        form.password,
        form.language,
        form.profilePicture?.[0]
      );
      navigate("/");
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", {
          message: t("register.unexpectedError"),
        });
        return;
      }

      const status = e.response?.status;

      if (status === 400) {
        const backendErrors: BackendError[] = e.response?.data;

        backendErrors.forEach((error) => {
          switch (error.code) {
            case "DuplicateUserName":
              setError("userName", {
                message: error.description,
              });
              break;
            case "DuplicateEmail":
              setError("email", {
                message: error.description,
              });
              break;
            default:
              setError("root", {
                message: error.description,
              });
          }
        });
      } else if (status === 500) {
        setError("root", {
          message: t("register.internalServerError"),
        });
      } else {
        setError("root", {
          message: t("register.somethingWentWrong"),
        });
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("register.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form action="" onSubmit={handleSubmit(handleRegister)}>
              <Field className="items-center">
                <FieldLabel>{t("register.addPfpLabel")}</FieldLabel>
                <label htmlFor="profilePicture" className="cursor-pointer">
                  <Avatar className="size-20">
                    {pfpPreview && (
                      <AvatarImage src={pfpPreview} alt="Profile picture preview" />
                    )}
                    <AvatarFallback>
                      <Camera className="size-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  {...register("profilePicture", { onChange: handlePfpChange })}
                />
                <FieldError errors={[errors.profilePicture]}></FieldError>
              </Field>
              <Field>
                <FieldLabel className="mt-2">{t("register.usernameLabel")}</FieldLabel>
                <Input
                  type="text"
                  placeholder="username"
                  {...register("userName")}
                />
                <FieldError errors={[errors.userName]}></FieldError>
              </Field>
              <Field>
                <FieldLabel className="mt-2">{t("register.emailLabel")}</FieldLabel>
                <Input type="text" placeholder="email" {...register("email")} />
                <FieldError errors={[errors.email]}></FieldError>
              </Field>
              <Field className="mt-2">
                <FieldLabel>{t("register.passwordLabel")}</FieldLabel>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="password"
                />
                <FieldError errors={[errors.password]}></FieldError>
              </Field>
              <Field className="mt-2">
                <FieldLabel>{t("register.confirmPasswordLabel")}</FieldLabel>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="confirm password"
                />
                <FieldError errors={[errors.confirmPassword]}></FieldError>
              </Field>
              <Field className="mt-2">
                <FieldLabel>{t("register.languageLabel")}</FieldLabel>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder={t("register.languagePlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("register.languagesGroupLabel")}</SelectLabel>
                          <SelectItem value="en">{t("register.languageEnglish")}</SelectItem>
                          <SelectItem value="pl">{t("register.languagePolish")}</SelectItem>
                          <SelectItem value="uk">{t("register.languageUkrainian")}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                ></Controller>
                <FieldError errors={[errors.language]}></FieldError>
              </Field>
              <Field>
                <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {t("register.submit")}
                </Button>
                <FieldError errors={[errors.root]} />
                <FieldDescription className="px-6 text-center">
                  {t("register.haveAccount")} <a href="/login">{t("register.signIn")}</a>
                </FieldDescription>
              </Field>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};
