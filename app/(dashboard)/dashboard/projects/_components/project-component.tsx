"use client";

import { useState } from "react";

import { useGetProjects } from "../_hooks/useGetProjects";
import { ProjectFormModal } from "./project-form-modal";
import { ProjectCard } from "./project-card";
import { IProject } from "../_types/projectType";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder, Plus } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export function ProjectComponent() {
  const { data, isLoading, error } = useGetProjects();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(undefined as IProject | undefined);

  const projects = data?.pages.flatMap((page) => page.data) ?? [];

  if (error) return <div>{error.message}</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your projects
          </p>
        </div>

        {/* Add Project Dialog */}
        <ProjectFormModal
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          project={currentProject}
        />
      </div>

      {/* Projects Grid */}

        {projects?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12">
          <HugeiconsIcon
            icon={Folder}
            className="h-12 w-12 text-muted-foreground mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Get started by creating your first project
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project as IProject}
              setCurrentProject={setCurrentProject}
              setIsAddDialogOpen={setIsAddDialogOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}
