import TemplateExerciseList from "@/components/templates/TemplateExerciseList";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserTemplate } from "@/hooks/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TemplateEditPage = () => {
  const { t } = useTranslation("templates");
  const { id } = useParams();
  const { data, isLoading, isError } = useGetUserTemplate(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-128">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="px-4 pt-6 text-center text-muted-foreground text-sm">
        {t("templateEditPage.loadError")}
      </p>
    );
  }

  if (!data) return <div>{t("templateEditPage.notFound")}</div>;

  return (
    <div className=" flex flex-col p-2 max-w-3xl mx-auto">
      <Button asChild>
        <Link to={`/searchPicker/templateExercise/${id}`}>
          <div>{t("templateEditPage.addExercise")}</div>
        </Link>
      </Button>
      <Card className="p-2 mt-2">
        <CardHeader>{data.name}</CardHeader>
        <CardDescription>{data.description}</CardDescription>
      </Card>
      <TemplateExerciseList templateId={id!} exercises={data.exercises} />
    </div>
  );
};

export default TemplateEditPage;
