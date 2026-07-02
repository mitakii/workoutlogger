import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateTemplate } from "@/hooks/react-query";
import { createTemplateSchema } from "@/schemas/template.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type z from "zod";

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

const CreateTemplatePage = () => {
  const { mutateAsync: createTemplate } = useCreateTemplate();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateSchema),
  });

  const handleCreateTemplate = async (form: CreateTemplateInput) => {
    try {
      const res = await createTemplate(form);
      navigate(`/editTemplate/${res}`);
    } catch (e) {
      throw e;
    }
  };
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create template</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form action="" onSubmit={handleSubmit(handleCreateTemplate)}>
              <Field>
                <FieldLabel className="mt-2">Name</FieldLabel>
                <Input type="text" placeholder="name" {...register("name")} />
                <FieldError errors={[errors.name]}></FieldError>
              </Field>
              <Field>
                <FieldLabel className="mt-2">Description</FieldLabel>
                <Input
                  type="text"
                  placeholder="description"
                  {...register("description")}
                />
                <FieldError errors={[errors.description]}></FieldError>
              </Field>

              <Field>
                <Button type="submit" className="w-full mt-2">
                  Create
                </Button>
                <FieldError errors={[errors.root]} />
              </Field>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTemplatePage;
