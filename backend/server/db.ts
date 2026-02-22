import { eq, asc, and, gte, lte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, financialProfiles, betsBlockages, betblockerActivations, blockageHistory, InsertBetblockerActivation, InsertBlockageHistory } from "../drizzle/schema";
import { ENV } from './_core/env';
import { notifyOwner } from './_core/notification';

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

import { avoidedBets, crisisMessages, goals, InsertAvoidedBet, InsertGoal, InsertCrisisMessage, InsertFinancialProfile } from "../drizzle/schema";
import { desc, sql } from "drizzle-orm";

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

import { InsertBetsBlockage } from "../drizzle/schema";

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
  
  if (needsReset) {
    await resetMonthlyNotifications(userId);
  }
  
  await db.update(financialProfiles)
    .set({
      bettingSpentThisMonth: newSpent,
      lastResetDate: needsReset ? now : profile.lastResetDate,
      updatedAt: new Date(),
    })
    .where(eq(financialProfiles.userId, userId));
  
  const updatedProfile = await getFinancialProfile(userId);
  
  if (updatedProfile) {
    const percentageUsed = (updatedProfile.bettingSpentThisMonth / updatedProfile.leisureBudget) * 100;
    if (percentageUsed >= 80) {
      await sendLimitAlertEmail(userId, percentageUsed);
    }
  }
  
  return updatedProfile;
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


export async function getBlockageHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const blockages = await db.select()
    .from(betsBlockages)
    .where(eq(betsBlockages.userId, userId))
    .orderBy(desc(betsBlockages.createdAt));
  
  return blockages.map(blockage => ({
    id: blockage.id,
    createdAt: blockage.createdAt,
    blockedUntil: blockage.blockedUntil,
    reason: blockage.reason,
    wasSuccessful: blockage.blockedUntil <= new Date(), // Se já passou do horário, foi bem-sucedido
    durationMinutes: Math.ceil((blockage.blockedUntil.getTime() - blockage.createdAt.getTime()) / (1000 * 60)),
  }));
}

export async function getBlockageStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalBlockages: 0, successfulBlockages: 0, totalMinutesBlocked: 0 };
  
  const blockages = await db.select()
    .from(betsBlockages)
    .where(eq(betsBlockages.userId, userId));
  
  const now = new Date();
  const successfulBlockages = blockages.filter(b => b.blockedUntil <= now);
  const totalMinutesBlocked = blockages.reduce((sum, b) => {
    const minutes = Math.ceil((b.blockedUntil.getTime() - b.createdAt.getTime()) / (1000 * 60));
    return sum + minutes;
  }, 0);
  
  return {
    totalBlockages: blockages.length,
    successfulBlockages: successfulBlockages.length,
    totalMinutesBlocked,
  };
}


export async function sendLimitAlertEmail(userId: number, percentageUsed: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    // Obter dados do usuário e perfil financeiro
    const user = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    
    if (!user || user.length === 0) return false;
    
    const profile = await db.select()
      .from(financialProfiles)
      .where(eq(financialProfiles.userId, userId))
      .limit(1);
    
    if (!profile || profile.length === 0) return false;
    
    const userData = user[0];
    const profileData = profile[0];
    
    // Verificar se já foi notificado neste nível
    const isAt80 = percentageUsed >= 80 && percentageUsed < 95;
    const isAt95 = percentageUsed >= 95;
    
    if (isAt80 && profileData.notifiedAt80Percent) {
      // Já foi notificado em 80%, não notificar novamente
      return false;
    }
    
    if (isAt95 && profileData.notifiedAt95Percent) {
      // Já foi notificado em 95%, não notificar novamente
      return false;
    }
    
    // Preparar dados do email
    const subject = isAt95 
      ? "🚨 ALERTA CRÍTICO: Você atingiu 95% do seu limite mensal de apostas!"
      : "⚠️ ALERTA: Você atingiu 80% do seu limite mensal de apostas";
    
    const message = isAt95
      ? `Olá ${userData.name},\n\nVocê atingiu 95% do seu limite mensal de apostas (R$ ${(profileData.leisureBudget / 100).toFixed(2)}).\n\nEste é um alerta crítico. Considere parar de apostar este mês para manter seu controle financeiro.\n\nVocê pode ativar o Bloqueio de Bets por 30 minutos para se proteger do impulso.\n\nAtenciosamente,\nEquipe HelpGames`
      : `Olá ${userData.name},\n\nVocê atingiu 80% do seu limite mensal de apostas (R$ ${(profileData.leisureBudget / 100).toFixed(2)}).\n\nCuidado! Você tem apenas 20% do seu limite restante.\n\nConsidere usar o Bloqueio de Bets ou ativar o Modo Crise se precisar de apoio.\n\nAtenciosamente,\nEquipe HelpGames`;
    
    // Usar notifyOwner para enviar notificação (pode ser adaptado para enviar email real)
    const { notifyOwner } = await import("./_core/notification");
    await notifyOwner({
      title: subject,
      content: `${userData.email}: ${message}`,
    });
    
    // Atualizar timestamp de notificação
    if (isAt80) {
      await db.update(financialProfiles)
        .set({ notifiedAt80Percent: new Date() })
        .where(eq(financialProfiles.userId, userId));
    } else if (isAt95) {
      await db.update(financialProfiles)
        .set({ notifiedAt95Percent: new Date() })
        .where(eq(financialProfiles.userId, userId));
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar email de alerta:", error);
    return false;
  }
}

