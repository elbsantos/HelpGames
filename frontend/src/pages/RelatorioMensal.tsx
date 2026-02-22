import { useState } from "react";
import { useAuth } from "../_core/hooks/useAuth";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Switch } from "../components/ui/switch";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function RelatorioMensal() {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const sendReportMutation = trpc.monthlyReport.send.useMutation({
    onSuccess: () => {
      setLastSent(new Date());
      setIsSending(false);
    },
    onError: () => {
      setIsSending(false);
    },
  });

  const toggleEmailMutation = trpc.monthlyReport.toggleEmail.useMutation();

  const handleSendReport = async () => {
    setIsSending(true);
    await sendReportMutation.mutateAsync();
  };

  const handleToggleEmail = async (enabled: boolean) => {
    await toggleEmailMutation.mutateAsync({ enabled });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatório Mensal</h1>
          <p className="text-slate-600">Gerencie seus relatórios de progresso e estatísticas</p>
        </div>

        {/* Card de Envio Manual */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Enviar Relatório Agora
            </CardTitle>
            <CardDescription>
              Receba um resumo completo de sua economia, bloqueios e progresso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastSent && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Último relatório enviado em {lastSent.toLocaleDateString("pt-BR")} às{" "}
                  {lastSent.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-2">O que você receberá:</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Total economizado no mês
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Número de bloqueios ativados
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Tentativas de apostas evitadas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Progresso em relação às metas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Dicas personalizadas de proteção
                </li>
              </ul>
            </div>

            <Button
              onClick={handleSendReport}
              disabled={isSending || sendReportMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isSending || sendReportMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Relatório Agora
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Card de Relatórios Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Automáticos Mensais</CardTitle>
            <CardDescription>
              Receba um relatório automaticamente no primeiro dia de cada mês
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Os relatórios automáticos são enviados para {user?.email || "seu email cadastrado"} no primeiro dia do mês às 8h00
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-semibold text-slate-900">Ativar Relatórios Mensais</p>
                <p className="text-sm text-slate-600">Receba atualizações automáticas de progresso</p>
              </div>
              <Switch
                defaultChecked={true}
                onCheckedChange={handleToggleEmail}
                disabled={toggleEmailMutation.isPending}
              />
            </div>

            {toggleEmailMutation.isSuccess && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {toggleEmailMutation.data?.message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Dicas para Aproveitar Melhor</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <span>Revise seu relatório mensal para identificar padrões de comportamento</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <span>Compare seus números com meses anteriores para acompanhar progresso</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <span>Use os dados para ajustar suas metas e estratégias de proteção</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <span>Compartilhe com um terapeuta ou conselheiro para apoio profissional</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
