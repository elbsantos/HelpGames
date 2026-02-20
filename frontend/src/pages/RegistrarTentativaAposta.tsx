import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, TrendingDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function RegistrarTentativaAposta() {
  const { user } = useAuth();
  const [selectedSite, setSelectedSite] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bettingAmount, setBettingAmount] = useState("");
  const [odds, setOdds] = useState("");
  const [emotionalContext, setEmotionalContext] = useState("");
  const [showImpactAlert, setShowImpactAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar sites de apostas
  const { data: gamblingWebsites = [] } = trpc.gambling.searchSites.useQuery(
    { search: searchTerm },
    { enabled: searchTerm.length > 0 }
  );

  // Buscar perfil financeiro do usuário
  const { data: profile } = trpc.profile.getProfile.useQuery();

  // Buscar hobbies do usuário
  const { data: hobbies = [] } = trpc.hobbies.listHobbies.useQuery();

  // Calcular impacto financeiro
  const impact = useMemo(() => {
    if (!bettingAmount || !profile) return null;

    const amount = parseFloat(bettingAmount);
    const leisureLimit = profile.leisureBudget;
    const alreadySpent = profile.bettingSpentThisMonth || 0;
    const remaining = leisureLimit - alreadySpent;
    const percentageOfRemaining = (amount / remaining) * 100;
    const percentageOfTotal = (amount / leisureLimit) * 100;

    return {
      amount,
      remaining,
      percentageOfRemaining,
      percentageOfTotal,
      wouldExceedLimit: amount > remaining,
    };
  }, [bettingAmount, profile]);

  // Registrar tentativa de aposta
  const registerAttempt = trpc.gambling.registerAccessAttempt.useMutation({
    onSuccess: () => {
      toast.success("✅ Tentativa registrada com sucesso!");
      // Limpar formulário
      setSelectedSite("");
      setBettingAmount("");
      setOdds("");
      setEmotionalContext("");
      setSearchTerm("");
      setShowImpactAlert(false);
    },
    onError: (error: any) => {
      toast.error(`❌ Erro ao registrar: ${error.message}`);
    },
  });

  const handleSubmit = async () => {
    if (!selectedSite || !bettingAmount || !emotionalContext) {
      toast.error("⚠️ Preencha todos os campos obrigatórios");
      return;
    }

    if (impact?.wouldExceedLimit) {
      toast.error("⛔ Você não tem saldo suficiente neste mês!");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAttempt.mutateAsync({
        dominio: selectedSite,
        valor: parseFloat(bettingAmount),
        odds: odds ? parseFloat(odds) : undefined,
        contexto_emocional: emotionalContext,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Você precisa estar autenticado para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Registrar Tentativa de Aposta
          </h1>
          <p className="text-slate-600">
            Registre quando você tenta acessar um site de apostas. Isso ajuda você a entender seus padrões e tomar decisões melhores.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Detecção de Site de Aposta
            </CardTitle>
            <CardDescription>
              Busque o site de apostas que você tentou acessar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site-search">Qual site você tentou acessar?</Label>
              <Input
                id="site-search"
                placeholder="Digite o nome do site (ex: Bet365, Betano...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2"
              />
              {searchTerm && gamblingWebsites.length > 0 && (
                <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                  {gamblingWebsites.map((site: any) => (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedSite(site.dominio);
                        setSearchTerm("");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 border-b last:border-b-0 transition"
                    >
                      <div className="font-medium text-slate-900">{site.nome_site}</div>
                      <div className="text-sm text-slate-500">{site.dominio}</div>
                    </button>
                  ))}
                </div>
              )}
              {selectedSite && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-green-900">{selectedSite}</span>
                  <button
                    onClick={() => setSelectedSite("")}
                    className="ml-auto text-sm text-green-600 hover:text-green-700"
                  >
                    Mudar
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes da Tentativa</CardTitle>
            <CardDescription>
              Quanto você tentou apostar e como você se sentia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Valor da Aposta (R$) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={bettingAmount}
                  onChange={(e) => setBettingAmount(e.target.value)}
                  className="mt-2"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="odds">Odds (opcional)</Label>
                <Input
                  id="odds"
                  type="number"
                  placeholder="1.50"
                  value={odds}
                  onChange={(e) => setOdds(e.target.value)}
                  className="mt-2"
                  step="0.01"
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="context">Como você se sentia? *</Label>
              <Select value={emotionalContext} onValueChange={setEmotionalContext}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione seu estado emocional" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ansioso">😰 Ansioso</SelectItem>
                  <SelectItem value="tedio">😑 Tédio</SelectItem>
                  <SelectItem value="frustrado">😠 Frustrado</SelectItem>
                  <SelectItem value="euforia">🤩 Euforia</SelectItem>
                  <SelectItem value="estresse">😤 Estresse</SelectItem>
                  <SelectItem value="insonia">😴 Insônia</SelectItem>
                  <SelectItem value="curiosidade">🤔 Curiosidade</SelectItem>
                  <SelectItem value="outro">❓ Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerta de Impacto Financeiro */}
        {impact && (
          <Card className={`mb-6 border-2 ${impact.wouldExceedLimit ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className={`w-5 h-5 ${impact.wouldExceedLimit ? "text-red-600" : "text-amber-600"}`} />
                Impacto Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Você tentaria apostar:</p>
                <p className="text-2xl font-bold text-slate-900">R$ {impact.amount.toFixed(2)}</p>
              </div>

              <div className="bg-white rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Limite mensal:</span>
                  <span className="font-semibold">R$ {profile?.leisureBudget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Já gasto este mês:</span>
                  <span className="font-semibold">R$ {(profile?.bettingSpentThisMonth || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-slate-600">Restante:</span>
                  <span className={`font-bold ${impact.wouldExceedLimit ? "text-red-600" : "text-green-600"}`}>
                    R$ {impact.remaining.toFixed(2)}
                  </span>
                </div>
              </div>

              {impact.wouldExceedLimit ? (
                <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                  <p className="text-red-900 font-semibold">⛔ Você ultrapassaria seu limite!</p>
                  <p className="text-red-800 text-sm mt-1">
                    Faltariam R$ {(impact.amount - impact.remaining).toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                  <p className="text-green-900 font-semibold">✅ Você ainda tem saldo</p>
                  <p className="text-green-800 text-sm mt-1">
                    Isso representa {impact.percentageOfRemaining.toFixed(1)}% do que você tem disponível este mês
                  </p>
                  {hobbies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-green-900 font-semibold text-sm mb-2">💡 Que tal fazer isso em vez disso?</p>
                      <div className="space-y-1">
                        {hobbies.slice(0, 2).map((hobby: any) => (
                          <p key={hobby.id} className="text-green-800 text-sm">
                            • {hobby.nome}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={!selectedSite || !bettingAmount || !emotionalContext || isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Registrando..." : "✅ Registrar Tentativa"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedSite("");
              setBettingAmount("");
              setOdds("");
              setEmotionalContext("");
              setSearchTerm("");
            }}
          >
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
