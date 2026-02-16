import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { getStatusBadge } from "../_libs/getStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckCircle, More01Icon, Users } from "@hugeicons/core-free-icons";
import { IProject } from "../_types/projectType";
import { useDeleteProject } from "../_hooks/useDeleteProject";
import { Spinner } from "@/components/ui/spinner";

export const ProjectCard = ({
  project,
  setIsAddDialogOpen,
  setCurrentProject,
}: {
  project: IProject;
  setIsAddDialogOpen: (open: boolean) => void;
  setCurrentProject: (project: IProject) => void;
}) => {
  const { deleteProject, projectLoading } = useDeleteProject();
  return (
    <Card key={project.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="text-4xl rounded-lg shrink-0">{project?.emoji}</div>
            <div className="min-w-0 flex-1">
              <CardTitle className="truncate">{project.name}</CardTitle>
              {getStatusBadge(project.status)}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HugeiconsIcon icon={More01Icon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsAddDialogOpen(true);
                  setCurrentProject(project);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteProject(project.id)}
                disabled={projectLoading}
              >
                {projectLoading && <Spinner className="mr-2" />}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 min-h-10">
          {project.description || "No description"}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <HugeiconsIcon icon={CheckCircle} className="h-4 w-4" />
          <span>{project._count?.tasks || 0} tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <HugeiconsIcon icon={Users} className="h-4 w-4" />
          <span>{project._count?.members || 0} members</span>
        </div>
      </CardFooter>
    </Card>
  );
};
