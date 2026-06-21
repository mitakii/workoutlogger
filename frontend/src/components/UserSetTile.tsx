import { useRef, useState } from "react";
import type { UserSet } from "../types/types";
import { useDebounce } from "react-use";
import { useDeleteUserSet, useUpdateUserSet } from "../hooks/react-query";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MinusIcon, PlusIcon } from "lucide-react";

type Props = {
  sessionId: string;
  userSet: UserSet;
};

export const UserSetTile = ({ sessionId, userSet }: Props) => {
  const [reps, setReps] = useState<number>(userSet.reps);
  const [weight, setWeight] = useState<number>(userSet.weight);
  const isHydrated = useRef(false);

  const { mutateAsync: updateSet } = useUpdateUserSet(sessionId, userSet);
  const { mutateAsync: deleteSet } = useDeleteUserSet();

  const handleSetDelete = async () => {
    try {
      await deleteSet(userSet);
    } catch (e) {
      console.log(e);
    }
  };

  useDebounce(
    async () => {
      if (!isHydrated.current) {
        isHydrated.current = true;
        return;
      }
      if (reps === 0 && weight === 0) return;
      await updateSet({
        reps: reps,
        weight: weight,
        id: userSet.id,
        order: userSet.order,
      } as UserSet);
    },
    700,
    [reps, weight]
  );

  return (
    <Card className="flex flex-row justify-between p-2 mt-1.5 items-center">
      <div className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-focus-within:has-aria-invalid:ring-destructive/40 relative inline-flex h-8 w-full min-w-0 items-center overflow-hidden rounded-lg border bg-transparent text-base whitespace-nowrap transition-colors outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-3 md:text-sm">
        <Button
          slot="decrement"
          className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setWeight(weight - 1)}
        >
          <MinusIcon className="size-4" />
        </Button>
        <Input
          className="selection:bg-primary selection:text-primary-foreground w-full grow px-2.5 py-1 text-center tabular-nums outline-none"
          value={weight}
          type="text"
          onChange={(e) => {
            setWeight(Number(e.target.value));
          }}
        />
        <Button
          slot="increment"
          className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -me-px flex aspect-square h-[inherit] items-center justify-center rounded-r-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setWeight(weight + 1)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>

      <div className="border-input data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:border-destructive data-focus-within:has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-focus-within:has-aria-invalid:ring-destructive/40 relative inline-flex h-8 w-full min-w-0 items-center overflow-hidden rounded-lg border bg-transparent text-base whitespace-nowrap transition-colors outline-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focus-within:ring-3 md:text-sm">
        <Button
          slot="decrement"
          className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setReps(reps - 1)}
        >
          <MinusIcon className="size-4" />
        </Button>
        <Input
          value={reps}
          type="text"
          onChange={(e) => {
            setReps(Number(e.target.value));
          }}
          className="selection:bg-primary selection:text-primary-foreground w-full grow px-2.5 py-1 text-center tabular-nums outline-none"
        />
        <Button
          slot="increment"
          className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground -ms-px flex aspect-square h-[inherit] items-center justify-center rounded-l-lg text-sm transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setReps(reps + 1)}
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
            <DropdownMenuItem onClick={handleSetDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};
