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

export type ChangePasswordInput = z.infer<typeof changePasswordScheme>;

const ChangePassword = () => {
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
          message: "Unexpected error occured",
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
          message: "Password is invalid",
        });
      } else if (status === 500) {
        setError("root", {
          message: "Internal server error",
        });
      } else {
        setError("root", {
          message: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="pt-2">
      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleChangePassword)}>
            <Field className="">
              <FieldLabel>Old password</FieldLabel>
              <Input
                id="oldPassword"
                placeholder="old password"
                type="password"
                {...register("oldPassword")}
              />
              <FieldError errors={[errors.oldPassword]}></FieldError>
            </Field>
            <Field className="pt-2">
              <FieldLabel>New Password</FieldLabel>
              <Input
                id="newPassword"
                type="password"
                placeholder="new password"
                {...register("newPassword")}
              />
              <FieldError errors={[errors.newPassword]}></FieldError>
            </Field>
            <Field className="pt-2">
              <FieldLabel>Confirm password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="password"
                {...register("confirmPassword")}
              />
              <FieldError errors={[errors.confirmPassword]}></FieldError>
            </Field>
            <Field className="pt-2">
              <Button type="submit">Change</Button>
              <FieldError errors={[errors.root]}></FieldError>
              {isChanged && <div className="pl-2"> Password changed </div>}
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
