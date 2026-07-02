import type { Exercise, UserTemplate } from "@/types/types";
import React from "react";
import ExerciseTile from "../../searchPicker/ExerciseTile";
import {
  useAddTemplateExercise,
  useGetUserTemplates,
} from "@/hooks/react-query";
import TemplateTile from "./TemplateTile";

type Props = {
  templates: UserTemplate[];
};

const TemplateList = ({ templates }: Props) => {
  return (
    <div>
      {templates.map((t) => (
        <TemplateTile key={t.id} template={t} />
      ))}
    </div>
  );
};

export default TemplateList;
