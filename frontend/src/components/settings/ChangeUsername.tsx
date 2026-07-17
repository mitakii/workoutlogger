import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangeUsername } from "@/hooks/react-query";
import { changeUsernameScheme } from "@/schemas/settings.schema";
import { useState } from "react";
import axios from "axios";

export type ChangeUsernameInput = z.infer<typeof changeUsernameScheme>;

const ChangeUsername = () => {
  const { mutateAsync: changeUsername } = useChangeUsername();
  const [isChanged, setChanged] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangeUsernameInput>({
    resolver: zodResolver(changeUsernameScheme),
  });

  const handleChangeUsername = async (form: ChangeUsernameInput) => {
    try {
      await changeUsername(form);
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
        setError("newUsername", {
          message: e.response?.data,
        });
      } else if (status === 401) {
        setError("password", {
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Change username</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleChangeUsername)}>
            <Field className="">
              <FieldLabel>New username</FieldLabel>
              <Input
                id="username"
                placeholder="new username"
                {...register("newUsername")}
              />
              <FieldError errors={[errors.newUsername]}></FieldError>
            </Field>
            <Field className="pt-2">
              <FieldLabel>Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="password"
                {...register("password")}
              />
              <FieldError errors={[errors.password]}></FieldError>
            </Field>
            <Field className="pt-2">
              <Button type="submit">Change</Button>
              {isChanged && <div className="pl-2">Username changed</div>}
              <FieldError errors={[errors.root]}></FieldError>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeUsername;
