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
import { changeLanguageScheme } from "@/schemas/settiings.scheme";
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
import type z from "zod";
import axios from "axios";

export type ChangeLanguageIput = z.infer<typeof changeLanguageScheme>;

const ChangeLanguage = () => {
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
  });

  const handleChangeLanguage = async (form: ChangeLanguageIput) => {
    try {
      await changeLanguage(form);
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
      if (status === 500) {
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
          <CardTitle>Change Language</CardTitle>
          <CardDescription>
            Change language for exercises name and description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleChangeLanguage)}>
            <Field className="mt-2">
              <FieldLabel>Language</FieldLabel>
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
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  );
                }}
              ></Controller>
              <FieldError errors={[errors.newLanguage]}></FieldError>
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
              {isChanged && <div className="pl-2">Language changed</div>}
              <FieldError errors={[errors.root]}></FieldError>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeLanguage;
