import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Perfil financeiro do usuário
 * Armazena renda mensal, despesas fixas e verba de lazer calculada
 */
export const financialProfiles = mysqlTable("financial_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  monthlyIncome: int("monthly_income").notNull(), // em centavos
  fixedExpenses: int("fixed_expenses").notNull(), // em centavos
  leisureBudget: int("leisure_budget").notNull(), // calculado: 30% da renda
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FinancialProfile = typeof financialProfiles.$inferSelect;
export type InsertFinancialProfile = typeof financialProfiles.$inferInsert;

/**
 * Apostas evitadas registradas pelo usuário
 * Cada registro representa uma vitória sobre o impulso de apostar
 */
export const avoidedBets = mysqlTable("avoided_bets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(), // valor que seria apostado (em centavos)
  emotionalContext: text("emotional_context"), // como estava se sentindo
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AvoidedBet = typeof avoidedBets.$inferSelect;
export type InsertAvoidedBet = typeof avoidedBets.$inferInsert;

/**
 * Metas pessoais tangíveis
 * Itens de desejo que motivam a economia
 */
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(), // ex: "Nova TV", "Viagem para a praia"
  targetAmount: int("target_amount").notNull(), // valor do item (em centavos)
  imageUrl: text("image_url"), // URL da imagem do item desejado
  isCompleted: int("is_completed").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Mensagens personalizadas para o Modo Crise
 * Escritas pelo usuário em momentos de clareza
 */
export const crisisMessages = mysqlTable("crisis_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type CrisisMessage = typeof crisisMessages.$inferSelect;
export type InsertCrisisMessage = typeof crisisMessages.$inferInsert;