import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chrome, Globe, Shield, AlertCircle, CheckCircle2, Flame } from "lucide-react";

interface Blocker {
  id: string;
  name: string;
  description: string;
  website: string;
  features: string[];
  rating: number;
  downloads: string;
  color: string;
}

interface BrowserGuide {
  browser: string;
  icon: React.ReactNode;
  steps: string[];
  color: string;
  notes?: string;
}

const BLOCKERS: Blocker[] = [
  {
    id: "betfilter",
    name: "Betfilter",
    description: "Bloqueador especializado em sites de apostas com lista atualizada",
    website: "https://www.betfilter.org",
    features: [
      "Bloqueia 1000+ sites de apostas",
      "Lista atualizada regularmente",
      "Funciona em múltiplos navegadores",
      "Relatórios de uso",
      "Suporte técnico",
    ],
    rating: 4.8,
    downloads: "100K+",
    color: "text-red-600",
  },
  {
    id: "gamban",
    name: "Gamban",
    description: "Bloqueador de apostas premium com proteção avançada",
    website: "https://www.gamban.com",
    features: [
      "Bloqueia 3000+ sites de apostas",
      "Proteção em nível de rede",
      "Funciona em desktop e mobile",
      "Sem lista branca (máxima proteção)",
      "Suporte 24/7",
    ],
    rating: 4.9,
    downloads: "50K+",
    color: "text-blue-600",
  },
  {
    id: "gamcare-filter",
    name: "GamCare Filter",
    description: "Bloqueador gratuito recomendado por GamCare",
    website: "https://www.gamcare.org.uk",
    features: [
      "Gratuito e confiável",
      "Recomendado por profissionais",
      "Fácil de instalar",
      "Suporte em português",
      "Atualizado regularmente",
    ],
    rating: 4.6,
    downloads: "30K+",
    color: "text-purple-600",
  },
  {
    id: "netnanny",
    name: "NetNanny",
    description: "Controle parental com bloqueio de sites de apostas",
    website: "https://www.netnanny.com",
    features: [
      "Controle parental avançado",
      "Bloqueia categorias de sites",
      "Relatórios detalhados",
      "Funciona em múltiplos dispositivos",
      "Suporte técnico",
    ],
    rating: 4.5,
    downloads: "20K+",
    color: "text-green-600",
  },
];

const BROWSER_GUIDES: BrowserGuide[] = [
  {
    browser: "Google Chrome",
    icon: <Chrome className="w-8 h-8 text-blue-600" />,
    color: "text-blue-600",
    steps: [
      "1. Abra o Chrome e vá para Chrome Web Store (chrome.google.com/webstore)",
      "2. Procure por 'Betfilter' ou 'Gamban' na barra de pesquisa",
      "3. Clique em 'Adicionar ao Chrome'",
      "4. Confirme clicando em 'Adicionar extensão'",
      "5. A extensão aparecerá no canto superior direito do navegador",
      "6. Clique no ícone da extensão e configure suas preferências",
      "7. Pronto! Os sites de apostas serão bloqueados automaticamente",
    ],
    notes: "Chrome é o navegador mais compatível com bloqueadores de apostas",
  },
  {
    browser: "Mozilla Firefox",
    icon: <Flame className="w-8 h-8 text-orange-600" />,
    color: "text-orange-600",
    steps: [
      "1. Abra o Firefox e vá para Firefox Add-ons (addons.mozilla.org)",
      "2. Procure por 'Betfilter' ou 'Gamban' na barra de pesquisa",
      "3. Clique em 'Adicionar ao Firefox'",
      "4. Confirme a permissão clicando em 'Adicionar'",
      "5. A extensão aparecerá no menu de extensões (ícone de quebra-cabeça)",
      "6. Clique no ícone da extensão para configurar",
      "7. Pronto! Os sites de apostas serão bloqueados automaticamente",
    ],
    notes: "Firefox oferece ótima privacidade e compatibilidade com bloqueadores",
  },
  {
    browser: "Apple Safari",
    icon: <Globe className="w-8 h-8 text-gray-600" />,
    color: "text-gray-600",
    steps: [
      "1. Abra o Safari e vá para App Store (apps.apple.com)",
      "2. Procure por 'Gamban' ou 'GamCare Filter'",
      "3. Clique em 'Obter' e confirme com Face ID ou senha",
      "4. Após instalar, vá para Preferências do Safari",
      "5. Clique em 'Extensões' na barra lateral",
      "6. Marque a caixa ao lado da extensão para ativá-la",
      "7. Pronto! Os sites de apostas serão bloqueados automaticamente",
    ],
    notes: "Safari tem suporte limitado a extensões, Gamban é a melhor opção",
  },
  {
    browser: "Microsoft Edge",
    icon: <Globe className="w-8 h-8 text-cyan-600" />,
    color: "text-cyan-600",
    steps: [
      "1. Abra o Edge e vá para Microsoft Edge Add-ons (microsoftedge.microsoft.com/addons)",
      "2. Procure por 'Betfilter' ou 'Gamban' na barra de pesquisa",
      "3. Clique em 'Obter'",
      "4. Confirme clicando em 'Adicionar extensão'",
      "5. A extensão aparecerá no canto superior direito do navegador",
      "6. Clique no ícone da extensão e configure suas preferências",
      "7. Pronto! Os sites de apostas serão bloqueados automaticamente",
    ],
    notes: "Edge é baseado em Chromium, oferecendo ótima compatibilidade",
  },
];

