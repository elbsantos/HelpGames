import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

let testUserCounter = 1000;

function createAuthContext(): { ctx: TrpcContext } {
  const userId = testUserCounter++;
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-blockage-${userId}`,
    email: `test${userId}@example.com`,
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Bets Blockage", () => {
  beforeEach(() => {
    // Cada teste recebe seu próprio contexto
  });

  describe("activate", () => {
    it("deve ativar bloqueio de bets por 30 minutos", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.betsBlockage.activate();
      
      expect(result.success).toBe(true);
      expect(result.message).toContain("Bloqueio de apostas ativado");
      expect(result.blockedUntil).toBeDefined();
      expect(result.blockedUntil instanceof Date).toBe(true);
    });

    it("deve aceitar duração customizada", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.betsBlockage.activate({ durationMinutes: 60 });
      
      expect(result.success).toBe(true);
      expect(result.message).toContain("60 minutos");
    });

    it("deve rejeitar duração menor que 1 minuto", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      try {
        await caller.betsBlockage.activate({ durationMinutes: 0 });
        expect.fail("Deveria lançar erro");
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe("getStatus", () => {
    it("deve retornar status sem bloqueio ativo", async () => {
      const { ctx: newCtx } = createAuthContext();
      const caller = appRouter.createCaller(newCtx);
      
      const status = await caller.betsBlockage.getStatus();
      
      expect(status.isBlocked).toBe(false);
      expect(status.remainingSeconds).toBe(0);
      expect(status.remainingMinutes).toBe(0);
    });

    it("deve retornar status com bloqueio ativo", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      // Ativar bloqueio
      await caller.betsBlockage.activate({ durationMinutes: 30 });
      
      // Verificar status
      const status = await caller.betsBlockage.getStatus();
      
      expect(status.isBlocked).toBe(true);
      expect(status.remainingSeconds).toBeGreaterThan(0);
      expect(status.remainingSeconds).toBeLessThanOrEqual(30 * 60);
      expect(status.remainingMinutes).toBeGreaterThan(0);
      expect(status.remainingMinutes).toBeLessThanOrEqual(30);
    });

    it("deve retornar tempo restante correto", async () => {
      const { ctx: newCtx } = createAuthContext();
      const caller = appRouter.createCaller(newCtx);
      
      // Ativar bloqueio por 5 minutos
      await caller.betsBlockage.activate({ durationMinutes: 5 });
      
      const status = await caller.betsBlockage.getStatus();
      
      // Deve estar entre 4:55 e 5:00 (em segundos: 295-300)
      expect(status.remainingSeconds).toBeGreaterThanOrEqual(295);
      expect(status.remainingSeconds).toBeLessThanOrEqual(300);
    });
  });

  describe("Integração", () => {
    it("deve registrar bloqueio na ativação", async () => {
      const { ctx: newCtx } = createAuthContext();
      const caller = appRouter.createCaller(newCtx);
      
      const beforeStatus = await caller.betsBlockage.getStatus();
      expect(beforeStatus.isBlocked).toBe(false);
      
      const result = await caller.betsBlockage.activate({ durationMinutes: 10 });
      expect(result.success).toBe(true);
      
      const afterStatus = await caller.betsBlockage.getStatus();
      expect(afterStatus.isBlocked).toBe(true);
      expect(afterStatus.remainingSeconds).toBeGreaterThan(0);
    });

    it("deve manter mensagem consistente com duração", async () => {
      const { ctx: newCtx } = createAuthContext();
      const caller = appRouter.createCaller(newCtx);
      
      const durations = [5, 15, 30, 60];
      
      for (const duration of durations) {
        const { ctx: uniqueCtx } = createAuthContext();
        const uniqueCaller = appRouter.createCaller(uniqueCtx);
        const result = await uniqueCaller.betsBlockage.activate({ durationMinutes: duration });
        expect(result.message).toContain(`${duration} minutos`);
      }
    });
  });
});
