import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();


  const user = session?.user;

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarTrigger className="absolute md:static" />
      <main className="px-4 py-10 w-full mx-auto">{children}</main>
    </SidebarProvider>
  );
};

export default layout;
