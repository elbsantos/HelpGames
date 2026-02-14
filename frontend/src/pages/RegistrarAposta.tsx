import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, DollarSign, PartyPopper, Target } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function RegistrarAposta() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: profile } = trpc.financialProfile.get.useQuery(undefined, {
    enabled: !!user,
  });
  
  const utils = trpc.useUtils();
  const createBet = trpc.avoidedBets.create.useMutation({
    onSuccess: () => {
      utils.avoidedBets.list.invalidate();
      utils.avoidedBets.totalPreserved.invalidate();
      utils.statistics.get.invalidate();
      setShowSuccess(true);
    },
    onError: (error) => {
      toast.error(`Erro ao registrar: ${error.message}`);
    },
  });

  const [amount, setAmount] = useState("");
  const [emotionalContext, setEmotionalContext] = useState("");
  const [showRealityCheck, setShowRealityCheck] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountInCents = Math.round(parseFloat(amount) * 100);
    
    if (amountInCents <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }
    
    // Mostrar choque de realidade antes de salvar
    setShowRealityCheck(true);
  };

  const confirmRegistration = () => {
    const amountInCents = Math.round(parseFloat(amount) * 100);
    
    createBet.mutate({
      amount: amountInCents,
      emotionalContext: emotionalContext.trim() || undefined,
    });
    
    setShowRealityCheck(false);
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const amountInCents = Math.round(parseFloat(amount || "0") * 100);
  const leisureBudget = profile?.leisureBudget || 0;
  const percentageOfBudget = leisureBudget > 0 ? (amountInCents / leisureBudget) * 100 : 0;
  
  let impactMessage = "";
  let impactColor = "text-muted-foreground";
  
  if (percentageOfBudget > 0) {
    if (percentageOfBudget >= 100) {
      impactMessage = `Este valor representa TODO o seu orçamento de lazer do mês! Você gastaria ${Math.floor(percentageOfBudget / 100)} meses de diversão em minutos.`;
      impactColor = "text-destructive";
    } else if (percentageOfBudget >= 50) {
      impactMessage = `Este valor representa ${percentageOfBudget.toFixed(0)}% do seu orçamento de lazer mensal. Metade da sua diversão do mês em uma aposta!`;
      impactColor = "text-destructive";
    } else if (percentageOfBudget >= 25) {
      impactMessage = `Este valor representa ${percentageOfBudget.toFixed(0)}% do seu orçamento de lazer. Um quarto do seu mês de diversão!`;
      impactColor = "text-chart-3";
    } else {
      impactMessage = `Este valor representa ${percentageOfBudget.toFixed(0)}% do seu orçamento de lazer mensal.`;
      impactColor = "text-muted-foreground";
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HelpGames</h1>
                <p className="text-sm text-muted-foreground">Registrar Aposta Evitada</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/perfil-financeiro">
                <Button variant="ghost">Perfil Financeiro</Button>
              </Link>
              <Link href="/metas">
                <Button variant="ghost">Metas</Button>
              </Link>
              <Link href="/modo-crise">
                <Button variant="destructive">Modo Crise</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Título */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Registrar Aposta Evitada</h2>
            <p className="text-muted-foreground">
              Parabéns por resistir ao impulso! Registre sua vitória aqui.
            </p>
          </div>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Aposta Evitada</CardTitle>
              <CardDescription>
                Quanto você queria apostar e como estava se sentindo?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor que Você Queria Apostar (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                      required
                    />
                  </div>
                  {amountInCents > 0 && leisureBudget > 0 && (
                    <div className={`text-sm font-medium ${impactColor} flex items-start gap-2 mt-2 p-3 rounded-lg bg-secondary/50`}>
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <p>{impactMessage}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emotionalContext">Como Você Estava Se Sentindo? (Opcional)</Label>
                  <Textarea
                    id="emotionalContext"
                    value={emotionalContext}
                    onChange={(e) => setEmotionalContext(e.target.value)}
                    placeholder="Ex: Ansioso, entediado, estressado com o trabalho..."
                    rows={4}
                  />
                  <p className="text-sm text-muted-foreground">
                    Identificar padrões emocionais ajuda a prevenir futuras recaídas
                  </p>
                </div>

                {!profile && (
                  <Card className="border-chart-3/50 bg-chart-3/5">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground">
                        💡 <strong>Dica:</strong> Configure seu{" "}
                        <Link href="/perfil-financeiro">
                          <Button variant="link" className="px-1 h-auto">perfil financeiro</Button>
                        </Link>
                        {" "}para ver o impacto real desta aposta no seu orçamento mensal.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={createBet.isPending}>
                    Registrar Vitória
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog: Choque de Realidade */}
      <Dialog open={showRealityCheck} onOpenChange={setShowRealityCheck}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              Choque de Realidade
            </DialogTitle>
            <DialogDescription className="text-base pt-4 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground mb-2">
                  {formatCurrency(amountInCents)}
                </p>
                <p className="text-muted-foreground">
                  era o valor que você queria apostar
                </p>
              </div>
              
              {leisureBudget > 0 && (
                <div className={`p-4 rounded-lg bg-destructive/10 border border-destructive/20`}>
                  <p className={`font-semibold ${impactColor}`}>
                    {impactMessage}
                  </p>
                </div>
              )}
              
              <div className="text-center pt-4">
                <p className="font-semibold text-primary text-lg">
                  Mas você resistiu! 🎉
                </p>
                <p className="text-muted-foreground mt-2">
                  Ao evitar esta aposta, você está mais perto dos seus objetivos reais.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button onClick={confirmRegistration} className="flex-1" disabled={createBet.isPending}>
              {createBet.isPending ? "Salvando..." : "Confirmar Registro"}
            </Button>
            <Button variant="outline" onClick={() => setShowRealityCheck(false)}>
              Voltar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Sucesso */}
      <Dialog open={showSuccess} onOpenChange={(open) => {
        setShowSuccess(open);
        if (!open) {
          setAmount("");
          setEmotionalContext("");
          setLocation("/dashboard");
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary text-center justify-center">
              <PartyPopper className="h-6 w-6" />
              Parabéns! Vitória Registrada!
            </DialogTitle>
            <DialogDescription className="text-base pt-4 space-y-4 text-center">
              <div className="text-6xl">🎉</div>
              <p className="text-lg font-semibold text-foreground">
                Você acabou de economizar {formatCurrency(amountInCents)}!
              </p>
              <p className="text-muted-foreground">
                Mais uma vitória na sua jornada de recuperação. Continue assim!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => {
              setShowSuccess(false);
              setAmount("");
              setEmotionalContext("");
            }} className="flex-1">
              Registrar Outra
            </Button>
            <Button variant="outline" onClick={() => {
              setShowSuccess(false);
              setLocation("/dashboard");
            }}>
              Ir para Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
