import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import type { UserTemplate } from "@/types/types";
import React from "react";

type Props = {
  template: UserTemplate;
};

const TemplateTile = ({ template }: Props) => {
  return (
    <Card>
      <CardHeader>{template.name}</CardHeader>
      <CardDescription>{template.description}</CardDescription>
    </Card>
  );
};

export default TemplateTile;
