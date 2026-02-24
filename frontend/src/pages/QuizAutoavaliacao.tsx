import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle, Heart, ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { useState } from "react";

interface Question {
  id: number;
  text: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Você já perdeu horas de trabalho ou da escola devido ao jogo?",
  },
  {
    id: 2,
    text: "Alguma vez o jogo já causou infelicidade na sua vida familiar?",
  },
  {
    id: 3,
    text: "O jogo afetou a sua reputação?",
  },
  {
    id: 4,
    text: "Você já sentiu remorso após jogar?",
  },
  {
    id: 5,
    text: "Alguma vez você já jogou para obter dinheiro para pagar dívidas ou então resolver dificuldades financeiras?",
  },
  {
    id: 6,
    text: "O jogo causou uma diminuição na sua ambição ou eficiência?",
  },
  {
    id: 7,
    text: "Após ter perdido você sentiu como se necessitasse voltar o mais cedo possível a recuperar as suas perdas?",
  },
  {
    id: 8,
    text: "Após um ganho você sentiu uma forte vontade de ganhar mais?",
  },
  {
    id: 9,
    text: "Você geralmente jogava até que seu último centavo acabasse?",
  },
  {
    id: 10,
    text: "Você relutava em usar o 'dinheiro do jogo' para as despesas normais?",
  },
  {
    id: 11,
    text: "Alguma vez você já vendeu alguma coisa para financiar seu jogo?",
  },
  {
    id: 12,
    text: "Você já pediu dinheiro emprestado para financiar seu jogo?",
  },
  {
    id: 13,
    text: "O jogo o tornou descuidado com seu bem-estar e o da sua família?",
  },
  {
    id: 14,
    text: "Alguma vez você jogou por mais tempo do que planejava?",
  },
  {
    id: 15,
    text: "Alguma vez você já jogou para fugir das preocupações ou problemas?",
  },
  {
    id: 16,
    text: "Alguma vez você já cometeu, ou pensou em cometer um ato ilegal para financiar o jogo?",
  },
  {
    id: 17,
    text: "O jogo fez com que você tivesse dificuldades para dormir?",
  },
  {
    id: 18,
    text: "As discussões, desapontamentos ou frustrações fizeram com que você tivesse vontade de jogar?",
  },
  {
    id: 19,
    text: "Alguma vez você já teve vontade de celebrar alguma boa sorte com algumas horas de jogo?",
  },
  {
    id: 20,
    text: "Alguma vez você já pensou em se autodestruir como resultado do seu jogo?",
  },
];