export default function BloqueadoresSites() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Bloqueadores de Sites de Apostas</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ferramentas tecnológicas que bloqueiam automaticamente o acesso a sites de apostas. Uma camada
            adicional de proteção para ajudar você a manter o controle.
          </p>
        </div>

        {/* Why Use Blockers */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              Por que usar um bloqueador?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>✓ Proteção automática:</strong> Bloqueia sites de apostas sem precisar de força de
              vontade a cada tentativa.
            </p>
            <p>
              <strong>✓ Reduz impulsos:</strong> Quando o site não carrega, você tem tempo para pensar e
              buscar alternativas saudáveis.
            </p>
            <p>
              <strong>✓ Camada adicional:</strong> Funciona junto com o bloqueio de 30 minutos do HelpGames
              para máxima proteção.
            </p>
            <p>
              <strong>✓ Fácil de instalar:</strong> A maioria dos bloqueadores leva menos de 2 minutos para
              instalar.
            </p>
          </CardContent>
        </Card>

        {/* Blockers Comparison */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Bloqueadores Recomendados</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {BLOCKERS.map((blocker) => (
              <Card key={blocker.id} className="border-2 hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{blocker.name}</CardTitle>
                  <CardDescription>{blocker.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Características:</h4>
                    <ul className="space-y-1">
                      {blocker.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded">
                    <div>
                      <p className="text-gray-600">Avaliação</p>
                      <p className="font-bold text-lg">⭐ {blocker.rating}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Downloads</p>
                      <p className="font-bold">{blocker.downloads}</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button asChild className="w-full mt-auto">
                    <a href={blocker.website} target="_blank" rel="noopener noreferrer">
                      Instalar Agora
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Browser Installation Guides */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Guias de Instalação por Navegador</h2>
          <div className="space-y-6">
            {BROWSER_GUIDES.map((guide, idx) => (
              <Card key={idx} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {guide.icon}
                    {guide.browser}
                  </CardTitle>
                  {guide.notes && <CardDescription>{guide.notes}</CardDescription>}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Steps */}
                  <div className="space-y-3">
                    {guide.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200">
                            <span className="text-sm font-semibold text-gray-700">{idx + 1}</span>
                          </div>
                        </div>
                        <p className="text-sm pt-1">{step}</p>
                      </div>
                    ))}
                  </div>

                  {/* Troubleshooting */}
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm">
                    <p className="font-semibold text-yellow-900 mb-1">💡 Dica:</p>
                    <p className="text-yellow-800">
                      Se o bloqueador não funcionar, tente desabilitar VPN/proxy e reiniciar o navegador.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <Card className="bg-red-50 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              Informações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>⚠️ Bloqueadores não são infalíveis:</strong> Usuários determinados podem encontrar
              maneiras de contorná-los. Use como ferramenta de apoio, não como solução única.
            </p>
            <p>
              <strong>⚠️ Combine com outras estratégias:</strong> Bloqueadores funcionam melhor quando
              combinados com suporte profissional e mudanças de comportamento.
            </p>
            <p>
              <strong>⚠️ Mantenha atualizado:</strong> Atualize regularmente o bloqueador para garantir que
              novos sites sejam incluídos.
            </p>
            <p>
              <strong>⚠️ Privacidade:</strong> Escolha bloqueadores de empresas confiáveis que respeitem sua
              privacidade.
            </p>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-green-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>1. Escolha um bloqueador:</strong> Recomendamos começar com Betfilter (gratuito e
              eficaz).
            </p>
            <p>
              <strong>2. Instale seguindo o guia:</strong> Escolha seu navegador e siga os passos acima.
            </p>
            <p>
              <strong>3. Configure as preferências:</strong> Defina quais sites deseja bloquear.
            </p>
            <p>
              <strong>4. Combine com HelpGames:</strong> Use o bloqueio de 30 minutos junto com a extensão
              para máxima proteção.
            </p>
            <p>
              <strong>5. Procure ajuda profissional:</strong> Bloqueadores são ferramentas, não tratamento.
              Considere terapia ou grupos de suporte.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
