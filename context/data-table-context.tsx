import { createContext, useContext } from "react";
import type { Table } from "@tanstack/react-table";

export interface DataTableContextValue<TData> {
  table: Table<TData>;
  isLoading: boolean;
  totalPages?: number;
  currentPage?: number;
}

const DataTableContext = createContext<DataTableContextValue<unknown> | null>(
  null,
);

export function useDataTable<TData>(): DataTableContextValue<TData> {
  const context = useContext(DataTableContext);

  if (!context) {
    throw new Error("useDataTable must be used within DataTableProvider");
  }

  return context as DataTableContextValue<TData>;
}

interface DataTableProviderProps<TData> {
  value: DataTableContextValue<TData>;
  children: React.ReactNode;
}

export function DataTableProvider<TData>({
  value,
  children,
}: DataTableProviderProps<TData>) {
  return (
    <DataTableContext.Provider
      value={value as DataTableContextValue<unknown>}
    >
      {children}
    </DataTableContext.Provider>
  );
}
