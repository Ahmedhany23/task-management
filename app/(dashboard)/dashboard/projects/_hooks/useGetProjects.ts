import { useInfiniteQuery } from "@tanstack/react-query";
import { IProject } from "../_types/projectType";



interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProjectsResponse {
  data: IProject[];
  pagination: Pagination;
}

export const useGetProjects = () => {
  return useInfiniteQuery<ProjectsResponse>({
    queryKey: ["projects"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/projects?page=${pageParam}`);

      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }

      return res.json() as Promise<ProjectsResponse>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.pagination.hasPrevPage
        ? firstPage.pagination.page - 1
        : undefined,
  });
};
