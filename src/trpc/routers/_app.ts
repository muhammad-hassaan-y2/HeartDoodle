import { projectsRouter } from '@/modules/projects/server/procedure';
import { createTRPCRouter } from '../init';
import { messageRouter } from '@/modules/messages/server/procedure';


export const appRouter = createTRPCRouter({
      messages: messageRouter,
      projects: projectsRouter,
     
})
export type AppRouter = typeof appRouter;