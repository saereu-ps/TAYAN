import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc';
import { rooms, exchanges, exchangeResults, genId } from '../store';
import type { ExchangeSubmission, ExchangeResult } from '../store';

// Derangement algorithm — Fisher-Yates variant that ensures no element stays in place
function derange<T>(arr: T[]): T[] {
  const result = [...arr];
  const n = result.length;
  if (n < 2) return result;

  for (let attempts = 0; attempts < 100; attempts++) {
    // Fisher-Yates shuffle
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    // Check if it's a valid derangement (no element in original position)
    let valid = true;
    for (let i = 0; i < n; i++) {
      if (result[i] === arr[i]) { valid = false; break; }
    }
    if (valid) return result;
  }
  // Fallback: simple rotation
  return [...arr.slice(1), arr[0]];
}

export const exchangeRouter = router({
  // Submit a message for exchange
  submit: publicProcedure
    .input(z.object({
      roomId: z.string(),
      participantId: z.string(),
      participantName: z.string().optional(),
      content: z.string().min(1).max(500),
    }))
    .mutation(({ input }) => {
      const room = rooms.get(input.roomId);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      if (room.mode !== 'exchange') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Room is not in exchange mode' });

      const submissions = exchanges.get(input.roomId) || [];
      // Prevent duplicate submission
      const existing = submissions.find(s => s.participantId === input.participantId);
      if (existing) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already submitted' });

      submissions.push({
        participantId: input.participantId,
        participantName: input.participantName || 'Anonymous',
        content: input.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim().slice(0, 500),
        submittedAt: new Date().toISOString(),
      });
      exchanges.set(input.roomId, submissions);

      return { success: true, totalSubmitted: submissions.length };
    }),

  // Get submission count (for admin and participants)
  getStatus: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .query(({ input }) => {
      const submissions = exchanges.get(input.roomId) || [];
      const results = exchangeResults.get(input.roomId) || [];
      const room = rooms.get(input.roomId);
      return {
        totalSubmitted: submissions.length,
        totalParticipants: room?.participantCount || 0,
        isDispatched: results.length > 0,
      };
    }),

  // Admin triggers the shuffle (derangement)
  dispatch: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(({ input }) => {
      const room = rooms.get(input.roomId);
      if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' });
      if (room.mode !== 'exchange') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Not exchange mode' });

      const submissions = exchanges.get(input.roomId) || [];
      if (submissions.length < 2) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Need at least 2 submissions' });

      // Create deranged assignment
      const participantIds = submissions.map(s => s.participantId);
      const shuffledIds = derange(participantIds);

      const results: ExchangeResult[] = [];
      for (let i = 0; i < submissions.length; i++) {
        results.push({
          recipientId: shuffledIds[i],
          message: submissions[i].content,
          senderName: room.revealSenders ? submissions[i].participantName : '',
        });
      }

      exchangeResults.set(input.roomId, results);
      return { success: true, distributed: results.length };
    }),

  // Participant gets their received message
  getMyMessage: publicProcedure
    .input(z.object({ roomId: z.string(), participantId: z.string() }))
    .query(({ input }) => {
      const results = exchangeResults.get(input.roomId) || [];
      const myResult = results.find(r => r.recipientId === input.participantId);
      if (!myResult) return null;
      return { message: myResult.message, senderName: myResult.senderName };
    }),

  // Reset exchange (admin can restart)
  reset: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(({ input }) => {
      exchanges.delete(input.roomId);
      exchangeResults.delete(input.roomId);
      return { success: true };
    }),
});
