import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Perfil Financeiro
  financialProfile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getFinancialProfile } = await import("./db");
      return getFinancialProfile(ctx.user.id);
    }),
    upsert: protectedProcedure
      .input(z.object({
        monthlyIncome: z.number().min(0),
        fixedExpenses: z.number().min(0),
      }))
      .mutation(async ({ ctx, input }) => {
        const { upsertFinancialProfile } = await import("./db");
        return upsertFinancialProfile(ctx.user.id, input);
      }),
  }),

  // Apostas Evitadas
  avoidedBets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getAvoidedBets } = await import("./db");
      return getAvoidedBets(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        amount: z.number().min(0),
        emotionalContext: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createAvoidedBet } = await import("./db");
        return createAvoidedBet(ctx.user.id, input);
      }),
    totalPreserved: protectedProcedure.query(async ({ ctx }) => {
      const { getTotalPreservedMoney } = await import("./db");
      return getTotalPreservedMoney(ctx.user.id);
    }),
  }),

  // Metas
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getGoals } = await import("./db");
      return getGoals(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        targetAmount: z.number().min(0),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createGoal } = await import("./db");
        return createGoal(ctx.user.id, input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        targetAmount: z.number().min(0).optional(),
        imageUrl: z.string().optional(),
        isCompleted: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { updateGoal } = await import("./db");
        const { id, ...data } = input;
        return updateGoal(id, ctx.user.id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteGoal } = await import("./db");
        return deleteGoal(input.id, ctx.user.id);
      }),
  }),

  // Mensagens de Crise
  crisisMessages: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getCrisisMessages } = await import("./db");
      return getCrisisMessages(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({ message: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const { createCrisisMessage } = await import("./db");
        return createCrisisMessage(ctx.user.id, input.message);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        message: z.string().min(1).optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { updateCrisisMessage } = await import("./db");
        const { id, ...data } = input;
        return updateCrisisMessage(id, ctx.user.id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteCrisisMessage } = await import("./db");
        return deleteCrisisMessage(input.id, ctx.user.id);
      }),
  }),

  // Estatísticas
  statistics: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getStatistics } = await import("./db");
      return getStatistics(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
