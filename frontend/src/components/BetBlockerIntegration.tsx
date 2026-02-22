import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { CheckCircle2, Shield } from 'lucide-react';

export function BetBlockerIntegration() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const betblockerStatus = trpc.betblocker.getStatus.useQuery();
  const recordActivation = trpc.betblocker.recordActivation.useMutation();
  const utils = trpc.useUtils();

  const platforms = [
    { id: 'windows', name: 'Windows', icon: '🪟' },
    { id: 'macos', name: 'macOS', icon: '🍎' },
    { id: 'ios', name: 'iOS', icon: '📱' },
    { id: 'android', name: 'Android', icon: '🤖' },
  ];

  const handleActivate = async (platform: string) => {
    try {
      await recordActivation.mutateAsync({
        platform: platform as 'windows' | 'macos' | 'ios' | 'android',
        notes: 'Ativado via HelpGames',
      });
      
      // Invalidar cache para atualizar status
      await utils.betblocker.getStatus.invalidate();
      setSelectedPlatform('');
      
      // Mostrar notificação de sucesso
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('BetBlocker Ativado! 🛡️', {
          body: 'Você agora tem proteção avançada contra sites de apostas',
          icon: '🛡️',
        });
      }
    } catch (error) {
      console.error('Erro ao registrar BetBlocker:', error);
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Proteção Avançada com BetBlocker
        </CardTitle>
        <CardDescription>
          Complementar seu bloqueio de 30 minutos com proteção permanente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {betblockerStatus.data ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ BetBlocker ativo desde {new Date(betblockerStatus.data.activatedAt).toLocaleDateString('pt-BR')}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-medium">
                BetBlocker é um bloqueador gratuito que bloqueia 329k+ sites de apostas.
              </p>
              <p className="text-sm text-gray-600">
                Escolha sua plataforma para instalar:
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant={selectedPlatform === platform.id ? 'default' : 'outline'}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="justify-center gap-2 h-auto py-3"
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span>{platform.name}</span>
                </Button>
              ))}
            </div>

            {selectedPlatform && (
              <div className="space-y-2 pt-2">
                <a
                  href="https://betblocker.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Instalar BetBlocker Agora
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleActivate(selectedPlatform)}
                  disabled={recordActivation.isPending}
                >
                  {recordActivation.isPending ? 'Registrando...' : 'Confirmar Instalação'}
                </Button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Por que usar BetBlocker?</p>
              <ul className="space-y-1 text-xs">
                <li>✓ Bloqueia 329k+ sites de apostas</li>
                <li>✓ Gratuito e sem anúncios</li>
                <li>✓ Funciona em todos os dispositivos</li>
                <li>✓ Complementa o bloqueio de 30 min do HelpGames</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
