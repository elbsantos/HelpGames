import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, TrendingDown, Users, Clock, DollarSign, Brain } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface GamblingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  risks: string[];
  signs: string[];
  color: string;
}

const GAMBLING_CATEGORIES: GamblingCategory[] = [
  {
    id: "sports",
    name: "Apostas em Esportes",
    icon: "⚽",
    description: "Apostas em futebol, basquete, tênis e outros esportes. Inclui live betting durante jogos.",
    risks: [
      "Sensação de controle falsa (análise de estatísticas)",
      "Apostas impulsivas durante eventos ao vivo",
      "Perseguição de perdas (tentar recuperar dinheiro perdido)",
      "Vício em ação rápida e resultados imediatos",
    ],
    signs: [
      "Verificar odds constantemente",
      "Apostar mais durante eventos ao vivo",
      "Tentar 'recuperar' perdas com apostas maiores",
      "Negligenciar trabalho ou estudos por apostas",
    ],
    color: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "casino",
    name: "Cassinos Online",
    icon: "🎰",
    description: "Jogos de azar como roleta, blackjack, máquinas caça-níqueis e pôquer. Jogos de puro acaso.",
    risks: [
      "Ilusão de controle (estratégias não funcionam)",
      "Velocidade de jogo extremamente rápida",
      "Perdas financeiras muito rápidas",
      "Efeito de 'quase ganhar' (vício psicológico)",
    ],
    signs: [
      "Jogar por períodos muito longos",
      "Aumentar apostas progressivamente",
      "Mentir sobre quanto gastou",
      "Sensação de euforia durante ganhos pequenos",
    ],
    color: "bg-red-500/10 border-red-500/20",
  },
  {
    id: "poker",
    name: "Pôquer Online",
    icon: "🃏",
    description: "Jogos de pôquer em mesas virtuais. Mistura habilidade com sorte, mas ainda é jogo de azar.",
    risks: [
      "Sensação de que é 'habilidade' (falsa sensação de controle)",
      "Competição contra outros jogadores (ego envolvido)",
      "Sessões muito longas sem parar",
      "Variância alta (ganhos e perdas grandes)",
    ],
    signs: [
      "Estudar estratégias obsessivamente",
      "Jogar em múltiplas mesas simultaneamente",
      "Não conseguir sair da mesa mesmo perdendo",
      "Comparar-se com outros jogadores",
    ],
    color: "bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "loterias",
    name: "Loterias e Sorteios",
    icon: "🎲",
    description: "Loterias, raspadinhas, sorteios. Jogos de puro acaso com probabilidades extremamente baixas.",
    risks: [
      "Esperança irracional (chance de ganhar é mínima)",
      "Pensamento mágico (números da sorte, rituais)",
      "Gastos pequenos mas frequentes (acumulam)",
      "Ilusão de que 'alguém tem que ganhar'",
    ],
    signs: [
      "Comprar raspadinhas regularmente",
      "Acreditar em números da sorte",
      "Gastar com loterias mesmo sem dinheiro",
      "Fantasiar sobre ganhos futuros",
    ],
    color: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    id: "bingo",
    name: "Bingo Online",
    icon: "🎯",
    description: "Bingo em plataformas online. Jogo social que pode criar hábito de jogo frequente.",
    risks: [
      "Aspecto social que normaliza o jogo",
      "Múltiplas cartelas simultâneas (confusão)",
      "Sensação de comunidade que encoraja mais jogo",
      "Prêmios pequenos que mantêm esperança",
    ],
    signs: [
      "Jogar bingo diariamente",
      "Usar múltiplas cartelas por sessão",
      "Socializar principalmente através do bingo",
      "Gastar mais para ter 'mais chances'",
    ],
    color: "bg-green-500/10 border-green-500/20",
  },
  {
    id: "fantasy",
    name: "Fantasy Sports",
    icon: "🏆",
    description: "Esportes de fantasia onde você monta times virtuais. Parece habilidade mas é principalmente sorte.",
    risks: [
      "Sensação de que é 'jogo de habilidade'",
      "Pesquisa obsessiva de estatísticas",
      "Competição contra outros jogadores",
      "Múltiplas entradas em mesmos torneios",
    ],
    signs: [
      "Gastar muito em múltiplas entradas",
      "Estudar estatísticas obsessivamente",
      "Não conseguir aceitar perdas",
      "Competição obsessiva com outros",
    ],
    color: "bg-indigo-500/10 border-indigo-500/20",
  },
];

