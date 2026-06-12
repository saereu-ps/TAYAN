import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { planes, rooms, genId, checkRateLimit } from '../store';
import type { PaperPlane } from '../store';

export const planeRouter = router({
  send: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        content: z.string().min(1).max(1000),
        senderName: z.string().optional(),
        senderSessionId: z.string(),
      }),
    )
    .mutation(({ input }) => {
      const room = rooms.get(input.roomId);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      if (room.status !== 'active')
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Room is not active' });

      // Rate limiting
      if (!checkRateLimit(`send:${input.senderSessionId}`, 10, 60000)) {
        throw new Error('Too many messages. Please wait a moment.');
      }

      // Input sanitization
      const sanitizedContent = input.content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .trim()
        .slice(0, 500);

      const id = genId();
      const plane: PaperPlane = {
        id,
        roomId: input.roomId,
        content: sanitizedContent,
        senderName: input.senderName,
        senderSessionId: input.senderSessionId,
        status: 'active',
        isBroadcasted: false,
        isPinned: false,
        createdAt: new Date().toISOString(),
      };

      planes.set(id, plane);
      return plane;
    }),

  // Admin: get all planes for a room
  getByRoom: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(({ input }) => {
      const result: PaperPlane[] = [];
      planes.forEach((plane) => {
        if (plane.roomId === input.roomId && plane.status === 'active') {
          result.push(plane);
        }
      });
      return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }),

  // Participant: get broadcasted planes
  getBroadcasts: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(({ input }) => {
      const result: PaperPlane[] = [];
      planes.forEach((plane) => {
        if (plane.roomId === input.roomId && plane.isBroadcasted && plane.status === 'active') {
          result.push(plane);
        }
      });
      return result.sort(
        (a, b) =>
          new Date(b.broadcastedAt ?? b.createdAt).getTime() -
          new Date(a.broadcastedAt ?? a.createdAt).getTime(),
      );
    }),

  // Admin: broadcast a plane to all participants
  broadcast: publicProcedure
    .input(z.object({ planeId: z.string() }))
    .mutation(({ input }) => {
      const plane = planes.get(input.planeId);
      if (!plane) throw new TRPCError({ code: 'NOT_FOUND', message: 'Plane not found' });
      plane.isBroadcasted = true;
      plane.broadcastedAt = new Date().toISOString();
      return plane;
    }),

  // Admin: unbroadcast
  unbroadcast: publicProcedure
    .input(z.object({ planeId: z.string() }))
    .mutation(({ input }) => {
      const plane = planes.get(input.planeId);
      if (!plane) throw new TRPCError({ code: 'NOT_FOUND', message: 'Plane not found' });
      plane.isBroadcasted = false;
      plane.broadcastedAt = undefined;
      return plane;
    }),

  // Admin: pin a plane
  pin: publicProcedure
    .input(z.object({ planeId: z.string() }))
    .mutation(({ input }) => {
      const plane = planes.get(input.planeId);
      if (!plane) throw new TRPCError({ code: 'NOT_FOUND', message: 'Plane not found' });
      plane.isPinned = !plane.isPinned;
      return plane;
    }),

  // Admin: remove a plane
  remove: publicProcedure
    .input(z.object({ planeId: z.string() }))
    .mutation(({ input }) => {
      const plane = planes.get(input.planeId);
      if (!plane) throw new TRPCError({ code: 'NOT_FOUND', message: 'Plane not found' });
      plane.status = 'removed';
      return { success: true };
    }),
});
