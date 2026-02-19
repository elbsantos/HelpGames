import { describe, expect, it } from "vitest";

/**
 * Testes para validar a lógica de cálculo financeiro com proporção 3:2
 * Necessidades = Despesas Fixas (valor real)
 * Saldo = Renda - Despesas Fixas
 * Lazer = 60% do Saldo (3/5)
 * Poupança = 40% do Saldo (2/5)
 */

function calculateFinancialDistribution(monthlyIncome: number, fixedExpenses: number) {
  // Necessidades são as despesas reais
  const necessitiesBudget = fixedExpenses;
  
  // Saldo restante após despesas
  const remainingBudget = Math.max(0, monthlyIncome - fixedExpenses);
  
  // Proporção 3:2 (lazer:poupança) do saldo restante
  // Lazer = 60% do saldo (3/5)
  const leisureBudget = Math.floor(remainingBudget * 0.6);
  
  // Poupança = 40% do saldo (2/5)
  const savingsBudget = remainingBudget - leisureBudget;
  
  return {
    necessitiesBudget,
    leisureBudget,
    savingsBudget,
    remainingBudget,
    total: necessitiesBudget + leisureBudget + savingsBudget,
  };
}

describe("Financial Distribution - Proporção 3:2", () => {
  describe("Cenário 1: Despesas = 50% (Saúde financeira OK)", () => {
    it("deve distribuir corretamente quando despesas = 50% da renda", () => {
      const result = calculateFinancialDistribution(500000, 250000); // R$ 5.000 e R$ 2.500
      
      expect(result.necessitiesBudget).toBe(250000); // R$ 2.500
      expect(result.remainingBudget).toBe(250000); // R$ 2.500
      expect(result.leisureBudget).toBe(150000); // R$ 1.500 (60% de 2.500)
      expect(result.savingsBudget).toBe(100000); // R$ 1.000 (40% de 2.500)
      expect(result.total).toBe(500000); // R$ 5.000 - FECHA PERFEITAMENTE
    });

    it("deve validar que a soma = 100% da renda", () => {
      const result = calculateFinancialDistribution(500000, 250000);
      expect(result.total).toBe(500000);
      expect(result.total / 500000).toBe(1); // 100%
    });

    it("deve validar proporção 3:2 (lazer:poupança)", () => {
      const result = calculateFinancialDistribution(500000, 250000);
      const ratio = result.leisureBudget / result.savingsBudget;
      expect(ratio).toBeCloseTo(1.5, 1); // 3/2 = 1.5
    });
  });

  describe("Cenário 2: Despesas > 50% (Saúde financeira RUIM)", () => {
    it("deve distribuir corretamente quando despesas > 50%", () => {
      const result = calculateFinancialDistribution(500000, 300000); // R$ 5.000 e R$ 3.000 (60%)
      
      expect(result.necessitiesBudget).toBe(300000); // R$ 3.000
      expect(result.remainingBudget).toBe(200000); // R$ 2.000
      expect(result.leisureBudget).toBe(120000); // R$ 1.200 (60% de 2.000)
      expect(result.savingsBudget).toBe(80000); // R$ 800 (40% de 2.000)
      expect(result.total).toBe(500000); // R$ 5.000 - FECHA PERFEITAMENTE
    });

    it("deve validar que a soma = 100% da renda mesmo com despesas altas", () => {
      const result = calculateFinancialDistribution(500000, 300000);
      expect(result.total).toBe(500000);
    });

    it("deve manter proporção 3:2 mesmo com despesas altas", () => {
      const result = calculateFinancialDistribution(500000, 300000);
      const ratio = result.leisureBudget / result.savingsBudget;
      expect(ratio).toBeCloseTo(1.5, 1); // 3/2 = 1.5
    });
  });

  describe("Cenário 3: Despesas < 50% (Saúde financeira EXCELENTE)", () => {
    it("deve distribuir corretamente quando despesas < 50%", () => {
      const result = calculateFinancialDistribution(500000, 200000); // R$ 5.000 e R$ 2.000 (40%)
      
      expect(result.necessitiesBudget).toBe(200000); // R$ 2.000
      expect(result.remainingBudget).toBe(300000); // R$ 3.000
      expect(result.leisureBudget).toBe(180000); // R$ 1.800 (60% de 3.000)
      expect(result.savingsBudget).toBe(120000); // R$ 1.200 (40% de 3.000)
      expect(result.total).toBe(500000); // R$ 5.000 - FECHA PERFEITAMENTE
    });

    it("deve validar que a soma = 100% da renda com despesas baixas", () => {
      const result = calculateFinancialDistribution(500000, 200000);
      expect(result.total).toBe(500000);
    });

    it("deve manter proporção 3:2 com despesas baixas", () => {
      const result = calculateFinancialDistribution(500000, 200000);
      const ratio = result.leisureBudget / result.savingsBudget;
      expect(ratio).toBeCloseTo(1.5, 1); // 3/2 = 1.5
    });
  });

  describe("Casos extremos", () => {
    it("deve lidar com despesas = 0", () => {
      const result = calculateFinancialDistribution(500000, 0);
      
      expect(result.necessitiesBudget).toBe(0);
      expect(result.remainingBudget).toBe(500000);
      expect(result.leisureBudget).toBe(300000); // 60% de 5.000
      expect(result.savingsBudget).toBe(200000); // 40% de 5.000
      expect(result.total).toBe(500000);
    });

    it("deve lidar com despesas = renda (sem saldo)", () => {
      const result = calculateFinancialDistribution(500000, 500000);
      
      expect(result.necessitiesBudget).toBe(500000);
      expect(result.remainingBudget).toBe(0);
      expect(result.leisureBudget).toBe(0);
      expect(result.savingsBudget).toBe(0);
      expect(result.total).toBe(500000);
    });

    it("deve lidar com despesas > renda (clamp to 0)", () => {
      const result = calculateFinancialDistribution(500000, 600000);
      
      expect(result.necessitiesBudget).toBe(600000);
      expect(result.remainingBudget).toBe(0); // Math.max(0, negativo) = 0
      expect(result.leisureBudget).toBe(0);
      expect(result.savingsBudget).toBe(0);
      expect(result.total).toBe(600000); // Necessidades absorve tudo
    });
  });

  describe("Validação de saúde financeira", () => {
    it("deve identificar despesas > 50% como alerta", () => {
      const result = calculateFinancialDistribution(500000, 300000);
      const expensesPercentage = (result.necessitiesBudget / 500000) * 100;
      expect(expensesPercentage).toBeGreaterThan(50);
    });

    it("deve identificar despesas <= 50% como OK", () => {
      const result = calculateFinancialDistribution(500000, 250000);
      const expensesPercentage = (result.necessitiesBudget / 500000) * 100;
      expect(expensesPercentage).toBeLessThanOrEqual(50);
    });

    it("deve identificar despesas < 50% como excelente", () => {
      const result = calculateFinancialDistribution(500000, 200000);
      const expensesPercentage = (result.necessitiesBudget / 500000) * 100;
      expect(expensesPercentage).toBeLessThan(50);
    });
  });

  describe("Validação de precisão monetária (centavos)", () => {
    it("deve manter precisão com valores em centavos", () => {
      const result = calculateFinancialDistribution(512345, 256789);
      
      // Verifica que o total é exato
      expect(result.total).toBe(512345);
      
      // Verifica que lazer e poupança mantêm proporção 3:2
      const ratio = result.leisureBudget / result.savingsBudget;
      expect(ratio).toBeCloseTo(1.5, 1);
    });

    it("deve lidar com divisão que resulta em decimais", () => {
      const result = calculateFinancialDistribution(100000, 33333); // R$ 1.000 e R$ 333,33
      
      expect(result.necessitiesBudget).toBe(33333);
      expect(result.remainingBudget).toBe(66667);
      expect(result.leisureBudget).toBe(Math.floor(66667 * 0.6)); // 40000
      expect(result.savingsBudget).toBe(66667 - Math.floor(66667 * 0.6)); // 26667
      expect(result.total).toBe(100000);
    });
  });
});
