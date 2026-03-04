import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import Stripe from "stripe";
import { STRIPE_PRICES, type Country, type BillingInterval } from "./products";
import { TRPCError } from "@trpc/server";

// Lista de fallback de domínios de apostas (usada quando a BD está indisponível)
const FALLBACK_DOMAINS = [
  "bet365.com","betano.com.br","betano.com","betfair.com",
  "betsul.com.br","betsul.com","betmotion.com","betmotion.com.br",
  "betclic.com.br","betclic.com","rivalo.com.br","rivalo.com",
  "dafabet.com","parimatch.com.br","parimatch.com",
  "sportingbet.com","sportingbet.com.br",
  "betpix365.com","betpix.com","betpix.bet",
  "esportiva.bet","superbet.com.br","superbet.com",
  "vaidebet.com","vaidebet.bet","estrela.bet","estrelabet.com",
  "novibet.com.br","novibet.com","betsson.com","betsson.com.br",
  "unibet.com","unibet.com.br","1xbet.com","1xbet.com.br",
  "22bet.com","22bet.com.br","melbet.com","melbet.com.br",
  "mostbet.com","mostbet.com.br",
  "pin-up.bet","pinup.bet","pinup.com.br",
  "blaze.com","blaze.bet.br","brazino777.com",
  "cassino.com","cassino.bet","pixbet.com","pixbet.bet",
  "betboo.com","betboo.com.br","betway.com","betway.com.br",
  "bet7k.com","bet7k.bet","betnacional.com","betnacional.bet",
  "betesporte.com","betesporte.bet","segurobet.com","segurobet.bet",
  "apostaganha.com","apostaganha.bet","br4bet.com","br4bet.bet",
  "realsbet.com","realsbet.bet","sportsbet.io","sportsbet.com.br",
  "mrjackbet.com","galera.bet","galerabet.com",
  "f12.bet","f12bet.com","h2bet.com","h2bet.bet",
  "kto.com","kto.bet","leovegas.com","leovegas.com.br",
  "betcris.com","betcris.com.br","codere.com.br","codere.bet",
  "bwin.com","bwin.com.br","williamhill.com","ladbrokes.com",
  "coral.co.uk","paddypower.com","skybet.com","betvictor.com",
  "888sport.com","888sport.com.br","marathonbet.com","pinnacle.com",
  "betking.com","betwild.com","bethard.com","nordicbet.com",
  "casumo.com","casumo.com.br",
  "888casino.com","888casino.com.br","888poker.com",
  "pokerstars.com","pokerstars.net","pokerstars.com.br",
  "partypoker.com","ggpoker.com",
  "betclic.pt","bet.pt","solverde.pt","solverde.com",
  "casino.pt","placard.pt","placard.com",
  "betway.pt","bwin.pt","unibet.pt","sportingbet.pt",
  "betano.pt","moosh.pt","casino-estoril.pt","casino-lisboa.pt",
  "estorilsol.pt","luckia.pt","888casino.pt","leovegas.pt",
  "casumo.pt","bet365.pt","betsson.pt","nordicbet.pt",
  "betfair.pt","williamhill.pt","coral.pt","ladbrokes.pt",
  "stake.com","stake.us","rollbit.com","roobet.com",
  "duelbits.com","bc.game","cloudbet.com","nitrogen.sports",
  "betcoin.ag","1xbit.com","fortunejack.com","bitstarz.com",
  "gg.bet","ggbet.com","loot.bet","thunderpick.com",
  "betspawn.com","rivalry.com","unikrn.com",
  "draftkings.com","fanduel.com","prizepicks.com",
  "betmgm.com","pointsbet.com","foxbet.com",
  "slottica.com","jetspin.com","jackpotcity.com","spinpalace.com",
  "platincasino.com","casinoroom.com","playmillion.com",
  "rizk.com","mrgreen.com","videoslots.com","casinoeuro.com",
  "bovada.lv","betonline.ag","mybookie.ag","sportsbetting.ag",
];

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
    temporalEvolution: protectedProcedure.query(async ({ ctx }) => {
      const { getTemporalEvolutionData } = await import("./db");
      return getTemporalEvolutionData(ctx.user.id);
    }),
  }),

  // Gambling Websites
  gambling: router({
    searchSites: publicProcedure
      .input(z.object({ search: z.string().min(1) }))
      .query(async ({ input }) => {
        const { searchGamblingWebsites } = await import("./db");
        return searchGamblingWebsites(input.search);
      }),
    registerAccessAttempt: protectedProcedure
      .input(z.object({
        dominio: z.string(),
        valor: z.number().min(0),
        odds: z.number().optional(),
        contexto_emocional: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { registerAccessAttempt, addBettingSpending } = await import("./db");
        // Registrar tentativa de acesso
        await registerAccessAttempt(ctx.user.id, input);
        // Rastrear gasto em apostas
        const updatedProfile = await addBettingSpending(ctx.user.id, input.valor);
        return {
          success: true,
          message: "Tentativa registrada e gasto rastreado",
          updatedProfile,
        };
      }),
  }),

  // Profile
  profile: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const { getFinancialProfile } = await import("./db");
      return getFinancialProfile(ctx.user.id);
    }),
  }),

  // Hobbies
  hobbies: router({
    listHobbies: protectedProcedure.query(async ({ ctx }) => {
      const { getUserHobbies } = await import("./db");
      return getUserHobbies(ctx.user.id);
    }),
    addHobby: protectedProcedure
      .input(z.object({ nome: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const { addUserHobby } = await import("./db");
        return addUserHobby(ctx.user.id, input.nome);
      }),
  }),

  // Bloqueio de Bets
  betsBlockage: router({
    activate: protectedProcedure
      .input(z.object({
        durationMinutes: z.number().min(1).default(30),
      }).optional())
      .mutation(async ({ ctx, input }) => {
        const { createBetsBlockage } = await import("./db");
        const duration = input?.durationMinutes || 30;
        await createBetsBlockage(ctx.user.id, duration);
        return {
          success: true,
          message: `Bloqueio de apostas ativado por ${duration} minutos`,
          blockedUntil: new Date(Date.now() + duration * 60 * 1000),
        };
      }),
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const { getActiveBetsBlockage, getRemainingBlockageTime } = await import("./db");
      const blockage = await getActiveBetsBlockage(ctx.user.id);
      const remainingSeconds = await getRemainingBlockageTime(ctx.user.id);
      
      return {
        isBlocked: blockage !== null,
        blockage,
        remainingSeconds,
        remainingMinutes: Math.ceil(remainingSeconds / 60),
      };
    }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const { getBlockageHistory } = await import("./db");
      return getBlockageHistory(ctx.user.id);
    }),
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const { getBlockageStats } = await import("./db");
      return getBlockageStats(ctx.user.id);
    }),
  }),
  
  // Relatório Mensal
  monthlyReport: router({
    send: protectedProcedure.mutation(async ({ ctx }) => {
      const { sendMonthlyReport } = await import("./db");
      const sent = await sendMonthlyReport(ctx.user.id);
      return { success: sent, message: sent ? "Relatório enviado com sucesso!" : "Erro ao enviar relatório" };
    }),
    
    toggleEmail: protectedProcedure.input(z.object({ enabled: z.boolean() })).mutation(async ({ ctx, input }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { financialProfiles } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      await db
        .update(financialProfiles)
        .set({ monthlyReportEnabled: input.enabled ? 1 : 0 })
        .where(eq(financialProfiles.userId, ctx.user.id));

      return { success: true, message: input.enabled ? "Relatórios mensais ativados" : "Relatórios mensais desativados" };
    }),
  }),

  betblocker: router({
    recordActivation: protectedProcedure
      .input(z.object({
        platform: z.enum(['windows', 'macos', 'ios', 'android']),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { recordBetBlockerActivation } = await import("./db");
        await recordBetBlockerActivation(ctx.user.id, input.platform, input.notes);
        return { success: true, message: 'BetBlocker ativado com sucesso!' };
      }),
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const { getBetBlockerStatus } = await import("./db");
      return getBetBlockerStatus(ctx.user.id);
    }),
    getHistoryByType: protectedProcedure.query(async ({ ctx }) => {
      const { getBlockageHistoryByType } = await import("./db");
      return getBlockageHistoryByType(ctx.user.id);
    }),
  }),

  extension: router({
    logBlockingEvent: protectedProcedure
      .input(z.object({
        eventType: z.enum(['activated', 'deactivated', 'crisis_mode']),
        duration: z.number().min(0),
      }))
      .mutation(async ({ ctx, input }) => {
        const { recordBlockageHistory } = await import('./db');
        await recordBlockageHistory(
          ctx.user.id,
          input.eventType === 'crisis_mode' ? 'both' : 'helpgames_30min',
          Math.floor(input.duration / 60000),
          input.eventType
        );
        return { success: true };
      }),

    getBlockingStats: protectedProcedure.query(async ({ ctx }) => {
      const { getBlockageHistoryByType } = await import('./db');
      return getBlockageHistoryByType(ctx.user.id);
    }),
  }),

  // Subscrição / Planos
  subscription: router({
    // Obter plano atual do utilizador
    getCurrent: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import('./db');
      const { users } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) return { plan: 'free', planCountry: null, planInterval: null, planExpiresAt: null };
      const [user] = await db.select({
        plan: users.plan,
        planCountry: users.planCountry,
        planInterval: users.planInterval,
        planExpiresAt: users.planExpiresAt,
      }).from(users).where(eq(users.id, ctx.user.id));
      return user ?? { plan: 'free', planCountry: null, planInterval: null, planExpiresAt: null };
    }),

    // Criar sessão de checkout Stripe
    createCheckout: protectedProcedure
      .input(z.object({
        country: z.enum(['PT', 'BR']),
        interval: z.enum(['monthly', 'annual']),
      }))
      .mutation(async ({ ctx, input }) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });
        const priceConfig = STRIPE_PRICES[input.country as Country][input.interval as BillingInterval];
        const origin = ctx.req.headers.origin || 'http://localhost:3000';

        // Criar ou obter customer Stripe
        const { getDb } = await import('./db');
        const { users } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Base de dados indisponível' });
        const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));

        let customerId = user?.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email ?? undefined,
            name: ctx.user.name ?? undefined,
            metadata: { userId: ctx.user.id.toString() },
          });
          customerId = customer.id;
          await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, ctx.user.id));
        }

        // Criar preço dinâmico
        const price = await stripe.prices.create({
          currency: priceConfig.currency,
          unit_amount: priceConfig.amount,
          recurring: { interval: priceConfig.interval },
          product_data: {
            name: `HelpGames Premium - ${input.country === 'PT' ? 'Portugal' : 'Brasil'} (${input.interval === 'monthly' ? 'Mensal' : 'Anual'})`,
          },
        });

        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          mode: 'subscription',
          line_items: [{ price: price.id, quantity: 1 }],
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email ?? '',
            customer_name: ctx.user.name ?? '',
            country: input.country,
            interval: input.interval,
          },
          success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/precos`,
        });

        return { url: session.url };
      }),

    // Cancelar subscrição
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });
      const { getDb } = await import('./db');
      const { users } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Base de dados indisponível' });
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));
      if (!user?.stripeSubscriptionId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Sem subscrição ativa' });
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      await db.update(users).set({ plan: 'free', stripeSubscriptionId: null, planExpiresAt: null }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),
  }),

  // Bloqueio de Sites - API pública para a extensão
  blockList: router({
    // Endpoint público: extensão obtém lista de domínios bloqueados
    getDomains: publicProcedure.query(async () => {
      const { getDb } = await import('./db');
      const { gambling_websites } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) {
        // Fallback: lista embutida de domínios principais
        return { domains: FALLBACK_DOMAINS, total: FALLBACK_DOMAINS.length, source: 'fallback' };
      }
      const sites = await db.select({ domain: gambling_websites.domain })
        .from(gambling_websites)
        .where(eq(gambling_websites.is_active, 1))
        .limit(5000);
      const domains = sites.map(s => s.domain);
      // Se a BD estiver vazia, devolver fallback
      if (domains.length === 0) {
        return { domains: FALLBACK_DOMAINS, total: FALLBACK_DOMAINS.length, source: 'fallback' };
      }
      return { domains, total: domains.length, source: 'database' };
    }),
    // Admin: adicionar domínio à lista
    addDomain: protectedProcedure
      .input(z.object({ dominio: z.string().min(3), nome_site: z.string().optional(), categoria: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { getDb } = await import('./db');
        const { gambling_websites } = await import('../drizzle/schema');
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        await db.insert(gambling_websites).values({
          domain: input.dominio.toLowerCase().replace(/^www\./, ''),
          site_name: input.nome_site ?? null,
          category: input.categoria ?? null,
          country: null,
          is_active: 1,
        }).onDuplicateKeyUpdate({ set: { is_active: 1 } });
        return { success: true };
      }),
  }),

  // Gestão de conta
  account: router({
    // Cancelar assinatura e voltar para plano gratuito
    cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      const { getDb } = await import('./db');
      const { users } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Base de dados indisponível' });
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));
      if (!user?.stripeSubscriptionId) throw new TRPCError({ code: 'NOT_FOUND', message: 'Sem assinatura ativa' });
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      await db.update(users).set({ plan: 'free', stripeSubscriptionId: null, planExpiresAt: null }).where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

    // Excluir conta: apaga todos os dados e cancela assinatura
    deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
      const { getDb } = await import('./db');
      const { users, avoidedBets, goals, crisisMessages, access_attempts, user_hobbies, betsBlockages, betblockerActivations, blockageHistory, financialProfiles, leisureAllocation, premium_subscriptions } = await import('../drizzle/schema');
      const { eq } = await import('drizzle-orm');
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Base de dados indisponível' });

      // Cancelar assinatura Stripe se existir
      const [user] = await db.select().from(users).where(eq(users.id, ctx.user.id));
      if (user?.stripeSubscriptionId) {
        try {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-02-25.clover' });
          await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        } catch (e) {
          console.error('[DeleteAccount] Failed to cancel Stripe subscription', e);
        }
      }

      // Apagar todos os dados do utilizador em cascata
      const uid = ctx.user.id;
      for (const table of [avoidedBets, goals, crisisMessages, access_attempts, user_hobbies, betsBlockages, betblockerActivations, blockageHistory, financialProfiles, leisureAllocation, premium_subscriptions]) {
        try { await (db.delete(table) as any).where(eq((table as any).userId, uid)); } catch {}
      }

      // Apagar o utilizador
      await db.delete(users).where(eq(users.id, uid));

      return { success: true };
    }),
  }),
});
export type AppRouter = typeof appRouter;