export async function resetMonthlyNotifications(userId: number) {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.update(financialProfiles)
      .set({ 
        notifiedAt80Percent: null,
        notifiedAt95Percent: null,
      })
      .where(eq(financialProfiles.userId, userId));
    
    return true;
  } catch (error) {
    console.error("Erro ao resetar notificações:", error);
    return false;
  }
}


// ========================================
// TEMPORAL EVOLUTION DATA
// ========================================

export async function getTemporalEvolutionData(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  try {
    // Obter apostas evitadas do mês atual
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const avoidedBetsData = await db.select()
      .from(avoidedBets)
      .where(
        and(
          eq(avoidedBets.userId, userId),
          gte(avoidedBets.createdAt, monthStart)
        )
      )
      .orderBy(asc(avoidedBets.createdAt));
    
    // Agrupar por dia e calcular economia acumulada
    const dailyData: Record<string, { date: string; economySaved: number; totalAvoided: number }> = {};
    let accumulatedEconomy = 0;
    
    type EvolutionData = { date: string; economySaved: number; totalAvoided: number };
    const result: EvolutionData[] = [];
    
    for (const bet of avoidedBetsData) {
      const dateKey = bet.createdAt.toISOString().split('T')[0];
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          economySaved: 0,
          totalAvoided: 0,
        };
      }
      
      accumulatedEconomy += bet.amount;
      dailyData[dateKey].economySaved = accumulatedEconomy;
      dailyData[dateKey].totalAvoided += 1;
    }
    
    // Converter para array e preencher dias sem dados
    for (let day = 1; day <= now.getDate(); day++) {
      const date = new Date(now.getFullYear(), now.getMonth(), day);
      const dateKey = date.toISOString().split('T')[0];
      
      if (dailyData[dateKey]) {
        result.push({
          date: dateKey,
          economySaved: Math.round(dailyData[dateKey].economySaved / 100 * 100) / 100, // em reais
          totalAvoided: dailyData[dateKey].totalAvoided,
        });
      } else if (result.length > 0) {
        const lastEntry = result[result.length - 1] as typeof result[0];
        result.push({
          date: dateKey,
          economySaved: lastEntry.economySaved,
          totalAvoided: lastEntry.totalAvoided,
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error("Erro ao obter dados de evolução temporal:", error);
    return [];
  }
}


/**
 * Gera relatório mensal com estatísticas de economia, bloqueios e progresso
 */
export async function generateMonthlyReport(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = userResult[0];

  if (!user) return null;

  const profileResult = await db.select().from(financialProfiles).where(eq(financialProfiles.userId, userId)).limit(1);
  const profile = profileResult[0];

  if (!profile) return null;

  // Obter dados do mês atual
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Contar bloqueios do mês
  const blockages = await db
    .select({ count: count() })
    .from(betsBlockages)
    .where(
      and(
        eq(betsBlockages.userId, userId),
        gte(betsBlockages.createdAt, monthStart),
        lte(betsBlockages.createdAt, monthEnd)
      )
    );

  const blockageCount = blockages[0]?.count || 0;

  // Contar tentativas evitadas (usando access_attempts table)
  const attempts = await db
    .select({ count: count() })
    .from(betsBlockages)
    .where(
      and(
        eq(betsBlockages.userId, userId),
        gte(betsBlockages.createdAt, monthStart),
        lte(betsBlockages.createdAt, monthEnd)
      )
    );

  const attemptCount = attempts[0]?.count || 0;

  // Calcular economia estimada
  // Assumindo média de R$ 50 por tentativa de aposta evitada
  const estimatedSavings = attemptCount * 5000; // em centavos

  // Calcular gasto em apostas
  const bettingSpent = profile.bettingSpentThisMonth;

  // Calcular verba restante
  const remainingBudget = Math.max(0, profile.leisureBudget - bettingSpent);

  return {
    userName: user.name || "Usuário",
    email: user.email,
    month: now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    blockageCount,
    attemptCount,
    estimatedSavings,
    bettingSpent,
    remainingBudget,
    leisureBudget: profile.leisureBudget,
    monthlyIncome: profile.monthlyIncome,
  };
}

/**
 * Envia relatório mensal por email
 */
export async function sendMonthlyReport(userId: number) {
  const db = await getDb();
  if (!db) return false;
  const report = await generateMonthlyReport(userId);

  if (!report) return false;

  const emailContent = `
    <h2>Seu Relatório Mensal - HelpGames</h2>
    <p>Olá ${report.userName},</p>
    
    <p>Aqui está seu relatório de progresso para ${report.month}:</p>
    
    <h3>📊 Estatísticas</h3>
    <ul>
      <li><strong>Bloqueios ativados:</strong> ${report.blockageCount}</li>
      <li><strong>Tentativas de aposta evitadas:</strong> ${report.attemptCount}</li>
      <li><strong>Economia estimada:</strong> R$ ${(report.estimatedSavings / 100).toFixed(2)}</li>
    </ul>
    
    <h3>💰 Gastos em Apostas</h3>
    <ul>
      <li><strong>Gasto do mês:</strong> R$ ${(report.bettingSpent / 100).toFixed(2)}</li>
      <li><strong>Verba de lazer:</strong> R$ ${(report.leisureBudget / 100).toFixed(2)}</li>
      <li><strong>Saldo restante:</strong> R$ ${(report.remainingBudget / 100).toFixed(2)}</li>
    </ul>
    
    <h3>🎯 Próximos Passos</h3>
    <p>Continue usando o HelpGames para manter seu controle financeiro:</p>
    <ul>
      <li>Registre suas tentativas de aposta evitadas</li>
      <li>Use o bloqueio de 30 minutos quando sentir impulso</li>
      <li>Acompanhe seu progresso no dashboard</li>
      <li>Procure ajuda profissional se necessário</li>
    </ul>
    
    <p>Você está fazendo um ótimo trabalho! 🎉</p>
    <p>Equipe HelpGames</p>
  `;

  try {
    await notifyOwner({
      title: `Relatório Mensal: ${report.userName}`,
      content: emailContent,
    });

    // Atualizar data do último relatório enviado
    await db
      .update(financialProfiles)
      .set({ lastMonthlyReportSent: new Date() })
      .where(eq(financialProfiles.userId, userId));

    return true;
  } catch (error) {
    console.error("Erro ao enviar relatório mensal:", error);
    return false;
  }
}

/**
 * Envia relatórios mensais para todos os usuários que têm a opção habilitada
 * Deve ser chamado no primeiro dia de cada mês
 */
export async function sendMonthlyReportsToAllUsers() {
  const db = await getDb();
  if (!db) return 0;
  
  const profiles = await db
    .select({ userId: financialProfiles.userId })
    .from(financialProfiles)
    .where(eq(financialProfiles.monthlyReportEnabled, 1));

  let successCount = 0;
  for (const profile of profiles) {
    const sent = await sendMonthlyReport(profile.userId);
    if (sent) successCount++;
  }

  console.log(
    `Relatórios mensais enviados: ${successCount}/${profiles.length}`
  );
  return successCount;
}


// ========================================
// BETBLOCKER INTEGRATION
// ========================================



export async function recordBetBlockerActivation(
  userId: number,
  platform: 'windows' | 'macos' | 'ios' | 'android',
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertBetblockerActivation = {
    userId,
    platform,
    activatedAt: new Date(),
    notes: notes || null,
  };
  
  const result = await db.insert(betblockerActivations).values(values);
  return result;
}

export async function getBetBlockerStatus(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select()
    .from(betblockerActivations)
    .where(eq(betblockerActivations.userId, userId))
    .orderBy(desc(betblockerActivations.activatedAt))
    .limit(1);
  
  return result[0] || null;
}

export async function recordBlockageHistory(
  userId: number,
  blockageType: 'helpgames_30min' | 'betblocker_permanent' | 'both',
  durationMinutes?: number,
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const values: InsertBlockageHistory = {
    userId,
    blockageType,
    status: 'active',
    startedAt: new Date(),
    durationMinutes: durationMinutes || null,
    notes: notes || null,
  };
  
  const result = await db.insert(blockageHistory).values(values);
  return result;
}

export async function getBlockageHistoryByType(userId: number) {
  const db = await getDb();
  if (!db) return { helpgamesOnly: 0, betblockerOnly: 0, combined: 0, total: 0 };
  
  const blockages = await db.select()
    .from(blockageHistory)
    .where(eq(blockageHistory.userId, userId));
  
  const helpgamesOnly = blockages.filter(b => b.blockageType === 'helpgames_30min').length;
  const betblockerOnly = blockages.filter(b => b.blockageType === 'betblocker_permanent').length;
  const combined = blockages.filter(b => b.blockageType === 'both').length;
  
  return {
    helpgamesOnly,
    betblockerOnly,
    combined,
    total: blockages.length,
    hasBetBlocker: betblockerOnly > 0 || combined > 0,
  };
}

export async function completeBlockage(blockageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blockageHistory)
    .set({
      status: 'completed',
      endedAt: new Date(),
    })
    .where(eq(blockageHistory.id, blockageId));
}
