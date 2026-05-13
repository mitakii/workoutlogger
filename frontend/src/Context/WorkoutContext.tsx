import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  lastSession,
  createSession,
  getSession,
} from "../Services/WorkoutService";
import { useUserContext } from "./UserContext";

const WorkoutContext = createContext<WorkoutContextType>(
  {} as WorkoutContextType
);

type Props = {
  children: React.ReactNode;
};

type WorkoutContextType = {
  session: UserSession | null;
  refreshSession: (workoutId: string) => void;
  createNewSession: () => Promise<UserSession>;
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
  id: string;
  exerciseName: string;
  order: number;
  exerciseDescription: string;
  imageUrl: string;
  userSets: UserSet[] | undefined;
};

export type UserSet = {
  id: string;
  weight: string;
  reps: string;
  order: number;
};

const WorkoutProvider = ({ children }: Props) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const checkLastWorkout = async () => {
      try {
        const res = await lastSession();
        setSession(res);
      } catch (e) {
        setSession(null);
      }
      setLoading(false);
    };

    if (!user) {
      setLoading(false);
      return;
    }
    checkLastWorkout();
  }, [user]);

  const refreshSession = async (workoutId: string) => {
    try {
      const res: UserSession = await getSession(workoutId);
      setSession(res);
      return;
    } catch (e) {
      console.log(e);
    }
  };

  const createNewSession = async (): Promise<UserSession> => {
    try {
      const res = await createSession();
      setSession(res);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
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
      {!isLoading ? children : <div>Loading ...</div>}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  return useContext(WorkoutContext);
};

export default WorkoutProvider;
