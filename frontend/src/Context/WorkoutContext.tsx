import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  lastSession,
  createSession,
  getSession,
} from "../Services/WorkoutService";

const WorkoutContext = createContext<WorkoutContextType>(
  {} as WorkoutContextType
);

type Props = {
  children: React.ReactNode;
};

type WorkoutContextType = {
  session: UserSession | null;
  refreshSession: (workoutId: string) => void;
  createNewSession: () => Promise<any>;
};

export type UserSession = {
  workoutId: string;
  workoutName: string;
  workoutNotes: string;
  startTime: Date;
  endTime: Date;
  userExercises: UserExercise[];
};

export type UserExercise = {
  name: string;
  userExerciseId: string;
  exerciseId: string;
  order: number;
  description: string;
  imgUrl: string;
};

const WorkoutProvider = ({ children }: Props) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const navigate = useNavigate();

  const refreshSession = async (workoutId: string) => {
    try {
      const res = await getSession(workoutId);
      setSession(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const createNewSession = async () => {
    try {
      const res = await createSession();
      setSession(res.data.data);
      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        session,
        refreshSession,
        createNewSession,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  return useContext(WorkoutContext);
};

export default WorkoutProvider;
