import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProjectFormData } from "../_libs/validations/project-schema";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteProject, isPending: projectLoading } = useMutation(
    {
      mutationFn: async (projectId: string) => {
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to save project");
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project deleted successfully");
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    },
  );

  return { deleteProject, projectLoading };
};
