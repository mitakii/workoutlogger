import type { SearchPickerType, SearchType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  searchExercise,
  searchTemplate,
  searchUser,
} from "./react-query/functions";
import { PAGE_SIZE } from "@/lib/constants";

export const useSearch = (
  type: SearchType | SearchPickerType,
  page: number,
  query: string
) => {
  return useQuery({
    queryKey: ["search", query, page, type],
    queryFn: async () => {
      if (!query.trim()) return [];

      switch (type) {
        case "workoutExercise":
          return searchExercise(query, PAGE_SIZE, page);
        case "user":
          return searchUser(query, PAGE_SIZE, page);
        case "template":
          return searchTemplate(query, PAGE_SIZE, page);
        case "templateExercise":
          return searchExercise(query, PAGE_SIZE, page);
        case "exercise":
          return searchExercise(query, PAGE_SIZE, page);

        default:
          return [];
      }
    },
    enabled: Boolean(type) && query.trim().length > 0,
    staleTime: 60 * 1000,
  });
};
