import type { SearchType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { searchExercise, searchUser } from "./react-query/functions";
import { PageSize } from "@/pages/UserProfilePage";

export const useSearch = (type: SearchType, page: number, query: string) => {
  return useQuery({
    queryKey: ["search", query, page, type],
    queryFn: async () => {
      console.log(query);
      if (!query.trim()) return [];

      switch (type) {
        case "exercise":
          return searchExercise(query, PageSize, page);
        case "user":
          return searchUser(query, PageSize, page);

        default:
          return [];
      }
    },
    enabled: Boolean(type) && query.trim().length > 0,
    staleTime: 60 * 1000,
  });
};
