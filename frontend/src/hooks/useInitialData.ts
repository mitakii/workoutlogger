import type { SearchPickerType, SearchType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useGetUserTemplates } from "./react-query";
import { PageSize } from "@/pages/UserProfilePage";
import { getUserTemplates } from "./react-query/functions";

export const useInitialData = (
  type: SearchType | SearchPickerType,
  page: number
) => {
  return useQuery({
    queryKey: ["initialData", page, type],
    queryFn: async () => {
      switch (type) {
        case "template":
          return getUserTemplates(page, PageSize);

        default:
          return [];
      }
    },
    enabled: Boolean(type),
  });
};
