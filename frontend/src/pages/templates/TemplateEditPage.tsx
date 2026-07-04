import TemplateExerciseList from "@/components/templates/TemplateExerciseList";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetUserTemplate } from "@/hooks/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";

const TemplateEditPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetUserTemplate(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-128">
        <Spinner />
      </div>
    );
  }

  if (!data) return <div>No template found</div>;

  return (
    <div className=" flex flex-col p-2 max-w-3xl mx-auto">
      <Button asChild>
        <Link to={`/searchPicker/templateExercise/${id}`}>
          <div>Add Exercise</div>
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
