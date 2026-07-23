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
import { useCreateTemplate, useWorkoutToTemplate } from "@/hooks/react-query";
import { createTemplateSchema } from "@/schemas/template.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type z from "zod";
import { useTranslation } from "react-i18next";

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;

const CreateTemplatePage = () => {
  const { t } = useTranslation("templates");
  const navigate = useNavigate();
  const { id } = useParams();
  const { mutateAsync: createTemplate } = useWorkoutToTemplate();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateTemplateInput>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      workoutId: id,
    },
  });

  const handleCreateTemplate = async (form: CreateTemplateInput) => {
    try {
      const res = await createTemplate(form);
      navigate(`/editTemplate/${res}`);
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        setError("root", { message: t("createTemplatePage.unexpectedError") });
        return;
      }
      setError("root", { message: t("createTemplatePage.createError") });
    }
  };
  return (
    <div className="flex w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("createTemplatePage.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form action="" onSubmit={handleSubmit(handleCreateTemplate)}>
              <Field>
                <FieldLabel className="mt-2">
                  {t("createTemplatePage.nameLabel")}
                </FieldLabel>
                <Input
                  type="text"
                  placeholder={t("createTemplatePage.namePlaceholder")}
                  {...register("name")}
                />
                <FieldError errors={[errors.name]}></FieldError>
              </Field>
              <Field>
                <FieldLabel className="mt-2">
                  {t("createTemplatePage.descriptionLabel")}
                </FieldLabel>
                <Input
                  type="text"
                  placeholder={t("createTemplatePage.descriptionPlaceholder")}
                  {...register("description")}
                />
                <FieldError errors={[errors.description]}></FieldError>
              </Field>

              <Field>
                <Button type="submit" className="w-full mt-2">
                  {t("createTemplatePage.submit")}
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
