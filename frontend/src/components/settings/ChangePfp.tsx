import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePfp } from "@/hooks/react-query";
import { useUserContext } from "@/context/UserContext";
import { changePfpScheme } from "@/schemas/settings.schema";
import { Camera } from "lucide-react";
import axios from "axios";

export type ChangePfpInput = z.infer<typeof changePfpScheme>;

const ChangePfp = () => {
  const { user } = useUserContext();
  const { mutateAsync: changePfp } = useChangePfp();
  const [isChanged, setChanged] = useState<boolean>(false);
  const [pfpPreview, setPfpPreview] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePfpInput>({
    resolver: zodResolver(changePfpScheme),
  });

  const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPfpPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  };

  const handleChangePfp = async (form: ChangePfpInput) => {
    try {
      await changePfp(form);
      setChanged(true);
      reset();
      setPfpPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", {
          message: "Unexpected error occured",
        });
        return;
      }

      const status = e.response?.status;
      if (status === 401) {
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
    <div className="pt-2">
      <Card>
        <CardHeader>
          <CardTitle>Change profile picture</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="" onSubmit={handleSubmit(handleChangePfp)}>
            <Field className="items-center">
              <FieldLabel>Add profile picture</FieldLabel>
              <label htmlFor="changePfp" className="cursor-pointer">
                <Avatar className="size-20">
                  {pfpPreview ? (
                    <AvatarImage
                      src={pfpPreview}
                      alt="Profile picture preview"
                    />
                  ) : (
                    <AvatarImage src={user?.pfpUrl} alt="Current profile picture" />
                  )}
                  <AvatarFallback>
                    <Camera className="size-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </label>
              <Input
                id="changePfp"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                {...register("profilePicture", { onChange: handlePfpChange })}
              />
              <FieldError errors={[errors.profilePicture]}></FieldError>
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
              {isChanged && <div className="pl-2">Profile picture changed</div>}
              <FieldError errors={[errors.root]}></FieldError>
            </Field>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePfp;
