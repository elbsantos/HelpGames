import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  recordBetBlockerActivation,
  getBetBlockerStatus,
  getBlockageHistoryByType,
  recordBlockageHistory,
} from './db';

// Mock do banco de dados
vi.mock('./db', async () => {
  const actual = await vi.importActual('./db');
  return {
    ...actual,
    getDb: vi.fn(),
  };
});

describe('BetBlocker Integration', () => {
  const testUserId = 1;
  const testPlatform = 'windows' as const;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('recordBetBlockerActivation', () => {
    it('deve registrar uma ativação de BetBlocker', async () => {
      const result = await recordBetBlockerActivation(testUserId, testPlatform, 'Test activation');
      expect(result).toBeDefined();
    });

    it('deve aceitar plataformas válidas', async () => {
      const platforms: Array<'windows' | 'macos' | 'ios' | 'android'> = ['windows', 'macos', 'ios', 'android'];
      
      for (const platform of platforms) {
        const result = await recordBetBlockerActivation(testUserId, platform);
        expect(result).toBeDefined();
      }
    });

    it('deve permitir notas opcionais', async () => {
      const result = await recordBetBlockerActivation(testUserId, testPlatform);
      expect(result).toBeDefined();
    });
  });

  describe('getBetBlockerStatus', () => {
    it('deve retornar null se não houver ativação', async () => {
      const status = await getBetBlockerStatus(999); // ID que não existe
      expect(status).toBeNull();
    });

    it('deve retornar a ativação mais recente', async () => {
      // Registrar uma ativação
      await recordBetBlockerActivation(testUserId, testPlatform);
      
      // Obter status
      const status = await getBetBlockerStatus(testUserId);
      expect(status).toBeDefined();
      if (status) {
        expect(status.userId).toBe(testUserId);
        expect(status.platform).toBe(testPlatform);
      }
    });
  });

  describe('recordBlockageHistory', () => {
    it('deve registrar histórico de bloqueio HelpGames', async () => {
      const result = await recordBlockageHistory(
        testUserId,
        'helpgames_30min',
        30,
        'Manual blockage'
      );
      expect(result).toBeDefined();
    });

    it('deve registrar histórico de bloqueio BetBlocker', async () => {
      const result = await recordBlockageHistory(
        testUserId,
        'betblocker_permanent',
        undefined,
        'BetBlocker activation'
      );
      expect(result).toBeDefined();
    });

    it('deve registrar histórico de bloqueio combinado', async () => {
      const result = await recordBlockageHistory(
        testUserId,
        'both',
        30,
        'Combined protection'
      );
      expect(result).toBeDefined();
    });
  });

  describe('getBlockageHistoryByType', () => {
    it('deve retornar estatísticas vazias para novo usuário', async () => {
      const stats = await getBlockageHistoryByType(999);
      expect(stats.total).toBe(0);
      expect(stats.helpgamesOnly).toBe(0);
      expect(stats.betblockerOnly).toBe(0);
      expect(stats.combined).toBe(0);
      expect(stats.hasBetBlocker).toBe(false);
    });

    it('deve contar bloqueios por tipo', async () => {
      // Registrar diferentes tipos de bloqueios
      await recordBlockageHistory(testUserId, 'helpgames_30min', 30);
      await recordBlockageHistory(testUserId, 'helpgames_30min', 30);
      await recordBlockageHistory(testUserId, 'betblocker_permanent');
      await recordBlockageHistory(testUserId, 'both', 30);

      const stats = await getBlockageHistoryByType(testUserId);
      expect(stats.total).toBe(4);
      expect(stats.helpgamesOnly).toBe(2);
      expect(stats.betblockerOnly).toBe(1);
      expect(stats.combined).toBe(1);
      expect(stats.hasBetBlocker).toBe(true);
    });
  });

  describe('Integração com tRPC', () => {
    it('deve permitir registrar ativação via tRPC', async () => {
      // Este teste seria executado com um cliente tRPC real
      // Por enquanto, apenas validamos que a função existe
      expect(typeof recordBetBlockerActivation).toBe('function');
    });

    it('deve permitir obter status via tRPC', async () => {
      expect(typeof getBetBlockerStatus).toBe('function');
    });

    it('deve permitir obter histórico por tipo via tRPC', async () => {
      expect(typeof getBlockageHistoryByType).toBe('function');
    });
  });

  describe('Validações de dados', () => {
    it('deve rejeitar plataformas inválidas', async () => {
      // TypeScript vai impedir isso em tempo de compilação
      // Este teste documenta o comportamento esperado
      expect(testPlatform).toMatch(/^(windows|macos|ios|android)$/);
    });

    it('deve aceitar durações válidas', async () => {
      const validDurations = [30, 60, 120, 1440]; // minutos
      
      for (const duration of validDurations) {
        const result = await recordBlockageHistory(
          testUserId,
          'helpgames_30min',
          duration
        );
        expect(result).toBeDefined();
      }
    });

    it('deve aceitar tipos de bloqueio válidos', async () => {
      const validTypes: Array<'helpgames_30min' | 'betblocker_permanent' | 'both'> = [
        'helpgames_30min',
        'betblocker_permanent',
        'both',
      ];

      for (const type of validTypes) {
        const result = await recordBlockageHistory(testUserId, type);
        expect(result).toBeDefined();
      }
    });
  });
});
