/**
 * HelpGames - Definição de Produtos e Preços Stripe
 * Portugal (EUR) e Brasil (BRL)
 */

export const PLANS = {
  FREE: "free",
  PREMIUM: "premium",
} as const;

export type Plan = (typeof PLANS)[keyof typeof PLANS];

// Preços em centavos (Stripe usa centavos)
export const STRIPE_PRICES = {
  PT: {
    monthly: {
      amount: 290, // €2,90
      currency: "eur",
      interval: "month" as const,
      label: "€2,90/mês",
    },
    annual: {
      amount: 2500, // €25,00
      currency: "eur",
      interval: "year" as const,
      label: "€25,00/ano",
    },
  },
  BR: {
    monthly: {
      amount: 990, // R$9,90
      currency: "brl",
      interval: "month" as const,
      label: "R$ 9,90/mês",
    },
    annual: {
      amount: 9900, // R$99,00
      currency: "brl",
      interval: "year" as const,
      label: "R$ 99,00/ano",
    },
  },
} as const;

export type Country = keyof typeof STRIPE_PRICES;
export type BillingInterval = "monthly" | "annual";

// Funcionalidades por plano
export const PLAN_FEATURES = {
  free: {
    label: "Gratuito",
    features: [
      "Dashboard básico",
      "Registar até 5 apostas evitadas/mês",
      "1 meta financeira ativa",
      "Histórico dos últimos 7 dias",
      "Modo Crise",
      "Recursos de Ajuda",
    ],
    limits: {
      apostasEvitadasMes: 5,
      metasAtivas: 1,
      historicoDias: 7,
    },
  },
  premium: {
    label: "Premium",
    features: [
      "Tudo do plano gratuito",
      "Apostas evitadas ilimitadas",
      "Metas financeiras ilimitadas",
      "Histórico completo",
      "Perfil Financeiro avançado",
      "Relatórios e estatísticas detalhadas",
      "Sem anúncios",
      "Suporte prioritário",
    ],
    limits: {
      apostasEvitadasMes: Infinity,
      metasAtivas: Infinity,
      historicoDias: Infinity,
    },
  },
} as const;
