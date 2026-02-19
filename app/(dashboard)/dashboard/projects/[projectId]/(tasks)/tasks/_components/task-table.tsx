"use client";

import { DataTable } from "@/components/data-table";
import { ErrorMessage } from "@/components/error-message";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/generated/prisma/client";
import { formatDate } from "@/helpers/formatDate";
import { CustomColumnDef } from "@/types/definitions";
import { useGetTasks } from "../_hooks/useGetTasks";

export const TaskTable = () => {
  const { data, isLoading, error } = useGetTasks();

  const tasks = data?.data ?? [];

  const columns: CustomColumnDef<Task, unknown>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => <p className="truncate w-40">{row.original.title}</p>,
    },
    {
      header: "Note",
      accessorKey: "note",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <Badge>{row.original.status}</Badge>,
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ row }) => (
        <p>
          {formatDate(row.original.updatedAt, {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      ),
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <p>
          {formatDate(row.original.createdAt, {
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      ),
    },
  ];

  if (error) return <ErrorMessage error={error} />;

  return (
    <DataTable
      columns={columns}
      data={tasks}
      isLoading={isLoading}
      currentPage={data?.pagination.page ?? 1}
      totalPages={data?.pagination.totalPages ?? 1}
    >
      <DataTable.PaginationServer />
    </DataTable>
  );
};
