import { initTRPC } from '@trpc/server';

export const createTRPCContext = async () => {
  return {};
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
