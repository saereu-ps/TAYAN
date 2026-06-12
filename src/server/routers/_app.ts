import { router } from '../trpc';
import { roomRouter } from './room';
import { planeRouter } from './plane';
import { authRouter } from './auth';
import { exchangeRouter } from './exchange';

export const appRouter = router({
  auth: authRouter,
  room: roomRouter,
  plane: planeRouter,
  exchange: exchangeRouter,
});

export type AppRouter = typeof appRouter;
