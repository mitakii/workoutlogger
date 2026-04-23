import { useState } from "react";
import "../index.css";
import { searchExercise } from "../Services/ExerciseService";
import { useUserContext } from "../Context/UserContext";
import type { UserExercise } from "../Context/WorkoutContext";
import type { Exercise } from "../Pages/WorkoutPage";

type Props = {};

const ExerciseSeaerch = () => {
  const [query, setQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>();

  return (
    <div>
      <input type="text" />
    </div>
  );
};

export default ExerciseSeaerch;
