import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function HistoricoBloqueios() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/");
    return null;
  }

  const { data: blockageHistory, isLoading: historyLoading } = trpc.betsBlockage.getHistory.useQuery();
  const { data: blockageStats, isLoading: statsLoading } = trpc.betsBlockage.getStats.useQuery();

  const isLoading = historyLoading || statsLoading;

  const successRate = useMemo(() => {
    if (!blockageStats || blockageStats.totalBlockages === 0) return 0;
    return (blockageStats.successfulBlockages / blockageStats.totalBlockages) * 100;
  }, [blockageStats]);

  const totalHours = useMemo(() => {
    if (!blockageStats) return 0;
    return Math.floor(blockageStats.totalMinutesBlocked / 60);
  }, [blockageStats]);

  const totalMinutes = useMemo(() => {
    if (!blockageStats) return 0;
    return blockageStats.totalMinutesBlocked % 60;
  }, [blockageStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-slate-200 rounded-lg"></div>
            <div className="h-96 bg-slate-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Histórico de Bloqueios</h1>
          <p className="text-slate-600">Acompanhe seus períodos de proteção contra apostas</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Bloqueios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{blockageStats?.totalBlockages || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Períodos ativados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Taxa de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{successRate.toFixed(0)}%</div>
              <p className="text-xs text-slate-500 mt-1">{blockageStats?.successfulBlockages || 0} bem-sucedidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tempo Total Bloqueado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalHours}h {totalMinutes}m</div>
              <p className="text-xs text-slate-500 mt-1">{blockageStats?.totalMinutesBlocked || 0} minutos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Economia Estimada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">R$ {((blockageStats?.totalMinutesBlocked || 0) * 0.5).toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1">Baseado em R$ 0,50/min</p>
            </CardContent>
          </Card>
        </div>

        {/* Histórico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Períodos de Bloqueio
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!blockageHistory || blockageHistory.length === 0 ? (
              <div className="text-center py-12">
                <Lock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Nenhum bloqueio registrado ainda</p>
                <p className="text-slate-500 text-sm mt-1">Quando você ativar um bloqueio, ele aparecerá aqui</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockageHistory.map((blockage) => (
                  <div
                    key={blockage.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${blockage.wasSuccessful ? "bg-green-100" : "bg-amber-100"}`}>
                        {blockage.wasSuccessful ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">
                            {blockage.durationMinutes} minutos de proteção
                          </p>
                          <Badge variant={blockage.wasSuccessful ? "default" : "secondary"}>
                            {blockage.wasSuccessful ? "Concluído" : "Em andamento"}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          Iniciado em {new Date(blockage.createdAt).toLocaleString("pt-BR")}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Bloqueado até {new Date(blockage.blockedUntil).toLocaleString("pt-BR")}
                        </p>
                      </div>
                    </div>

                    {blockage.wasSuccessful && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">✅ Sucesso</p>
                        <p className="text-xs text-slate-500">Resistiu ao impulso</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dicas */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <TrendingUp className="w-5 h-5" />
              Dicas para Melhorar sua Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-900">
            <p>• Ative bloqueios quando sentir vontade de apostar</p>
            <p>• Combine com atividades alternativas (hobbies)</p>
            <p>• Aumente a duração dos bloqueios gradualmente</p>
            <p>• Use o Modo Crise se precisar de apoio imediato</p>
          </CardContent>
        </Card>

        {/* Botão voltar */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="flex-1"
          >
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
