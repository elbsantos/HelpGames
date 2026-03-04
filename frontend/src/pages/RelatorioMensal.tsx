import { useState } from "react";
import { useAuth } from "../_core/hooks/useAuth";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Mail, CheckCircle, AlertCircle, Loader2,
  ShieldCheck, TrendingDown, Wallet, Target,
  Calendar, BarChart3, ArrowLeft, Zap
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function RelatorioMensal() {
  const { user } = useAuth();
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const { data: report, isLoading: reportLoading } = trpc.monthlyReport.getReport.useQuery();

  const sendReportMutation = trpc.monthlyReport.send.useMutation({
    onSuccess: () => {
      setLastSent(new Date());
      toast.success("Relatório enviado! Verifique as suas notificações.");
    },
    onError: () => {
      toast.error("Erro ao enviar relatório. Tente novamente.");
    },
  });

  const toggleEmailMutation = trpc.monthlyReport.toggleEmail.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });

  const fmt = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const now = new Date();
  const monthName = now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Relatório Mensal</h1>
            <p className="text-muted-foreground text-sm capitalize">{monthName}</p>
          </div>
          <Badge variant="outline" className="ml-auto border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
            <Calendar className="w-3 h-3 mr-1" />
            {monthName}
          </Badge>
        </div>

        {/* Cards de Estatísticas */}
        {reportLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-muted rounded w-2/3 mb-3" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : report ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Bloqueios</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{report.blockageCount}</p>
                <p className="text-xs text-muted-foreground mt-1">activados este mês</p>
              </CardContent>
            </Card>

            <Card className="border border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Evitadas</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{report.attemptCount}</p>
                <p className="text-xs text-muted-foreground mt-1">tentativas bloqueadas</p>
              </CardContent>
            </Card>

            <Card className="border border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Poupado</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{fmt(report.estimatedSavings)}</p>
                <p className="text-xs text-muted-foreground mt-1">economia estimada</p>
              </CardContent>
            </Card>

            <Card className="border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Saldo</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{fmt(report.remainingBudget)}</p>
                <p className="text-xs text-muted-foreground mt-1">verba restante</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Alert className="border-yellow-500/30 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-200">
              Complete o seu perfil financeiro para ver as estatísticas do relatório.
            </AlertDescription>
          </Alert>
        )}

        {/* Detalhe Financeiro */}
        {report && (
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Detalhe Financeiro — {monthName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Renda mensal</span>
                <span className="font-semibold text-foreground">{fmt(report.monthlyIncome)}</span>
              </div>
              <Separator className="opacity-30" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Verba de lazer definida</span>
                <span className="font-semibold text-foreground">{fmt(report.leisureBudget)}</span>
              </div>
              <Separator className="opacity-30" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Gasto em apostas este mês</span>
                <span className={`font-semibold ${report.bettingSpent > 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {fmt(report.bettingSpent)}
                </span>
              </div>
              <Separator className="opacity-30" />
              <div className="flex justify-between items-center py-2 bg-emerald-500/5 rounded-lg px-3">
                <span className="text-sm font-medium text-foreground">Saldo restante</span>
                <span className={`font-bold text-lg ${report.remainingBudget >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {fmt(report.remainingBudget)}
                </span>
              </div>

              {/* Barra de progresso da verba */}
              {report.leisureBudget > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Verba utilizada</span>
                    <span>{Math.min(100, Math.round((report.bettingSpent / report.leisureBudget) * 100))}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        report.bettingSpent / report.leisureBudget > 0.8 ? "bg-red-500" :
                        report.bettingSpent / report.leisureBudget > 0.5 ? "bg-yellow-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.min(100, (report.bettingSpent / report.leisureBudget) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Metas */}
        {report && (
          <Card className="border border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Próximos Passos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Registe as tentativas de aposta evitadas no dashboard",
                  "Use o bloqueio de 30 minutos quando sentir impulso",
                  "Reveja as suas metas e ajuste conforme o progresso",
                  "Procure apoio profissional se necessário — o CVV está disponível no Modo Crise",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enviar Relatório */}
        <Card className="border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              Enviar Relatório por Notificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastSent && (
              <Alert className="border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <AlertDescription className="text-emerald-300 text-sm">
                  Enviado em {lastSent.toLocaleDateString("pt-BR")} às{" "}
                  {lastSent.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground">
              Receba um resumo do seu progresso mensal com estatísticas de bloqueios, economia e metas.
            </p>

            <Button
              onClick={() => sendReportMutation.mutate()}
              disabled={sendReportMutation.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              {sendReportMutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</>
              ) : (
                <><Mail className="w-4 h-4 mr-2" />Enviar Relatório Agora</>
              )}
            </Button>

            <Separator className="opacity-30" />

            {/* Toggle relatórios automáticos */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Relatórios automáticos mensais</p>
                <p className="text-xs text-muted-foreground">
                  Enviado no 1º dia do mês para {user?.email || "o seu email"}
                </p>
              </div>
              <Switch
                defaultChecked={true}
                onCheckedChange={(enabled) => toggleEmailMutation.mutate({ enabled })}
                disabled={toggleEmailMutation.isPending}
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
