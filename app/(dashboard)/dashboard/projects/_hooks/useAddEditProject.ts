import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectFormData } from "../_libs/validations/project-schema";

export const useAddEditProject = (projectId?: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync: addEditProject, isPending: projectLoading } = useMutation({
    mutationFn: async (values: ProjectFormData) => {
      const url = projectId ? `/api/projects/${projectId}` : "/api/projects";
      const method = projectId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save project");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(
        projectId
          ? "Project updated successfully"
          : "Project created successfully",
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { addEditProject, projectLoading };
};
