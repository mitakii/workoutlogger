import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { FieldError } from "@/components/ui/field";
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
import type { UserTemplate } from "@/types/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ConfirmDialog";

type Props = {
  template: UserTemplate;
};

const TemplateTile = ({ template }: Props) => {
  const navigate = useNavigate();
  const { data: session } = useLastSession();
  const { mutateAsync: deleteTemplate } = useDeleteTemplate();
  const { mutateAsync: applyTemplate } = useApplyTemplate();
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
    } catch (e) {
      setError("Failed to delete template");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleApplyTemplate = async (
    workoutId?: string,
    templateId?: string
  ) => {
    if (!workoutId || !templateId) {
      setError("Start a session before applying a template");
      return;
    }
    try {
      await applyTemplate({ workoutId, templateId });
      navigate(`/session/${workoutId}`);
    } catch (e) {
      setError("Failed to apply template");
    } finally {
      setApplyDialogOpen(false);
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
                    onClick={() => {
                      if (!session?.workoutId) {
                        setError("Start a session before applying a template");
                        return;
                      }
                      setApplyDialogOpen(true);
                    }}
                  >
                    Apply to workout
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete template?"
            description="This will permanently delete this template. This cannot be undone."
            confirmLabel="Delete"
            variant="destructive"
            onConfirm={() => handleDeleteTemplate(template.id)}
          />
          <ConfirmDialog
            open={applyDialogOpen}
            onOpenChange={setApplyDialogOpen}
            title="Apply template to current workout?"
            description="This will add all exercises from this template to your in-progress workout."
            confirmLabel="Apply"
            onConfirm={() =>
              handleApplyTemplate(session?.workoutId, template.id)
            }
          />
        </div>
      </div>
      {template.description.trimEnd() && (
        <CardDescription className="pl-4 pt-0">
          {template.description}
        </CardDescription>
      )}
      {error && <FieldError className="pl-4">{error}</FieldError>}
    </Card>
  );
};

export default TemplateTile;
