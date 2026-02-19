import type { ColumnDef } from "@tanstack/react-table";

export type CustomColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  headClassName?: string;
  cellClassName?: string;
};