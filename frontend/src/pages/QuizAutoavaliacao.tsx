import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, AlertTriangle, Heart } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

interface Question {
  id: number;
  text: string;
  options: string[];
  scores: number[];
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Com que frequência você pensa em apostas?",
    options: ["Raramente", "Às vezes", "Frequentemente", "Constantemente"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 2,
    text: "Você já mentiu sobre quanto dinheiro gastou em apostas?",
    options: ["Nunca", "Uma ou duas vezes", "Várias vezes", "Regularmente"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 3,
    text: "Como você se sente quando não consegue apostar?",
    options: ["Normal", "Um pouco ansioso", "Muito ansioso", "Extremamente ansioso"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 4,
    text: "Você já tentou parar ou reduzir apostas sem sucesso?",
    options: ["Nunca tentei", "Tentei uma vez", "Tentei várias vezes", "Sempre falho"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 5,
    text: "Você aposta com dinheiro que deveria usar para contas/necessidades?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 6,
    text: "Alguém já reclamou sobre seu comportamento de apostas?",
    options: ["Nunca", "Uma pessoa", "Algumas pessoas", "Muitas pessoas"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 7,
    text: "Você aposta para escapar de problemas ou sentimentos negativos?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 8,
    text: "Você aumenta o valor das apostas para sentir o mesmo nível de emoção?",
    options: ["Nunca", "Raramente", "Às vezes", "Frequentemente"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 9,
    text: "Você já pediu dinheiro emprestado para apostar?",
    options: ["Nunca", "Uma vez", "Algumas vezes", "Várias vezes"],
    scores: [0, 1, 2, 3],
  },
  {
    id: 10,
    text: "Qual é o seu nível geral de preocupação com suas apostas?",
    options: ["Nenhuma", "Leve", "Moderada", "Severa"],
    scores: [0, 1, 2, 3],
  },
];

interface RiskLevel {
  level: "baixo" | "leve" | "moderado" | "severo";
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  recommendations: string[];
}

const RISK_LEVELS: Record<string, RiskLevel> = {
  baixo: {
    level: "baixo",
    title: "Risco Baixo",
    description: "Seu comportamento de apostas parece estar sob controle.",
    color: "text-green-600",
    icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
    recommendations: [
      "Mantenha seus hábitos atuais de apostas responsáveis",
      "Continue monitorando seu comportamento regularmente",
      "Use as ferramentas de controle disponíveis como prevenção",
    ],
  },
  leve: {
    level: "leve",
    title: "Risco Leve",
    description: "Existem alguns sinais de alerta que você deve observar.",
    color: "text-yellow-600",
    icon: <AlertTriangle className="w-12 h-12 text-yellow-600" />,
    recommendations: [
      "Estabeleça limites claros de tempo e dinheiro para apostas",
      "Use o bloqueio de 30 minutos quando sentir impulsos fortes",
      "Considere falar com alguém de confiança sobre suas apostas",
      "Monitore seu comportamento com mais frequência",
    ],
  },
  moderado: {
    level: "moderado",
    title: "Risco Moderado",
    description: "Há sinais significativos de comportamento problemático.",
    color: "text-orange-600",
    icon: <AlertCircle className="w-12 h-12 text-orange-600" />,
    recommendations: [
      "Use regularmente o bloqueio de bets para proteção",
      "Procure ajuda profissional ou grupos de suporte",
      "Implemente limites estritos de gastos e tempo",
      "Considere autossexclusão em sites de apostas",
      "Compartilhe suas preocupações com família ou amigos",
    ],
  },
  severo: {
    level: "severo",
    title: "Risco Severo",
    description: "Há sinais claros de dependência de apostas.",
    color: "text-red-600",
    icon: <Heart className="w-12 h-12 text-red-600" />,
    recommendations: [
      "🚨 Procure ajuda profissional IMEDIATAMENTE",
      "Entre em contato com Gamblers Anonymous ou similar",
      "Considere internação em programa de tratamento",
      "Use autossexclusão em TODOS os sites de apostas",
      "Peça ajuda para gerenciar suas finanças",
      "Considere terapia cognitivo-comportamental especializada",
    ],
  },
};

export default function QuizAutoavaliacao() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você precisa estar autenticado para acessar este quiz.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAnswer = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const maxScore = QUIZ_QUESTIONS.length * 3;
  const percentage = (totalScore / maxScore) * 100;

  let riskLevel: RiskLevel;
  if (percentage <= 20) {
    riskLevel = RISK_LEVELS.baixo;
  } else if (percentage <= 40) {
    riskLevel = RISK_LEVELS.leve;
  } else if (percentage <= 70) {
    riskLevel = RISK_LEVELS.moderado;
  } else {
    riskLevel = RISK_LEVELS.severo;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Resultado do Quiz</CardTitle>
              <CardDescription>Sua avaliação de risco de comportamento de apostas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Visual */}
              <div className="flex justify-center mb-6">
                {riskLevel.icon}
              </div>

              {/* Risk Level */}
              <div className="text-center">
                <h2 className={`text-2xl font-bold ${riskLevel.color} mb-2`}>
                  {riskLevel.title}
                </h2>
                <p className="text-gray-600 mb-4">{riskLevel.description}</p>

                {/* Score Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Score: {totalScore}/{maxScore}</span>
                    <span>{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-3" />
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Recomendações para Você
                </h3>
                <ul className="space-y-2">
                  {riskLevel.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-900">Recursos de Ajuda</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Se você está preocupado com seu comportamento de apostas, existem recursos disponíveis:
                </p>
                <ul className="text-sm space-y-1 text-blue-800">
                  <li>📞 Gamblers Anonymous: Grupos de suporte gratuitos</li>
                  <li>💬 NCPG National Problem Gambling Helpline: 1-800-522-4700</li>
                  <li>🌐 Betfilter: Bloqueador de sites de apostas</li>
                  <li>👨‍⚕️ Terapia Cognitivo-Comportamental especializada</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScores([]);
                    setShowResults(false);
                  }}
                  className="flex-1"
                >
                  Refazer Quiz
                </Button>
                <Button className="flex-1">Voltar ao Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>Quiz de Autoavaliação</CardTitle>
                <span className="text-sm font-medium text-gray-600">
                  {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Question */}
            <div>
              <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
              <p className="text-sm text-gray-600 mb-4">
                Selecione a opção que melhor descreve sua situação
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left hover:bg-slate-100"
                  onClick={() => handleAnswer(question.scores[idx])}
                >
                  <span className="flex-1">{option}</span>
                  <span className="text-xs text-gray-500">
                    {question.scores[idx] === 0 ? "✓ Baixo risco" : `${question.scores[idx]} pts`}
                  </span>
                </Button>
              ))}
            </div>

            {/* Info */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-sm text-blue-800">
              <p>
                Este quiz é baseado em critérios de avaliação de comportamento de apostas. Suas respostas são
                confidenciais e usadas apenas para gerar recomendações personalizadas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
