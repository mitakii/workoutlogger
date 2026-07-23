import { useEffect, useRef, useState } from "react";

import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useDeleteUserSet } from "@/hooks/react-query";
import type { useSetUpdateQueue } from "@/hooks/useSetUpdateQueue";
import type { UserSet } from "@/types/types";
import { FieldError } from "../ui/field";
import { useTranslation } from "react-i18next";

type Props = {
  userSet: UserSet;
  queueSetUpdate: ReturnType<typeof useSetUpdateQueue>;
};

export const UserSetTile = ({ userSet, queueSetUpdate }: Props) => {
  const { t } = useTranslation("session");
  const [reps, setReps] = useState<number>(userSet.reps);
  const [weight, setWeight] = useState<number>(userSet.weight);
  const [weightText, setWeightText] = useState<string>(String(userSet.weight));
  const [repsText, setRepsText] = useState<string>(String(userSet.reps));
  const [error, setError] = useState("");
  const hasEdited = useRef(false);

  const { mutateAsync: deleteSet } = useDeleteUserSet();

  const handleSetDelete = async () => {
    try {
      await deleteSet(userSet);
    } catch (e) {
      setError(t("userSetTile.deleteError"));
    }
  };

  const handleWeightChange = (value: string) => {
    setWeightText(value);
    const parsed = Number(value);
    if (value.trim() !== "" && Number.isFinite(parsed) && parsed >= 0) {
      hasEdited.current = true;
      setWeight(parsed);
    }
  };

  const handleRepsChange = (value: string) => {
    setRepsText(value);
    const parsed = Number(value);
    if (value.trim() !== "" && Number.isInteger(parsed) && parsed >= 0) {
      hasEdited.current = true;
      setReps(parsed);
    }
  };

  const adjustWeight = (delta: number) => {
    hasEdited.current = true;
    setWeight((prev) => {
      const next = Math.max(0, prev + delta);
      setWeightText(String(next));
      return next;
    });
  };

  const adjustReps = (delta: number) => {
    hasEdited.current = true;
    setReps((prev) => {
      const next = Math.max(0, prev + delta);
      setRepsText(String(next));
      return next;
    });
  };

  const HOLD_DELAY_MS = 400;
  const REPEAT_INTERVAL_MS = 100;
  const holdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasHeld = useRef(false);

  const stopHold = () => {
    if (holdTimeout.current) clearTimeout(holdTimeout.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdTimeout.current = null;
    holdInterval.current = null;
  };

  const startHold = (fn: () => void) => {
    stopHold();
    wasHeld.current = false;
    holdTimeout.current = setTimeout(() => {
      wasHeld.current = true;
      fn();
      holdInterval.current = setInterval(fn, REPEAT_INTERVAL_MS);
    }, HOLD_DELAY_MS);
  };

  const handleStepClick = (fn: () => void) => {
    if (wasHeld.current) {
      wasHeld.current = false;
      return;
    }
    fn();
  };

  useEffect(() => stopHold, []);

  useEffect(() => {
    if (!hasEdited.current) return;
    if (reps === 0 && weight === 0) return;

    queueSetUpdate({
      id: userSet.id,
      weight,
      reps,
      order: userSet.order,
    })
      .then(() => setError(""))
      .catch(() => {
        setError(t("userSetTile.saveError"));
        setReps(userSet.reps);
        setWeight(userSet.weight);
        setRepsText(String(userSet.reps));
        setWeightText(String(userSet.weight));
      });
  }, [reps, weight, userSet.id, userSet.order, queueSetUpdate]);

  return (
    <div className="mt-1.5">
      <Card className="flex flex-row justify-between p-2 items-center">
        <div className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-focus-within:has-aria-invalid:ring-destructive/40 relative inline-flex h-8 w-full min-w-0 items-center overflow-hidden rounded-lg border bg-transparent text-base whitespace-nowrap transition-colors outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-3 md:text-sm">
          <Button
            type="button"
            className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleStepClick(() => adjustWeight(-1))}
            onPointerDown={() => startHold(() => adjustWeight(-1))}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            disabled={weight <= 0}
          >
            <MinusIcon className="size-4" />
          </Button>
          <Input
            className="selection:bg-primary selection:text-primary-foreground w-full grow px-2.5 py-1 text-center tabular-nums outline-none"
            value={weightText}
            type="text"
            inputMode="decimal"
            onChange={(e) => handleWeightChange(e.target.value)}
            onBlur={() => setWeightText(String(weight))}
          />
          <Button
            type="button"
            className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleStepClick(() => adjustWeight(1))}
            onPointerDown={() => startHold(() => adjustWeight(1))}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <div className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-focus-within:has-aria-invalid:ring-destructive/40 relative inline-flex h-8 w-full min-w-0 items-center overflow-hidden rounded-lg border bg-transparent text-base whitespace-nowrap transition-colors outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-3 md:text-sm">
          <Button
            type="button"
            className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleStepClick(() => adjustReps(-1))}
            onPointerDown={() => startHold(() => adjustReps(-1))}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            disabled={reps <= 0}
          >
            <MinusIcon className="size-4" />
          </Button>
          <Input
            value={repsText}
            type="text"
            inputMode="numeric"
            onChange={(e) => handleRepsChange(e.target.value)}
            onBlur={() => setRepsText(String(reps))}
            className="selection:bg-primary selection:text-primary-foreground w-full grow px-2.5 py-1 text-center tabular-nums outline-none"
          />
          <Button
            type="button"
            className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => handleStepClick(() => adjustReps(1))}
            onPointerDown={() => startHold(() => adjustReps(1))}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">☰</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={handleSetDelete}>
                {t("userSetTile.deleteSet")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
      {error && <FieldError className="mt-1">{error}</FieldError>}
    </div>
  );
};
