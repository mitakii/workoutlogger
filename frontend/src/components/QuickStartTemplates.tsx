import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { Card } from "./ui/card";
import { Spinner } from "./ui/spinner";
import { FieldError } from "./ui/field";
import {
  useApplyTemplate,
  useCreateSession,
  useGetUserTemplates,
} from "@/hooks/react-query";
import type { UserTemplate } from "@/types/types";

const QuickStartTemplates = () => {
  const navigate = useNavigate();
  const { data: templates, isLoading } = useGetUserTemplates(1, 5);
  const { mutateAsync: createSession } = useCreateSession();
  const { mutateAsync: applyTemplate } = useApplyTemplate();
  const [error, setError] = useState("");

  const handleQuickStart = async (template: UserTemplate) => {
    try {
      const session = await createSession();
      await applyTemplate({
        workoutId: session.workoutId,
        templateId: template.id,
      });
      navigate(`/session/${session.workoutId}`);
    } catch (e) {
      setError("Failed to start session from template");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner />
      </div>
    );
  }

  if (!templates || templates.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-sm font-semibold text-muted-foreground">
        Quick Start
      </h2>
      {error && <FieldError className="mt-1">{error}</FieldError>}
      <div className="mt-2 flex flex-col gap-2">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer p-3 transition-colors hover:bg-accent/50"
            onClick={() => handleQuickStart(template)}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ClipboardList className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">
                  {template.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {template.exercises.length} exercise
                  {template.exercises.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickStartTemplates;
