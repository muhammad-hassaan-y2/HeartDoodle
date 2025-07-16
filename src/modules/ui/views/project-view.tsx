"use client"

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MessagesContainer } from "../components/message-container";
import { Suspense, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";


interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

    const trpc = useTRPC();
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
     }))
   
   return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
           defaultSize={35}
            minSize={20}
            className="flex flex-col min-h-0"
           >
         <ProjectHeader 
           projectId={projectId} />
          <Suspense fallback={<p>Loading message...</p>}>
            <MessagesContainer 
              projectId={projectId}
               activeFragment={activeFragment}
               setActiveFragment={setActiveFragment}/>
            </Suspense>

          </ResizablePanel>
           <ResizableHandle withHandle />
          <ResizablePanel
           defaultSize={65}
           minSize={50}
           > 
            {!!activeFragment && <FragmentWeb data={activeFragment}/>}
          </ResizablePanel>
        
        </ResizablePanelGroup>
    </div>
   )
}