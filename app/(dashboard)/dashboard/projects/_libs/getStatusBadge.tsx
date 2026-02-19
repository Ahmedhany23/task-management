import { Badge } from "@/components/ui/badge";
import { ProjectStatus } from "../_types/projectType";


export const getStatusBadge = (status: ProjectStatus) => {
  const variants = {
    ACTIVE: "default",
    COMPLETED: "secondary",
    ARCHIVED: "outline",
  } as const;

  return (
    <Badge variant={variants[status]} className="capitalize">
      {status.toLowerCase().replace("_", " ")}
    </Badge>
  );
};
