import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========================================
// FINANCIAL PROFILE QUERIES
// ========================================

import { avoidedBets, crisisMessages, financialProfiles, goals, InsertFinancialProfile, InsertAvoidedBet, InsertGoal, InsertCrisisMessage } from "../drizzle/schema";
import { desc, sql, and, gte } from "drizzle-orm";

export async function getFinancialProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(financialProfiles).where(eq(financialProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertFinancialProfile(userId: number, data: { monthlyIncome: number; fixedExpenses: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Saldo restante apos despesas
  const remainingBudget = Math.max(0, data.monthlyIncome - data.fixedExpenses);
  
  // Proporção 3:2 (lazer:poupança) do saldo restante
  // Lazer = 60% do saldo (3/5)
  const leisureBudget = Math.floor(remainingBudget * 0.6);
  
  const values: InsertFinancialProfile = {
    userId,
    monthlyIncome: data.monthlyIncome,
    fixedExpenses: data.fixedExpenses,
    leisureBudget,
  };
  
  await db.insert(financialProfiles).values(values).onDuplicateKeyUpdate({
    set: {
      monthlyIncome: data.monthlyIncome,
      fixedExpenses: data.fixedExpenses,
      leisureBudget,
      updatedAt: new Date(),
    },
  });
  
  return getFinancialProfile(userId);
}

// ========================================
// AVOIDED BETS QUERIES
// ========================================

export async function createAvoidedBet(userId: number, data: { amount: number; emotionalContext?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertAvoidedBet = {
    userId,
    amount: data.amount,
    emotionalContext: data.emotionalContext,
  };
  
  const result = await db.insert(avoidedBets).values(values);
  return result;
}

export async function getAvoidedBets(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(avoidedBets).where(eq(avoidedBets.userId, userId)).orderBy(desc(avoidedBets.createdAt)).limit(limit);
}

export async function getTotalPreservedMoney(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ total: sql<number>`COALESCE(SUM(${avoidedBets.amount}), 0)` })
    .from(avoidedBets)
    .where(eq(avoidedBets.userId, userId));
  
  return result[0]?.total || 0;
}

export async function getDaysWithoutBetting(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select().from(avoidedBets)
    .where(eq(avoidedBets.userId, userId))
    .orderBy(desc(avoidedBets.createdAt))
    .limit(1);
  
  if (result.length === 0) return 0;
  
  const lastBet = result[0];
  const daysDiff = Math.floor((Date.now() - lastBet.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  return daysDiff;
}

// ========================================
// GOALS QUERIES
// ========================================

export async function createGoal(userId: number, data: { title: string; targetAmount: number; imageUrl?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertGoal = {
    userId,
    title: data.title,
    targetAmount: data.targetAmount,
    imageUrl: data.imageUrl,
  };
  
  const result = await db.insert(goals).values(values);
  return result;
}

export async function getGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
}

export async function updateGoal(goalId: number, userId: number, data: Partial<{ title: string; targetAmount: number; imageUrl: string; isCompleted: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(goals)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
}

export async function deleteGoal(goalId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(goals).where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
}

// ========================================
// CRISIS MESSAGES QUERIES
// ========================================

export async function createCrisisMessage(userId: number, message: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertCrisisMessage = {
    userId,
    message,
  };
  
  const result = await db.insert(crisisMessages).values(values);
  return result;
}

export async function getCrisisMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(crisisMessages)
    .where(and(eq(crisisMessages.userId, userId), eq(crisisMessages.isActive, 1)))
    .orderBy(desc(crisisMessages.createdAt));
}

export async function updateCrisisMessage(messageId: number, userId: number, data: { message?: string; isActive?: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(crisisMessages)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(crisisMessages.id, messageId), eq(crisisMessages.userId, userId)));
}

export async function deleteCrisisMessage(messageId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(crisisMessages).where(and(eq(crisisMessages.id, messageId), eq(crisisMessages.userId, userId)));
}

// ========================================
// STATISTICS QUERIES
// ========================================

export async function getStatistics(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const totalPreserved = await getTotalPreservedMoney(userId);
  const daysWithoutBetting = await getDaysWithoutBetting(userId);
  const betsCount = await db.select({ count: sql<number>`COUNT(*)` })
    .from(avoidedBets)
    .where(eq(avoidedBets.userId, userId));
  
  return {
    totalPreserved,
    daysWithoutBetting,
    totalBetsAvoided: betsCount[0]?.count || 0,
  };
}


// ========================================
// GAMBLING WEBSITES QUERIES
// ========================================

import { gambling_websites, access_attempts, user_hobbies, InsertAccessAttempt, InsertUserHobby } from "../drizzle/schema";
import { like } from "drizzle-orm";

export async function searchGamblingWebsites(search: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(gambling_websites)
    .where(like(gambling_websites.nome_site, `%${search}%`))
    .limit(limit);
}

export async function registerAccessAttempt(userId: number, data: { dominio: string; valor: number; odds?: number; contexto_emocional: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertAccessAttempt = {
    usuario_id: userId,
    dominio: data.dominio,
    valor: data.valor,
    odds: data.odds?.toString(),
    contexto_emocional: data.contexto_emocional,
  };
  
  const result = await db.insert(access_attempts).values(values);
  return result;
}

// ========================================
// USER HOBBIES QUERIES
// ========================================

export async function getUserHobbies(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(user_hobbies).where(eq(user_hobbies.usuario_id, userId));
}

export async function addUserHobby(userId: number, nome: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertUserHobby = {
    usuario_id: userId,
    nome,
  };
  
  const result = await db.insert(user_hobbies).values(values);
  return result;
}

// ========================================
// LEISURE ALLOCATION QUERIES
// ========================================

import { leisureAllocation, InsertLeisureAllocation } from "../drizzle/schema";

export async function getLeisureAllocation(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(leisureAllocation).where(eq(leisureAllocation.userId, userId));
  return result[0] || null;
}

export async function createOrUpdateLeisureAllocation(userId: number, data: Partial<InsertLeisureAllocation>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getLeisureAllocation(userId);
  
  if (existing) {
    await db.update(leisureAllocation)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leisureAllocation.userId, userId));
  } else {
    const values: InsertLeisureAllocation = {
      userId,
      bettingPercentage: data.bettingPercentage || 10,
      cinemaPercentage: data.cinemaPercentage || 20,
      hobbiesPercentage: data.hobbiesPercentage || 30,
      travelPercentage: data.travelPercentage || 20,
      otherPercentage: data.otherPercentage || 20,
    };
    
    await db.insert(leisureAllocation).values(values);
  }
}

export async function calculateBettingLimit(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const profile = await getFinancialProfile(userId);
  const allocation = await getLeisureAllocation(userId);
  
  if (!profile || !allocation) return 0;
  
  // leisureBudget é 30% da renda
  // bettingPercentage é % dos 30%
  // Então: limite de apostas = leisureBudget * (bettingPercentage / 100)
  const bettingLimit = Math.floor(profile.leisureBudget * (allocation.bettingPercentage / 100));
  
  return bettingLimit;
}

// getBettingSpentThisMonth moved to betting spending tracking section below

// ========================================
// BETS BLOCKAGE QUERIES
// ========================================

import { betsBlockages, InsertBetsBlockage } from "../drizzle/schema";

export async function createBetsBlockage(userId: number, durationMinutes: number = 30) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Calcular até quando o bloqueio deve durar
  const now = new Date();
  const blockedUntil = new Date(now.getTime() + durationMinutes * 60 * 1000);
  
  const values: InsertBetsBlockage = {
    userId,
    blockedUntil,
    reason: `Bloqueio manual de ${durationMinutes} minutos`,
  };
  
  const result = await db.insert(betsBlockages).values(values);
  return result;
}

export async function getActiveBetsBlockage(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const now = new Date();
  const result = await db.select()
    .from(betsBlockages)
    .where(and(
      eq(betsBlockages.userId, userId),
      sql`${betsBlockages.blockedUntil} > ${now}`
    ))
    .orderBy(desc(betsBlockages.createdAt))
    .limit(1);
  
  return result[0] || null;
}

export async function getRemainingBlockageTime(userId: number) {
  const blockage = await getActiveBetsBlockage(userId);
  if (!blockage) return 0;
  
  const now = new Date();
  const remainingMs = blockage.blockedUntil.getTime() - now.getTime();
  return Math.max(0, Math.ceil(remainingMs / 1000)); // retorna em segundos
}

export async function isUserBetsBlocked(userId: number) {
  const blockage = await getActiveBetsBlockage(userId);
  return blockage !== null;
}


// ========================================
// BETTING SPENDING TRACKING
// ========================================

export async function addBettingSpending(userId: number, amount: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const profile = await getFinancialProfile(userId);
  if (!profile) throw new Error("Financial profile not found");
  
  // Verificar se precisa fazer reset mensal
  const now = new Date();
  const lastReset = new Date(profile.lastResetDate);
  const needsReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
  
  const newSpent = needsReset ? amount : (profile.bettingSpentThisMonth || 0) + amount;
  
  await db.update(financialProfiles)
    .set({
      bettingSpentThisMonth: newSpent,
      lastResetDate: needsReset ? now : profile.lastResetDate,
      updatedAt: new Date(),
    })
    .where(eq(financialProfiles.userId, userId));
  
  return getFinancialProfile(userId);
}

export async function getBettingSpentThisMonth(userId: number) {
  const profile = await getFinancialProfile(userId);
  if (!profile) return 0;
  
  // Verificar se precisa fazer reset mensal
  const now = new Date();
  const lastReset = new Date(profile.lastResetDate);
  const needsReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
  
  if (needsReset) {
    // Reset automático
    const db = await getDb();
    if (db) {
      await db.update(financialProfiles)
        .set({
          bettingSpentThisMonth: 0,
          lastResetDate: now,
          updatedAt: new Date(),
        })
        .where(eq(financialProfiles.userId, userId));
    }
    return 0;
  }
  
  return profile.bettingSpentThisMonth || 0;
}

export async function resetBettingSpendingIfNeeded(userId: number) {
  const profile = await getFinancialProfile(userId);
  if (!profile) return null;
  
  const now = new Date();
  const lastReset = new Date(profile.lastResetDate);
  const needsReset = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();
  
  if (needsReset) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    await db.update(financialProfiles)
      .set({
        bettingSpentThisMonth: 0,
        lastResetDate: now,
        updatedAt: new Date(),
      })
      .where(eq(financialProfiles.userId, userId));
    
    return getFinancialProfile(userId);
  }
  
  return profile;
}
