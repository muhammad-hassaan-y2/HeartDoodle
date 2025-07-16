import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient, trpc } from '@/trpc/server';
import React, { Suspense } from 'react'
import { ProjectView } from '@/modules/ui/views/project-view';

interface Props {
    params: Promise<{
        projectId: string;
    }>
}


const Page = async ({ params }: Props) => {
    const { projectId } = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId,
    }));
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id: projectId,
    }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
     <Suspense fallback={<p>Loading Project...</p>}>
      <ProjectView projectId={projectId} />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page