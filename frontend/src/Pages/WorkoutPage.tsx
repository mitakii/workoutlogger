import React, { useEffect, useInsertionEffect, useState } from "react";
import ExerciseSearch from "../Components/ExerciseSearch";
import SessionExerciseList from "../Components/SessionExerciseList";
import { useUserContext } from "../Context/UserContext";
import { addUserExercise } from "../Services/UserExerciseService";
import { useWorkoutContext } from "../Context/WorkoutContext";
import type { UserExercise } from "../Context/WorkoutContext";
import { searchExercise } from "../Services/ExerciseService";
import { Link } from "react-router-dom";

export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string | null;
};

type Props = {};

const WorkoutPage = (props: Props) => {
  const { user } = useUserContext();
  const { session, refreshSession } = useWorkoutContext();

  if (!session) {
    return <div>workout loading</div>;
  }

  return (
    <div>
      <Link to={"/search"}>
        <button type="button">Add Exercise</button>
      </Link>
      <SessionExerciseList
        exercises={session?.userExercises}
        sessionId={session?.workoutId}
      />
    </div>
  );
};

export default WorkoutPage;
