import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmojiSelector } from "@/components/emoji-selector";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAddEditProject } from "../_hooks/useAddEditProject";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ProjectFormData, projectSchema } from "../_libs/validations/project-schema";
import { IProject } from "../_types/projectType";

interface ProjectFormModalProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  project?: IProject;
}

export const ProjectFormModal = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  project,
}: ProjectFormModalProps) => {
  const { addEditProject, projectLoading } = useAddEditProject(project?.id);
  const isEditing = !!project;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "📁",
    },
  });

  const emojiValue = watch("emoji");

  // Reset form when dialog opens/closes or project changes
  useEffect(() => {
    if (isAddDialogOpen) {
      if (project) {
        reset({
          name: project.name,
          description: project.description || "",
          emoji: project.emoji || "📁",
        });
      } else {
        reset({
          name: "",
          description: "",
          emoji: "📁",
        });
      }
    }
  }, [isAddDialogOpen, project, reset]);

  const onSubmit = async (data: ProjectFormData) => {
    await addEditProject(data).then(() => {
      reset();
      setIsAddDialogOpen(false);
    });
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <HugeiconsIcon icon={Plus} className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-131.25">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Project" : "Create New Project"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update your project details."
                : "Add a new project to organize your tasks and collaborate with your team."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project description (optional)"
                {...register("description")}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Emoji</Label>
              <EmojiSelector
                value={emojiValue || "📁"}
                onChange={(emoji) => setValue("emoji", emoji)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={projectLoading}>
              {projectLoading
                ? "Saving..."
                : isEditing
                  ? "Update Project"
                  : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
