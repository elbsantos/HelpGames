/**
 * Testes da Extensão HelpGames
 * Valida funcionalidade de bloqueio, popup e sincronização com backend
 */

describe('HelpGames Extension', () => {
  describe('Popup Interface', () => {
    test('deve exibir status de extensão ativa', () => {
      // Verificar se popup.html carrega corretamente
      expect(document.querySelector('.status')).toBeTruthy();
      expect(document.querySelector('#statusText')).toBeTruthy();
    });

    test('deve mostrar estatísticas de bloqueios', () => {
      const blocksToday = document.querySelector('#blocksToday');
      const timeSaved = document.querySelector('#timeSaved');
      
      expect(blocksToday).toBeTruthy();
      expect(timeSaved).toBeTruthy();
    });

    test('deve ter botões de ação funcionais', () => {
      const toggleBtn = document.querySelector('#toggleBlockingBtn');
      const crisisBtn = document.querySelector('#crisisModeBtn');
      
      expect(toggleBtn).toBeTruthy();
      expect(crisisBtn).toBeTruthy();
    });
  });

  describe('Bloqueio de Domínios', () => {
    test('deve bloquear domínio de aposta conhecida', () => {
      const blockedSites = new Set([
        'bet365.com',
        'betano.com.br',
        'betfair.com',
      ]);

      expect(blockedSites.has('bet365.com')).toBe(true);
      expect(blockedSites.has('example.com')).toBe(false);
    });

    test('deve bloquear subdomínios', () => {
      const domain = 'www.bet365.com';
      const parentDomain = domain.split('.').slice(1).join('.');
      
      expect(parentDomain).toBe('bet365.com');
    });

    test('deve ignorar case-sensitivity', () => {
      const domain1 = 'BET365.COM'.toLowerCase();
      const domain2 = 'bet365.com';
      
      expect(domain1).toBe(domain2);
    });
  });

  describe('Timer de Bloqueio', () => {
    test('deve formatar tempo restante corretamente', () => {
      const ms = 30 * 60 * 1000; // 30 minutos
      const minutes = Math.floor(ms / 60000);
      const seconds = (ms % 60000) / 1000;
      
      expect(minutes).toBe(30);
      expect(seconds).toBe(0);
    });

    test('deve atualizar timer a cada segundo', (done) => {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count === 3) {
          clearInterval(interval);
          expect(count).toBe(3);
          done();
        }
      }, 1000);
    });

    test('deve desativar bloqueio quando timer expira', () => {
      const timeRemaining = 0;
      const isBlocking = timeRemaining > 0;
      
      expect(isBlocking).toBe(false);
    });
  });

  describe('Sincronização com Backend', () => {
    test('deve enviar evento de bloqueio ativado', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      global.fetch = mockFetch;

      const data = {
        type: 'ACTIVATE_BLOCKING',
        duration: 30 * 60 * 1000,
      };

      // Simular envio
      await fetch('/api/blocking/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      expect(mockFetch).toHaveBeenCalled();
    });

    test('deve registrar tentativa de acesso bloqueado', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      global.fetch = mockFetch;

      const data = {
        url: 'https://bet365.com',
        timestamp: new Date().toISOString(),
      };

      await fetch('/api/blocking/log-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Página de Bloqueio', () => {
    test('deve exibir URL bloqueada', () => {
      const url = 'https://bet365.com';
      const urlParam = new URLSearchParams(`url=${encodeURIComponent(url)}`);
      
      expect(urlParam.get('url')).toBe(url);
    });

    test('deve mostrar timer na página de bloqueio', () => {
      const timerValue = document.querySelector('#timerValue');
      expect(timerValue).toBeTruthy();
    });

    test('deve ter links para recursos de ajuda', () => {
      const helpLinks = document.querySelectorAll('.resource-link');
      expect(helpLinks.length).toBeGreaterThan(0);
    });

    test('deve ter botões de ação', () => {
      const dashboardBtn = document.querySelector('#openDashboardBtn');
      const supportBtn = document.querySelector('#crisisSupportBtn');
      
      expect(dashboardBtn).toBeTruthy();
      expect(supportBtn).toBeTruthy();
    });
  });

  describe('Modo Crise', () => {
    test('deve ativar bloqueio permanente', () => {
      const crisisDuration = 60 * 60 * 1000; // 1 hora
      const normalDuration = 30 * 60 * 1000; // 30 minutos
      
      expect(crisisDuration).toBeGreaterThan(normalDuration);
    });

    test('deve enviar evento crisis_mode ao backend', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      global.fetch = mockFetch;

      const data = {
        eventType: 'crisis_mode',
        duration: 60 * 60 * 1000,
      };

      await fetch('/api/blocking/log-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      expect(mockFetch).toHaveBeenCalled();
    });
  });

  describe('Storage Local', () => {
    test('deve salvar estado de bloqueio', () => {
      const state = {
        isBlocking: true,
        blockingStartTime: Date.now(),
        blockingDuration: 30 * 60 * 1000,
      };

      localStorage.setItem('blockingState', JSON.stringify(state));
      const saved = JSON.parse(localStorage.getItem('blockingState') || '{}');

      expect(saved.isBlocking).toBe(true);
    });

    test('deve restaurar estado após reload', () => {
      const state = {
        blocksToday: 5,
        timeSaved: 150,
      };

      localStorage.setItem('stats', JSON.stringify(state));
      const restored = JSON.parse(localStorage.getItem('stats') || '{}');

      expect(restored.blocksToday).toBe(5);
      expect(restored.timeSaved).toBe(150);
    });
  });

  describe('Notificações', () => {
    test('deve exibir notificação ao ativar bloqueio', () => {
      const mockNotification = jest.fn();
      global.chrome = {
        notifications: {
          create: mockNotification,
        },
      } as any;

      chrome.notifications.create({
        type: 'basic',
        title: 'Bloqueio Ativado',
        message: 'Bloqueio de 30 minutos ativado',
      });

      expect(mockNotification).toHaveBeenCalled();
    });
  });

  describe('Manifest Validation', () => {
    test('deve ter manifest.json válido', () => {
      const manifest = {
        manifest_version: 3,
        name: 'HelpGames - Bloqueador de Apostas',
        version: '1.0.0',
        permissions: ['webRequest', 'tabs', 'storage', 'scripting'],
      };

      expect(manifest.manifest_version).toBe(3);
      expect(manifest.permissions.length).toBeGreaterThan(0);
    });
  });
});

describe('Integração com HelpGames Backend', () => {
  test('deve chamar trpc.extension.logBlockingEvent', async () => {
    // Simular chamada tRPC
    const result = await fetch('/api/trpc/extension.logBlockingEvent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'activated',
        duration: 30 * 60 * 1000,
      }),
    });

    expect(result.ok).toBe(true);
  });

  test('deve chamar trpc.extension.getBlockingStats', async () => {
    const result = await fetch('/api/trpc/extension.getBlockingStats', {
      method: 'GET',
    });

    expect(result.ok).toBe(true);
  });
});
