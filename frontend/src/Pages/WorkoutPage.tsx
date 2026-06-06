import React, { useEffect, useInsertionEffect, useState } from "react";
import ExerciseSearch from "../Components/ExerciseSearch";
import SessionExerciseList from "../Components/SessionExerciseList";
import { useUserContext } from "../Context/UserContext";
import { searchExercise } from "../Services/ExerciseService";
import { isRouteErrorResponse, Link } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "../Api/api";
import type { UserSession } from "../types/types";
import { useLastSession } from "../hooks/react-query";

export type Exercise = {
  name: string;
  id: string;
  description: string;
  imageUrl: string | null;
};

type Props = {};

const WorkoutPage = (props: Props) => {
  const { user } = useUserContext();

  const { data: workout, isLoading, error, isError } = useLastSession();

  if (isLoading) {
    return <div>workout loading</div>;
  }

  return (
    <div>
      <Link to={"/search"}>
        <button type="button">Add Exercise</button>
      </Link>
      <SessionExerciseList
        exercises={workout?.userExercises}
        sessionId={workout?.workoutId}
      />
    </div>
  );
};

export default WorkoutPage;
