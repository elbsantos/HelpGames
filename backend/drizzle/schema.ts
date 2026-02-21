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
  leisureBudget: int("leisure_budget").notNull(), // calculado: 60% do saldo
  bettingSpentThisMonth: int("betting_spent_this_month").default(0).notNull(), // em centavos
  lastResetDate: timestamp("last_reset_date").defaultNow().notNull(), // ultima data de reset mensal
  notifiedAt80Percent: timestamp("notified_at_80_percent"), // quando foi notificado em 80%
  notifiedAt95Percent: timestamp("notified_at_95_percent"), // quando foi notificado em 95%
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Alocação de lazer em subcategorias
 * Divide os 30% de lazer em: apostas (10%), cinema (20%), hobbies (30%), viagens (20%), outros (20%)
 */
export const leisureAllocation = mysqlTable("leisure_allocation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bettingPercentage: int("betting_percentage").default(10).notNull(), // % dos 30%
  cinemaPercentage: int("cinema_percentage").default(20).notNull(),
  hobbiesPercentage: int("hobbies_percentage").default(30).notNull(),
  travelPercentage: int("travel_percentage").default(20).notNull(),
  otherPercentage: int("other_percentage").default(20).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FinancialProfile = typeof financialProfiles.$inferSelect;
export type InsertFinancialProfile = typeof financialProfiles.$inferInsert;

export type LeisureAllocation = typeof leisureAllocation.$inferSelect;
export type InsertLeisureAllocation = typeof leisureAllocation.$inferInsert;

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

/**
 * Sites de apostas - Base de dados com ~2.500 domínios
 */
export const gambling_websites = mysqlTable("gambling_websites", {
  id: int("id").autoincrement().primaryKey(),
  dominio: varchar("dominio", { length: 255 }).notNull().unique(),
  nome_site: varchar("nome_site", { length: 255 }),
  categoria: varchar("categoria", { length: 50 }),
  pais: varchar("pais", { length: 50 }),
  ativo: int("ativo").default(1).notNull(),
  data_adicao: timestamp("data_adicao").defaultNow().notNull(),
});

export type GamblingWebsite = typeof gambling_websites.$inferSelect;
export type InsertGamblingWebsite = typeof gambling_websites.$inferInsert;

/**
 * Tentativas de acesso a sites de apostas
 * Registra quando o usuário tenta acessar um site
 */
export const access_attempts = mysqlTable("access_attempts", {
  id: int("id").autoincrement().primaryKey(),
  usuario_id: int("usuario_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dominio: varchar("dominio", { length: 255 }).notNull(),
  valor: int("valor"), // valor que tentaria apostar (em centavos)
  odds: varchar("odds", { length: 50 }),
  contexto_emocional: varchar("contexto_emocional", { length: 255 }),
  usuario_aceitou_redirecionamento: int("usuario_aceitou_redirecionamento").default(0),
  hobby_sugerido: varchar("hobby_sugerido", { length: 255 }),
  resultado: varchar("resultado", { length: 50 }), // 'bloqueado', 'redirecionado', 'apostou'
  data_hora: timestamp("data_hora").defaultNow().notNull(),
});

export type AccessAttempt = typeof access_attempts.$inferSelect;
export type InsertAccessAttempt = typeof access_attempts.$inferInsert;

/**
 * Hobbies do usuário
 * Atividades alternativas para redirecionar quando há impulso de apostar
 */
export const user_hobbies = mysqlTable("user_hobbies", {
  id: int("id").autoincrement().primaryKey(),
  usuario_id: int("usuario_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  nome: varchar("nome", { length: 255 }).notNull(),
  data_criacao: timestamp("data_criacao").defaultNow().notNull(),
});

export type UserHobby = typeof user_hobbies.$inferSelect;
export type InsertUserHobby = typeof user_hobbies.$inferInsert;

/**
 * Assinatura Premium do usuário
 */
export const premium_subscriptions = mysqlTable("premium_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  usuario_id: int("usuario_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 50 }).default("ativo").notNull(), // 'ativo', 'cancelado', 'expirado'
  data_inicio: timestamp("data_inicio").defaultNow().notNull(),
  data_expiracao: timestamp("data_expiracao"),
  stripe_subscription_id: varchar("stripe_subscription_id", { length: 255 }),
  data_atualizacao: timestamp("data_atualizacao").defaultNow().onUpdateNow().notNull(),
});

export type PremiumSubscription = typeof premium_subscriptions.$inferSelect;
export type InsertPremiumSubscription = typeof premium_subscriptions.$inferInsert;

/**
 * Bloqueio temporário de bets
 * Registra quando o usuário ativa o bloqueio de 30 minutos
 */
export const betsBlockages = mysqlTable("bets_blockages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  blockedUntil: timestamp("blocked_until").notNull(), // até quando está bloqueado
  reason: text("reason"), // motivo do bloqueio (ex: "Bloqueio manual de 30 minutos")
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BetsBlockage = typeof betsBlockages.$inferSelect;
export type InsertBetsBlockage = typeof betsBlockages.$inferInsert;
