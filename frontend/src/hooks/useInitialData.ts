import type { SearchPickerType, SearchType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useGetUserTemplates } from "./react-query";
import { PAGE_SIZE } from "@/lib/constants";
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
          return getUserTemplates(page, PAGE_SIZE);

        default:
          return [];
      }
    },
    enabled: Boolean(type),
  });
};
