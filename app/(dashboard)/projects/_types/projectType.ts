// Types
export type ProjectStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED";


export interface IProject {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  emoji: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    tasks: number;
    members: number;
  };
}