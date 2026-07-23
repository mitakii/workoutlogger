import { useUserContext } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { loginSchema } from "@/schemas/auth.schema";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export type LoginFormInput = z.infer<typeof loginSchema>;

export const Login = () => {
  const { t } = useTranslation("auth");
  const navigate = useNavigate();
  const { loginUser } = useUserContext();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (form: LoginFormInput) => {
    try {
      await loginUser(form.username, form.password);
      navigate("/");
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", { message: t("login.unexpectedError") });
        reset();
        return;
      }

      const status = e.response?.status;
      if (status === 400 || status === 401) {
        setError("root", {
          message: t("login.invalidCredentials"),
        });
      }
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleLogin)}>
            <FieldGroup>
              <Field>
                <FieldLabel>{t("login.usernameLabel")}</FieldLabel>
                <Input
                  type="text"
                  placeholder="username"
                  {...register("username")}
                />
                <FieldError errors={[errors.username]}></FieldError>
              </Field>
              <Field>
                <FieldLabel>{t("login.passwordLabel")}</FieldLabel>
                <Input
                  type="password"
                  placeholder="password"
                  {...register("password")}
                />
                <FieldError errors={[errors.password]}></FieldError>
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="animate-spin" />}
                  {t("login.submit")}
                </Button>
                <FieldError errors={[errors.root]} />
                <FieldDescription className="text-center">
                  {t("login.noAccount")} <a href="/register">{t("login.signUp")}</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