const WARNING_SIGNS = [
  "Pensar em apostas constantemente",
  "Gastar mais dinheiro que o planejado",
  "Tentar esconder o quanto está gastando",
  "Apostar para escapar de problemas",
  "Mentir para amigos e família sobre apostas",
  "Sensação de ansiedade quando não está apostando",
  "Negligenciar trabalho, escola ou relacionamentos",
  "Pedir dinheiro emprestado para apostar",
  "Sentir culpa ou vergonha após apostar",
  "Tentar parar mas não conseguir",
];

const HELP_RESOURCES = [
  {
    name: "Associação Nacional de Jogadores Anônimos",
    description: "Programa de 12 passos para recuperação de vício em jogo",
    link: "https://www.jogadoresanonimos.org.br",
  },
  {
    name: "GamCare",
    description: "Suporte e informações sobre vício em jogo",
    link: "https://www.gamcare.org.uk",
  },
  {
    name: "Betfilter",
    description: "Ferramenta para bloquear sites de apostas",
    link: "https://www.betfilter.org.uk",
  },
  {
    name: "CVV - Centro de Valorização da Vida",
    description: "Apoio emocional e prevenção do suicídio",
    link: "https://www.cvv.org.br",
  },
];

export default function SitesApostas() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Entenda os Riscos das Apostas Online</h1>
          <p className="text-lg text-muted-foreground">
            Informações educativas sobre diferentes tipos de sites de apostas e seus riscos
          </p>
        </div>

        {/* Alert Principal */}
        <Alert className="mb-8 border-red-500/50 bg-red-500/5">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Importante</AlertTitle>
          <AlertDescription className="text-red-600/90">
            Se você ou alguém que conhece está tendo dificuldades com apostas, procure ajuda. Existem recursos gratuitos disponíveis.
          </AlertDescription>
        </Alert>

        {/* Categorias de Apostas */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Categorias de Sites de Apostas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GAMBLING_CATEGORIES.map((category) => (
              <Card key={category.id} className={`${category.color} border`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{category.icon}</span>
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      Principais Riscos
                    </h4>
                    <ul className="text-sm space-y-1">
                      {category.risks.map((risk, idx) => (
                        <li key={idx} className="text-muted-foreground">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Sinais de Alerta
                    </h4>
                    <ul className="text-sm space-y-1">
                      {category.signs.map((sign, idx) => (
                        <li key={idx} className="text-muted-foreground">• {sign}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sinais de Vício */}
        <div className="mb-12">
          <Card className="bg-orange-500/5 border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                Sinais de Vício em Jogo
              </CardTitle>
              <CardDescription>
                Se você identifica-se com vários destes sinais, procure ajuda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {WARNING_SIGNS.map((sign, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-orange-500/10">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{sign}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recursos de Ajuda */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recursos de Ajuda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HELP_RESOURCES.map((resource, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Acessar →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dicas Finais */}
        <Card className="mt-12 bg-green-500/5 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              Como Proteger-se
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              <strong>1. Defina limites claros:</strong> Decida quanto pode gastar por mês e cumpra esse limite.
            </p>
            <p className="text-sm">
              <strong>2. Use ferramentas de bloqueio:</strong> Bloqueie sites de apostas usando ferramentas como Betfilter.
            </p>
            <p className="text-sm">
              <strong>3. Procure apoio:</strong> Converse com amigos, família ou profissionais de saúde mental.
            </p>
            <p className="text-sm">
              <strong>4. Evite gatilhos:</strong> Identifique o que te leva a apostar (stress, tédio, etc) e encontre alternativas.
            </p>
            <p className="text-sm">
              <strong>5. Use o HelpGames:</strong> Registre suas apostas evitadas e acompanhe sua economia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
