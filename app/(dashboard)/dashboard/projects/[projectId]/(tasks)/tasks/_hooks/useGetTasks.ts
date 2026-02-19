"use client";

import { Task } from "@/generated/prisma/client";
import { Pagination } from "@/types/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

export interface TasksResponse {
  data: Task[];
  pagination: Pagination;
}

export const useGetTasks = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");

  return useQuery<TasksResponse>({
    queryKey: ["tasks", projectId, page, limit],
    queryFn: async () => {
      const res = await fetch(
        `/api/projects/${projectId}/tasks?page=${page}&limit=${limit}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return res.json() as Promise<TasksResponse>;
    },
    placeholderData: keepPreviousData,
  });
};
