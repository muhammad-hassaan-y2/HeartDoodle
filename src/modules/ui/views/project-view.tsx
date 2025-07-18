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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/file-explorer";



interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });
  console.log(hasProAccess)

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

    const trpc = useTRPC();
    const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
        
     }))
     console.log(project)

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
            <Tabs
             className="h-full gap-y-0 "
             defaultValue="preview"
             value={tabState}
             onValueChange={(value) => setTabState(value as "preview" | "code")}
             >
              <div className="w-full flex items-center border-b gap-x-2 ">
                <TabsList className="h-8 p-0 border rounded-md">
                  <TabsTrigger value="preview" className="rounded-md">
                 
                    <EyeIcon /> 
                      <span>Demo</span>
                  </TabsTrigger>

                  <TabsTrigger value="code" className="rounded-md">
                    <CodeIcon /> 
                      <span>Code</span>
                  </TabsTrigger>
                  </TabsList>  
                   <div className="ml-auto flex items-centergap-x-2">
                     <Button
                      asChild
                      size="sm"
                      variant="default">
                       <Link href={"/pricing"}>
                         <CrownIcon /> Upgrade
                       </Link>
                     </Button>
                   </div>      
              </div>
             <TabsContent value="preview">
               {!!activeFragment && <FragmentWeb data={activeFragment}/>}     
             </TabsContent>
             
             <TabsContent value="code" className="min-h-0">
               {!!activeFragment?.files && (
                 <FileExplorer files={activeFragment.files as { [path: string]: string }} />
               )}
             </TabsContent>
            </Tabs>
          </ResizablePanel>
        
        </ResizablePanelGroup>
    </div>
   )
}