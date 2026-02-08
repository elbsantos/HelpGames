import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { upsertUser } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

async function createAuthContext(): Promise<TrpcContext> {
  // Garantir que o usuário existe e pegar o ID real do banco
  await upsertUser({
    openId: "test-user-bets",
    email: "testbets@example.com",
    name: "Test Bets User",
    loginMethod: "manus",
    role: "user",
  });
  
  const { getUserByOpenId } = await import("./db");
  const dbUser = await getUserByOpenId("test-user-bets");
  
  if (!dbUser) {
    throw new Error("Failed to create test user");
  }
  
  const user: AuthenticatedUser = dbUser;

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

describe("avoidedBets", () => {
  beforeAll(async () => {
    // Criar usuário de teste no banco antes dos testes
    await upsertUser({
      openId: "test-user-bets",
      email: "testbets@example.com",
      name: "Test Bets User",
      loginMethod: "manus",
      role: "user",
    });
  });
  it("deve criar uma aposta evitada com sucesso", async () => {
    const ctx = await createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const amount = 10000; // R$ 100,00 em centavos
    const emotionalContext = "Ansioso e entediado";

    const result = await caller.avoidedBets.create({
      amount,
      emotionalContext,
    });

    expect(result).toBeDefined();
  });

  it("deve retornar lista de apostas evitadas", async () => {
    const ctx = await createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const list = await caller.avoidedBets.list();

    expect(Array.isArray(list)).toBe(true);
  });

  it("deve calcular o total preservado corretamente", async () => {
    const ctx = await createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Criar algumas apostas evitadas
    await caller.avoidedBets.create({ amount: 5000 }); // R$ 50,00
    await caller.avoidedBets.create({ amount: 10000 }); // R$ 100,00
    await caller.avoidedBets.create({ amount: 2500 }); // R$ 25,00

    const total = await caller.avoidedBets.totalPreserved();

    // O total deve ser pelo menos a soma das apostas criadas
    expect(Number(total)).toBeGreaterThanOrEqual(17500); // R$ 175,00
  });
});
