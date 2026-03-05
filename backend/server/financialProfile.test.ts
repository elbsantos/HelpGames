import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { upsertUser, getUserByOpenId } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number, openId: string): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId,
    email: `${openId}@example.com`,
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

let user1Id: number;
let user2Id: number;

describe("financialProfile", () => {
  beforeAll(async () => {
    // Criar utilizadores de teste no banco antes dos testes
    await upsertUser({
      openId: "test-fp-calc-1",
      email: "test-fp-calc-1@example.com",
      name: "Test FP Calc 1",
      loginMethod: "manus",
      role: "user",
    });
    await upsertUser({
      openId: "test-fp-calc-2",
      email: "test-fp-calc-2@example.com",
      name: "Test FP Calc 2",
      loginMethod: "manus",
      role: "user",
    });
    // Obter os IDs reais da BD
    const u1 = await getUserByOpenId("test-fp-calc-1");
    const u2 = await getUserByOpenId("test-fp-calc-2");
    user1Id = u1!.id;
    user2Id = u2!.id;
  });

  it("deve calcular correctamente a verba de lazer (60% do saldo disponível)", async () => {
    const ctx = createAuthContext(user1Id, "test-fp-calc-1");
    const caller = appRouter.createCaller(ctx);

    const monthlyIncome = 350000; // R$ 3.500,00 em centavos
    const fixedExpenses = 250000; // R$ 2.500,00 em centavos
    // Saldo disponível = 3.500 - 2.500 = 1.000
    // Lazer = 60% de 1.000 = 600 (R$ 600,00)

    const result = await caller.financialProfile.upsert({
      monthlyIncome,
      fixedExpenses,
    });

    expect(result).toBeDefined();
    expect(result?.monthlyIncome).toBe(monthlyIncome);
    expect(result?.fixedExpenses).toBe(fixedExpenses);
    expect(result?.leisureBudget).toBe(60000); // 60% de (350000 - 250000) = 60000
  });

  it("deve calcular correctamente quando despesas = 0", async () => {
    const ctx = createAuthContext(user2Id, "test-fp-calc-2");
    const caller = appRouter.createCaller(ctx);

    const monthlyIncome = 500000; // R$ 5.000,00
    const fixedExpenses = 0;
    // Saldo disponível = 5.000 - 0 = 5.000
    // Lazer = 60% de 5.000 = 3.000

    const result = await caller.financialProfile.upsert({
      monthlyIncome,
      fixedExpenses,
    });

    expect(result).toBeDefined();
    expect(result?.leisureBudget).toBe(300000); // 60% de 500000 = 300000
  });

  it("deve retornar undefined quando não há perfil cadastrado", async () => {
    const ctx = createAuthContext(99999, "test-no-profile-fp");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.financialProfile.get();

    expect(result).toBeUndefined();
  });
});
