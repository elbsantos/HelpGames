import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { CheckCircle2, Shield, AlertTriangle } from 'lucide-react';

export function BetBlockerCrisisMode() {
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
        notes: 'Ativado durante Modo Crise',
      });
      
      await utils.betblocker.getStatus.invalidate();
      setSelectedPlatform('');
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🛡️ BetBlocker Ativado com Sucesso!', {
          body: 'Você agora tem proteção permanente contra sites de apostas',
          icon: '🛡️',
        });
      }
    } catch (error) {
      console.error('Erro ao registrar BetBlocker:', error);
    }
  };

  return (
    <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Proteção Técnica Permanente
        </CardTitle>
        <CardDescription>
          Ative BetBlocker para bloqueio permanente de 329k+ sites de apostas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {betblockerStatus.data ? (
          <Alert className="bg-green-50 border-green-300">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 ml-2">
              ✅ BetBlocker ativo desde {new Date(betblockerStatus.data.activatedAt).toLocaleDateString('pt-BR')}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Alert className="bg-red-50 border-red-300">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 ml-2">
                ⚠️ Você está em Modo Crise. Considere ativar BetBlocker para máxima proteção.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <p className="text-sm text-gray-700 font-medium">
                BetBlocker é um bloqueador gratuito que bloqueia 329k+ sites de apostas em todos os dispositivos.
              </p>
              <p className="text-sm text-gray-600">
                Escolha sua plataforma:
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
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
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
              <p className="font-semibold mb-2">🔒 Benefícios do BetBlocker:</p>
              <ul className="space-y-1 text-xs">
                <li>✓ Bloqueia 329k+ sites de apostas</li>
                <li>✓ Funciona em Windows, macOS, iOS e Android</li>
                <li>✓ Gratuito e sem anúncios</li>
                <li>✓ Bloqueio permanente (não apenas 30 min)</li>
                <li>✓ Complementa o bloqueio de 30 min do HelpGames</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
