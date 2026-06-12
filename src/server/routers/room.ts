import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { rooms, roomCodeIndex, genId, genRoomCode } from '../store';

export const roomRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        identityMode: z.enum(['anonymous', 'identified']),
        ownerId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      // Generate unique code
      let code = genRoomCode();
      let attempts = 0;
      while (roomCodeIndex.has(code) && attempts < 20) {
        code = genRoomCode();
        attempts++;
      }

      const id = genId();
      const room = {
        id,
        name: input.name.trim(),
        description: input.description?.trim(),
        code,
        status: 'active' as const,
        identityMode: input.identityMode,
        ownerId: input.ownerId,
        participantCount: 0,
        createdAt: new Date().toISOString(),
      };

      rooms.set(id, room);
      roomCodeIndex.set(code, id);
      return room;
    }),

  list: publicProcedure
    .input(z.object({ ownerId: z.string() }))
    .query(({ input }) => {
      const result: Array<(typeof rooms extends Map<string, infer V> ? V : never)> = [];
      rooms.forEach((room) => {
        if (room.ownerId === input.ownerId) {
          result.push(room);
        }
      });
      return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const room = rooms.get(input.id);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      return room;
    }),

  getByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ input }) => {
      const normalizedCode = input.code.toUpperCase().trim();
      const roomId = roomCodeIndex.get(normalizedCode);
      if (!roomId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      const room = rooms.get(roomId);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      return room;
    }),

  join: publicProcedure
    .input(z.object({ code: z.string(), name: z.string().optional() }))
    .mutation(({ input }) => {
      const normalizedCode = input.code.toUpperCase().trim();
      const roomId = roomCodeIndex.get(normalizedCode);
      if (!roomId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      const room = rooms.get(roomId);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      if (room.status !== 'active')
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Room is not active' });

      room.participantCount++;
      const sessionId = genId();
      return { sessionId, room };
    }),

  updateStatus: publicProcedure
    .input(z.object({ id: z.string(), status: z.enum(['active', 'paused', 'closed']) }))
    .mutation(({ input }) => {
      const room = rooms.get(input.id);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      room.status = input.status;
      return room;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const room = rooms.get(input.id);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      rooms.delete(input.id);
      roomCodeIndex.delete(room.code);
      return { success: true };
    }),
});
