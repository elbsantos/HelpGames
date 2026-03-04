import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap, Shield, BarChart3, Infinity } from "lucide-react";
import { Link } from "wouter";

type Country = "PT" | "BR";
type Interval = "monthly" | "annual";

const PRICES = {
  PT: {
    monthly: { amount: "€2,90", period: "/mês", annual_saving: null },
    annual: { amount: "€25,00", period: "/ano", annual_saving: "Poupa €9,80/ano" },
  },
  BR: {
    monthly: { amount: "R$ 9,90", period: "/mês", annual_saving: null },
    annual: { amount: "R$ 99,00", period: "/ano", annual_saving: "Poupa R$ 19,80/ano" },
  },
};

const FREE_FEATURES = [
  "Dashboard básico",
  "Registar até 5 apostas evitadas/mês",
  "1 meta financeira ativa",
  "Histórico dos últimos 7 dias",
  "Modo Crise",
  "Recursos de Ajuda",
];

const PREMIUM_FEATURES = [
  "Tudo do plano gratuito",
  "Apostas evitadas ilimitadas",
  "Metas financeiras ilimitadas",
  "Histórico completo",
  "Perfil Financeiro avançado",
  "Relatórios e estatísticas detalhadas",
  "Sem anúncios",
  "Suporte prioritário",
];

export default function Precos() {
  const { user } = useAuth();
  const [country, setCountry] = useState<Country>("PT");
  const [interval, setInterval] = useState<Interval>("monthly");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: subscription } = trpc.subscription.getCurrent.useQuery(undefined, {
    enabled: !!user,
  });

  const createCheckout = trpc.subscription.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, "_blank");
      }
      setIsRedirecting(false);
    },
    onError: () => {
      setIsRedirecting(false);
    },
  });

  const handleUpgrade = () => {
    if (!user) {
      window.location.href = getLoginUrl();
      return;
    }
    setIsRedirecting(true);
    createCheckout.mutate({ country, interval });
  };

  const isPremium = subscription?.plan === "premium";
  const price = PRICES[country][interval];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">← Voltar ao Dashboard</Button>
        </Link>
        {user && (
          <Badge variant={isPremium ? "default" : "secondary"}>
            {isPremium ? "✨ Premium" : "Plano Gratuito"}
          </Badge>
        )}
      </div>

      <div className="container max-w-5xl py-12">
        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Escolha o seu plano</h1>
          <p className="text-muted-foreground text-lg">
            Comece gratuitamente. Faça upgrade quando precisar de mais.
          </p>
        </div>

        {/* Seletor de País */}
        <div className="flex justify-center gap-3 mb-6">
          <span className="text-sm text-muted-foreground self-center">País:</span>
          <Button
            variant={country === "PT" ? "default" : "outline"}
            size="sm"
            onClick={() => setCountry("PT")}
          >
            🇵🇹 Portugal (€)
          </Button>
          <Button
            variant={country === "BR" ? "default" : "outline"}
            size="sm"
            onClick={() => setCountry("BR")}
          >
            🇧🇷 Brasil (R$)
          </Button>
        </div>

        {/* Seletor de Período */}
        <div className="flex justify-center gap-3 mb-10">
          <span className="text-sm text-muted-foreground self-center">Período:</span>
          <Button
            variant={interval === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setInterval("monthly")}
          >
            Mensal
          </Button>
          <Button
            variant={interval === "annual" ? "default" : "outline"}
            size="sm"
            onClick={() => setInterval("annual")}
          >
            Anual
            {interval === "annual" && (
              <Badge variant="secondary" className="ml-2 text-xs">Melhor valor</Badge>
            )}
          </Button>
        </div>

        {/* Cards de Planos */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Plano Gratuito */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Gratuito</CardTitle>
              </div>
              <div className="text-4xl font-bold">€0 / R$ 0</div>
              <CardDescription>Para sempre, sem cartão</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {!user ? (
                <Button variant="outline" className="w-full" asChild>
                  <a href={getLoginUrl()}>Começar Gratuitamente</a>
                </Button>
              ) : !isPremium ? (
                <Button variant="outline" className="w-full" disabled>
                  Plano Atual
                </Button>
              ) : (
                <Button variant="outline" className="w-full" disabled>
                  Plano Base
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Plano Premium */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
              RECOMENDADO
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <CardTitle>Premium</CardTitle>
              </div>
              <div className="text-4xl font-bold">
                {price.amount}
                <span className="text-lg font-normal text-muted-foreground">{price.period}</span>
              </div>
              {price.annual_saving && (
                <Badge variant="secondary" className="w-fit text-green-600">
                  {price.annual_saving}
                </Badge>
              )}
              <CardDescription>Acesso completo a todas as funcionalidades</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PREMIUM_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className={feature === "Tudo do plano gratuito" ? "text-muted-foreground" : ""}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPremium ? (
                <Button className="w-full" disabled variant="secondary">
                  ✨ Plano Atual
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleUpgrade}
                  disabled={isRedirecting || createCheckout.isPending}
                >
                  {isRedirecting || createCheckout.isPending ? (
                    "A redirecionar..."
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      {user ? "Fazer Upgrade" : "Começar Premium"}
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Garantia */}
        <div className="text-center mt-10 text-sm text-muted-foreground">
          <p>💳 Pagamento seguro via Stripe · Cancele quando quiser · Sem compromisso</p>
        </div>

        {/* Comparação de funcionalidades */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Comparação detalhada</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Funcionalidade</th>
                  <th className="text-center py-3 px-4">Gratuito</th>
                  <th className="text-center py-3 px-4 text-primary">Premium</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Dashboard", "✅", "✅"],
                  ["Apostas evitadas", "5/mês", <Infinity className="h-4 w-4 mx-auto text-primary" />],
                  ["Metas financeiras", "1 ativa", <Infinity className="h-4 w-4 mx-auto text-primary" />],
                  ["Histórico", "7 dias", "Completo"],
                  ["Modo Crise", "✅", "✅"],
                  ["Perfil Financeiro", "❌", "✅"],
                  ["Relatórios avançados", "❌", "✅"],
                  ["Sem anúncios", "❌", "✅"],
                  ["Suporte prioritário", "❌", "✅"],
                ].map(([feature, free, premium], i) => (
                  <tr key={i} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm">{feature}</td>
                    <td className="py-3 px-4 text-center text-sm text-muted-foreground">{free}</td>
                    <td className="py-3 px-4 text-center text-sm font-medium">{premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
