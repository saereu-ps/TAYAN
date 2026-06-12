import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { users, genId } from '../store';

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .mutation(({ input }) => {
      const id = genId();
      const user = {
        id,
        name: input.name.trim(),
        createdAt: new Date().toISOString(),
      };
      users.set(id, user);
      return user;
    }),

  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return users.get(input.id) ?? null;
    }),
});
