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
import { useTranslation } from "react-i18next";

type Props = {
  template: UserTemplate;
};

const TemplateTile = ({ template }: Props) => {
  const { t } = useTranslation("search");
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
      setError(t("templateTile.deleteFailed"));
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleApplyTemplate = async (
    workoutId?: string,
    templateId?: string
  ) => {
    if (!workoutId || !templateId) {
      setError(t("templateTile.startSessionRequired"));
      return;
    }
    try {
      await applyTemplate({ workoutId, templateId });
      navigate(`/session/${workoutId}`);
    } catch (e) {
      setError(t("templateTile.applyFailed"));
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
                    {t("templateTile.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (!session?.workoutId) {
                        setError(t("templateTile.startSessionRequired"));
                        return;
                      }
                      setApplyDialogOpen(true);
                    }}
                  >
                    {t("templateTile.applyToWorkout")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    {t("templateTile.delete")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title={t("templateTile.deleteDialogTitle")}
            description={t("templateTile.deleteDialogDescription")}
            confirmLabel={t("templateTile.deleteConfirmLabel")}
            variant="destructive"
            onConfirm={() => handleDeleteTemplate(template.id)}
          />
          <ConfirmDialog
            open={applyDialogOpen}
            onOpenChange={setApplyDialogOpen}
            title={t("templateTile.applyDialogTitle")}
            description={t("templateTile.applyDialogDescription")}
            confirmLabel={t("templateTile.applyConfirmLabel")}
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
