import { router } from '../trpc';
import { roomRouter } from './room';
import { planeRouter } from './plane';
import { authRouter } from './auth';

export const appRouter = router({
  auth: authRouter,
  room: roomRouter,
  plane: planeRouter,
});

export type AppRouter = typeof appRouter;
