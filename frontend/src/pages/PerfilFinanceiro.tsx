import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, DollarSign, Info, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function PerfilFinanceiro() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: profile, isLoading } = trpc.financialProfile.get.useQuery(undefined, {
    enabled: !!user,
  });
  
  const upsertProfile = trpc.financialProfile.upsert.useMutation({
    onSuccess: () => {
      toast.success("Perfil financeiro atualizado com sucesso!");
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast.error(`Erro ao salvar: ${error.message}`);
    },
  });

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [fixedExpenses, setFixedExpenses] = useState("");
  const [bettingPercentage, setBettingPercentage] = useState(10);
  const [cinemaPercentage, setCinemaPercentage] = useState(20);
  const [hobbiesPercentage, setHobbiesPercentage] = useState(30);
  const [travelPercentage, setTravelPercentage] = useState(20);
  const [otherPercentage, setOtherPercentage] = useState(20);

  useEffect(() => {
    if (profile) {
      setMonthlyIncome((profile.monthlyIncome / 100).toFixed(2));
      setFixedExpenses((profile.fixedExpenses / 100).toFixed(2));
    }
  }, [profile]);

  if (authLoading || isLoading) {
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
    
    const incomeInCents = Math.round(parseFloat(monthlyIncome) * 100);
    const expensesInCents = Math.round(parseFloat(fixedExpenses) * 100);
    
    if (incomeInCents <= 0) {
      toast.error("A renda mensal deve ser maior que zero");
      return;
    }
    
    if (expensesInCents < 0) {
      toast.error("As despesas não podem ser negativas");
      return;
    }
    
    if (expensesInCents > incomeInCents) {
      toast.error("As despesas não podem ser maiores que a renda");
      return;
    }

    const totalAllocation = bettingPercentage + cinemaPercentage + hobbiesPercentage + travelPercentage + otherPercentage;
    if (totalAllocation !== 100) {
      toast.error(`A soma dos percentuais deve ser 100% (atual: ${totalAllocation}%)`);
      return;
    }
    
    upsertProfile.mutate({
      monthlyIncome: incomeInCents,
      fixedExpenses: expensesInCents,
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const incomeInCents = Math.round(parseFloat(monthlyIncome || "0") * 100);
  const expensesInCents = Math.round(parseFloat(fixedExpenses || "0") * 100);
  
  // Necessidades são as despesas reais preenchidas pelo usuário
  const necessitiesBudget = expensesInCents;
  
  // Calcular o saldo restante após despesas
  const remainingBudget = Math.max(0, incomeInCents - expensesInCents);
  
  // Proporção 3:2 (lazer:poupança) do saldo restante
  // Lazer = 60% do saldo (3/5)
  // Poupança = 40% do saldo (2/5)
  const leisureBudget = Math.floor(remainingBudget * 0.6);
  const savingsBudget = remainingBudget - leisureBudget; // Resto para fechar em 100%

  // Verificar saúde financeira
  const expensesPercentage = incomeInCents > 0 ? (expensesInCents / incomeInCents) * 100 : 0;
  const hasFinancialHealthWarning = expensesPercentage > 50;

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
                <p className="text-sm text-muted-foreground">Perfil Financeiro</p>
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

      <main className="container py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Título */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Perfil Financeiro</h2>
            <p className="text-muted-foreground">
              Configure sua renda e despesas para calcular sua verba de lazer segura
            </p>
          </div>

          {/* Explicação da Regra 50-30-20 */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Distribuição Inteligente de Renda
              </CardTitle>
              <CardDescription className="text-base">
                Seu saldo após despesas é distribuído em proporção 3:2 entre lazer e poupança:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-chart-1">100%</span>
                </div>
                <div>
                  <p className="font-semibold">Necessidades Básicas</p>
                  <p className="text-sm text-muted-foreground">
                    Suas despesas fixas reais (moradia, alimentação, transporte, contas)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-chart-3">60%</span>
                </div>
                <div>
                  <p className="font-semibold">Lazer e Desejos</p>
                  <p className="text-sm text-muted-foreground">
                    60% do seu saldo restante (entretenimento, hobbies, restaurantes)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-chart-2">40%</span>
                </div>
                <div>
                  <p className="font-semibold">Poupança e Investimentos</p>
                  <p className="text-sm text-muted-foreground">
                    40% do seu saldo restante (reserva de emergência, investimentos, objetivos)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Suas Informações Financeiras</CardTitle>
              <CardDescription>
                Informe sua renda mensal e despesas fixas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthlyIncome"
                      type="number"
                      step="0.01"
                      min="0"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sua renda total mensal (salário, freelances, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixedExpenses">Despesas Fixas (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fixedExpenses"
                      type="number"
                      step="0.01"
                      min="0"
                      value={fixedExpenses}
                      onChange={(e) => setFixedExpenses(e.target.value)}
                      placeholder="0,00"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aluguel, contas, alimentação, transporte, etc.
                  </p>
                </div>

                {incomeInCents > 0 && (
                  <>
                    {/* Alerta de Saúde Financeira */}
                    {hasFinancialHealthWarning && (
                      <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                                ⚠️ Saúde Financeira em Risco
                              </p>
                              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                                Suas despesas fixas representam {expensesPercentage.toFixed(1)}% da sua renda. 
                                O recomendado é manter em até 50%. Considere reduzir despesas ou aumentar renda para melhorar sua situação.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="bg-secondary/50">
                      <CardHeader>
                        <CardTitle className="text-lg">Distribuição de Sua Renda</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Necessidades (Despesas Fixas)</span>
                          <span className="font-semibold">{formatCurrency(necessitiesBudget)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Lazer (60% do saldo)</span>
                          <span className="font-semibold text-primary">{formatCurrency(leisureBudget)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Poupança (40% do saldo)</span>
                          <span className="font-semibold">{formatCurrency(savingsBudget)}</span>
                        </div>
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-primary">{formatCurrency(incomeInCents)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Necessidades + Lazer + Poupança = 100% da sua renda
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Alocação de Lazer em Subcategorias */}
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Como Você Quer Distribuir Seus {formatCurrency(leisureBudget)} de Lazer?</CardTitle>
                        <CardDescription>
                          Customize como dividir seus 60% do saldo entre apostas, cinema, hobbies, viagens e outros
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Apostas Online: {bettingPercentage}%</Label>
                            <span className="font-semibold text-destructive">{formatCurrency(Math.floor(leisureBudget * (bettingPercentage / 100)))}</span>
                          </div>
                          <Slider
                            value={[bettingPercentage]}
                            onValueChange={(value) => setBettingPercentage(value[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            Limite mensal para apostas online (máximo 10% dos 60% de lazer é recomendado)
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Cinema/Séries: {cinemaPercentage}%</Label>
                            <span className="font-semibold">{formatCurrency(Math.floor(leisureBudget * (cinemaPercentage / 100)))}</span>
                          </div>
                          <Slider
                            value={[cinemaPercentage]}
                            onValueChange={(value) => setCinemaPercentage(value[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Hobbies/Atividades: {hobbiesPercentage}%</Label>
                            <span className="font-semibold">{formatCurrency(Math.floor(leisureBudget * (hobbiesPercentage / 100)))}</span>
                          </div>
                          <Slider
                            value={[hobbiesPercentage]}
                            onValueChange={(value) => setHobbiesPercentage(value[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Viagens/Passeios: {travelPercentage}%</Label>
                            <span className="font-semibold">{formatCurrency(Math.floor(leisureBudget * (travelPercentage / 100)))}</span>
                          </div>
                          <Slider
                            value={[travelPercentage]}
                            onValueChange={(value) => setTravelPercentage(value[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Outros: {otherPercentage}%</Label>
                            <span className="font-semibold">{formatCurrency(Math.floor(leisureBudget * (otherPercentage / 100)))}</span>
                          </div>
                          <Slider
                            value={[otherPercentage]}
                            onValueChange={(value) => setOtherPercentage(value[0])}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total de Lazer Alocado</span>
                            <span className="text-lg font-bold text-primary">
                              {formatCurrency(Math.floor(leisureBudget * ((bettingPercentage + cinemaPercentage + hobbiesPercentage + travelPercentage + otherPercentage) / 100)))}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Soma dos percentuais: {bettingPercentage + cinemaPercentage + hobbiesPercentage + travelPercentage + otherPercentage}%
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={upsertProfile.isPending}
                >
                  {upsertProfile.isPending ? "Salvando..." : "Salvar Perfil Financeiro"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
