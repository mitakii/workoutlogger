import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useApplyTemplate,
  useDeleteTemplate,
  useLastSession,
} from "@/hooks/react-query";
import { getLastSession } from "@/hooks/react-query/functions";
import type { UserTemplate } from "@/types/types";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  template: UserTemplate;
};

const TemplateTile = ({ template }: Props) => {
  const navigate = useNavigate();
  const { data: session } = useLastSession();
  const { mutateAsync: deleteTemplate } = useDeleteTemplate();
  const { mutateAsync: applyTemplate } = useApplyTemplate();

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
    } catch (e) {
      throw e;
    }
  };

  const handleApplyTemplate = async (workoutId: string, templateId: string) => {
    try {
      await applyTemplate({ workoutId, templateId });
      navigate(`/session/${workoutId}`);
    } catch (e) {
      throw e;
    }
  };
  return (
    <Card className="p-2 mt-2">
      <div className="flex flex-row items-center">
        <div className="p-2">{template.name}</div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">☰</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <div>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate(`/editTemplate/${template.id}`)}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleApplyTemplate(session?.workoutId!, template.id)
                    }
                  >
                    Apply to workout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {template.description.trimEnd() && (
        <CardDescription className="pl-4 pt-0">
          {template.description}
        </CardDescription>
      )}
    </Card>
  );
};

export default TemplateTile;
