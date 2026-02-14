import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { upsertUser } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("financialProfile", () => {
  beforeAll(async () => {
    // Criar usuário de teste no banco antes dos testes
    await upsertUser({
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
    });
  });
  it("deve calcular corretamente a verba de lazer (30% da renda)", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const monthlyIncome = 500000; // R$ 5.000,00 em centavos
    const fixedExpenses = 250000; // R$ 2.500,00 em centavos

    const result = await caller.financialProfile.upsert({
      monthlyIncome,
      fixedExpenses,
    });

    expect(result).toBeDefined();
    expect(result?.monthlyIncome).toBe(monthlyIncome);
    expect(result?.fixedExpenses).toBe(fixedExpenses);
    expect(result?.leisureBudget).toBe(150000); // 30% de 500000 = 150000
  });

  it("deve retornar undefined quando não há perfil cadastrado", async () => {
    const ctx = createAuthContext();
    // Usar um ID diferente para garantir que não há perfil
    ctx.user!.id = 99999;
    const caller = appRouter.createCaller(ctx);

    const result = await caller.financialProfile.get();

    expect(result).toBeUndefined();
  });
});
