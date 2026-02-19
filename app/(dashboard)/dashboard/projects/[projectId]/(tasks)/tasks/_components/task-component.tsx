"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder, Plus } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useGetTasks } from "../_hooks/useGetTasks";
import { TaskTable } from "./task-table";

export function TaskComponent() {

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and organize your Tasks
          </p>
        </div>
      </div>

      {/* Task Table */}
      <TaskTable />
    </div>
  );
}
