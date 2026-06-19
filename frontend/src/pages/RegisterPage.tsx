import { useUserContext } from "../context/UserContext";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

const registerSchema = z.object({
  userName: z.string().min(4, "Username is required"),
  email: z.email("email is required"),
  password: z.string().min(8, "password is required"),
  language: z.string().max(4, "language is required"),
});

export type RegisterFormInput = z.infer<typeof registerSchema>;

export const Register = () => {
  const { registerUser } = useUserContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormInput>({ resolver: zodResolver(registerSchema) });

  const handleRegister = async (form: RegisterFormInput) => {
    await registerUser(form.userName, form.email, form.password, form.language);
    navigate("/");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form action="" onSubmit={handleSubmit(handleRegister)}>
              <Field>
                <FieldLabel className="mt-2">Login</FieldLabel>
                <Input
                  type="text"
                  placeholder="username"
                  {...register("userName")}
                />
                <FieldError errors={[errors.userName]}></FieldError>
              </Field>
              <Field>
                <FieldLabel className="mt-2">Email</FieldLabel>
                <Input type="text" placeholder="email" {...register("email")} />
                <FieldError errors={[errors.email]}></FieldError>
              </Field>
              <Field className="mt-2">
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="password"
                />
                <FieldError errors={[errors.password]}></FieldError>
              </Field>
              <Field className="mt-2">
                <FieldLabel>Language</FieldLabel>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
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
                  )}
                ></Controller>
                <FieldError errors={[errors.language]}></FieldError>
              </Field>
              <Button type="submit" className="w-full mt-2">
                Register
              </Button>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};