export default function QuizAutoavaliacao() {
  const { user, loading: authLoading } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(new Array(QUIZ_QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Você precisa estar logado para fazer o quiz.</p>
          <Link href="/">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer: boolean) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (answers[currentQuestion] !== null && currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const yesCount = answers.filter((a) => a === true).length;
  const riskLevel = yesCount >= 7 ? "alto" : yesCount >= 4 ? "moderado" : "baixo";
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 border-2 border-primary/40 hover:border-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>

          <Card className="border-2 border-primary/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-primary">
                Resultado do Quiz
              </CardTitle>
              <CardDescription>
                Baseado no questionário de Jogadores Anônimos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resultado Visual */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {yesCount}
                </div>
                <p className="text-lg text-muted-foreground">
                  de 20 respostas "Sim"
                </p>
              </div>

              {/* Indicador de Risco */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {riskLevel === "alto" && (
                    <>
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                      <span className="text-lg font-semibold text-destructive">
                        Risco Alto de Vício em Jogo
                      </span>
                    </>
                  )}
                  {riskLevel === "moderado" && (
                    <>
                      <AlertCircle className="w-6 h-6 text-yellow-500" />
                      <span className="text-lg font-semibold text-yellow-500">
                        Risco Moderado
                      </span>
                    </>
                  )}
                  {riskLevel === "baixo" && (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                      <span className="text-lg font-semibold text-primary">
                        Risco Baixo
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Mensagens Personalizadas */}
              <Card className="bg-background/50 border-primary/20">
                <CardContent className="pt-6">
                  {riskLevel === "alto" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-destructive">
                        ⚠️ Você mostrou sinais significativos de vício em jogo.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        A maioria dos jogadores compulsivos responde "Sim" a pelo menos 7 dessas perguntas. 
                        Você respondeu "Sim" a {yesCount} perguntas.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Recomendamos procurar ajuda profissional imediatamente.
                      </p>
                    </div>
                  )}
                  {riskLevel === "moderado" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-yellow-600">
                        ⚠️ Você mostrou alguns sinais de comportamento problemático com jogo.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Respondeu "Sim" a {yesCount} perguntas. Recomendamos estar atento aos seus hábitos 
                        e considerar buscar orientação profissional.
                      </p>
                    </div>
                  )}
                  {riskLevel === "baixo" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-primary">
                        ✓ Seus resultados sugerem um risco baixo de vício em jogo.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Respondeu "Sim" a apenas {yesCount} perguntas. Continue monitorando seus hábitos 
                        e use as ferramentas de proteção do HelpGames.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recomendações */}
              <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Próximos Passos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>✓ Ative o bloqueio de 30 minutos quando sentir vontade de apostar</p>
                  <p>✓ Use o Modo Crise para situações de emergência</p>
                  <p>✓ Consulte um profissional de saúde mental</p>
                  <p>✓ Procure grupos de suporte como Jogadores Anônimos</p>
                </CardContent>
              </Card>

              {/* Botões de Ação */}
              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button className="w-full border-2 border-primary/60 hover:border-primary">
                    Voltar ao Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
                    setShowResults(false);
                  }}
                  className="border-2 border-primary/40 hover:border-primary"
                >
                  Refazer Quiz
                </Button>
              </div>

              {/* Crédito */}
              <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
                Baseado no questionário de <strong>Jogadores Anônimos</strong> - Organização sem fins lucrativos
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 border-2 border-primary/40 hover:border-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Quiz de Autoavaliação
            </h1>
            <p className="text-muted-foreground">
              Baseado no questionário de Jogadores Anônimos
            </p>
          </div>
        </div>

        {/* Progresso */}
        <Card className="mb-6 border-2 border-primary/30 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">
                Pergunta {currentQuestion + 1} de {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Pergunta */}
        <Card className="border-2 border-primary/40 bg-card/50 backdrop-blur mb-6">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              {QUIZ_QUESTIONS[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => handleAnswer(true)}
                className={`flex-1 border-2 py-6 text-lg font-semibold transition-all ${
                  answers[currentQuestion] === true
                    ? "bg-destructive border-destructive hover:bg-destructive/90"
                    : "bg-background border-destructive/40 hover:border-destructive text-foreground"
                }`}
              >
                Sim
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                className={`flex-1 border-2 py-6 text-lg font-semibold transition-all ${
                  answers[currentQuestion] === false
                    ? "bg-primary border-primary hover:bg-primary/90"
                    : "bg-background border-primary/40 hover:border-primary text-foreground"
                }`}
              >
                Não
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navegação */}
        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="border-2 border-primary/40 hover:border-primary disabled:opacity-50"
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === null || currentQuestion === QUIZ_QUESTIONS.length - 1}
            className="flex-1 border-2 border-primary/60 hover:border-primary"
          >
            Próxima
          </Button>
          {currentQuestion === QUIZ_QUESTIONS.length - 1 && answers[currentQuestion] !== null && (
            <Button
              onClick={() => setShowResults(true)}
              className="flex-1 bg-primary border-2 border-primary/60 hover:border-primary"
            >
              Ver Resultados
            </Button>
          )}
        </div>

        {/* Informação */}
        <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-sm text-muted-foreground">
          <p>
            <strong>Nota:</strong> Este quiz é baseado no questionário de Jogadores Anônimos. 
            A maioria dos jogadores compulsivos responde "Sim" a pelo menos 7 dessas perguntas.
          </p>
        </div>
      </div>
    </div>
  );
}
