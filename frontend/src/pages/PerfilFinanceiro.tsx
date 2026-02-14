import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { DollarSign, Info, Target } from "lucide-react";
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
  const leisureBudget = Math.floor(incomeInCents * 0.3);
  const savingsBudget = Math.floor(incomeInCents * 0.2);
  const necessitiesBudget = Math.floor(incomeInCents * 0.5);

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
                Regra 50-30-20
              </CardTitle>
              <CardDescription className="text-base">
                Método comprovado de gestão financeira que divide sua renda em três categorias:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-chart-1/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-chart-1">50%</span>
                </div>
                <div>
                  <p className="font-semibold">Necessidades Básicas</p>
                  <p className="text-sm text-muted-foreground">
                    Moradia, alimentação, transporte, contas essenciais
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-chart-3">30%</span>
                </div>
                <div>
                  <p className="font-semibold">Lazer e Desejos</p>
                  <p className="text-sm text-muted-foreground">
                    Entretenimento, hobbies, restaurantes - sua verba de lazer segura
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-chart-2">20%</span>
                </div>
                <div>
                  <p className="font-semibold">Poupança e Investimentos</p>
                  <p className="text-sm text-muted-foreground">
                    Reserva de emergência, investimentos, objetivos futuros
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
                  <Card className="bg-secondary/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição Recomendada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Necessidades (50%)</span>
                        <span className="font-semibold">{formatCurrency(necessitiesBudget)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lazer (30%)</span>
                        <span className="font-semibold text-primary">{formatCurrency(leisureBudget)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Poupança (20%)</span>
                        <span className="font-semibold">{formatCurrency(savingsBudget)}</span>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Verba de Lazer Segura</span>
                          <span className="text-xl font-bold text-primary">{formatCurrency(leisureBudget)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Este é o valor que você pode gastar com lazer sem comprometer suas finanças
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={upsertProfile.isPending}>
                    {upsertProfile.isPending ? "Salvando..." : "Salvar Perfil"}
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
    </div>
  );
}
