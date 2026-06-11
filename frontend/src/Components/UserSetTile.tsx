import { useRef, useState } from "react";
import type { UserSet } from "../types/types";
import { useDebounce } from "react-use";
import { useDeleteUserSet, useUpdateUserSet } from "../hooks/react-query";

type Props = {
  sessionId: string;
  userSet: UserSet;
};

export const UserSetTile = ({ sessionId, userSet }: Props) => {
  const [reps, setReps] = useState<number>(userSet.reps);
  const [weight, setWeight] = useState<number>(userSet.weight);
  const [finished, setFinished] = useState(false);
  const isHydrated = useRef(false);

  const { mutateAsync: updateSet } = useUpdateUserSet(sessionId, userSet);
  const { mutateAsync: deleteSet } = useDeleteUserSet(sessionId);

  const handleSetFinished = async () => {
    try {
      setFinished(true);
    } catch (e) {
      console.log(e);
    }
  };

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
    500,
    [reps, weight]
  );

  return (
    <div>
      <button type="button" onClick={handleSetFinished}>
        Finished
      </button>
      <input
        value={reps}
        type="text"
        onChange={(e) => {
          setReps(Number(e.target.value));
        }}
      />
      <input
        value={weight}
        type="text"
        onChange={(e) => {
          setWeight(Number(e.target.value));
        }}
      />

      <button type="button" onClick={handleSetDelete}>
        Delete
      </button>
    </div>
  );
};
