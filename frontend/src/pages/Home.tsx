import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowRight, Heart, Shield, Target, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se usuário está logado, redirecionar para dashboard
  if (user) {
    window.location.href = "/dashboard";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">HelpGames</span>
          </div>
          <Button asChild>
            <a href={getLoginUrl()}>Entrar</a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Heart className="h-4 w-4" />
            <span>Sua jornada de recuperação começa aqui</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Liberte-se das apostas online com{" "}
            <span className="text-primary">consciência</span> e{" "}
            <span className="text-primary">apoio</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Uma ferramenta elegante e confiável que transforma cada aposta evitada em progresso real 
            rumo aos seus sonhos e objetivos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <a href={getLoginUrl()}>
                Começar agora <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="#como-funciona">Como funciona</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="como-funciona" className="container py-20 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como o HelpGames ajuda você
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Combinamos conscientização financeira, metas tangíveis e suporte emocional 
              para criar uma jornada de recuperação sustentável.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Consciência Financeira</CardTitle>
                <CardDescription>
                  Visualize o impacto real de cada aposta no seu orçamento mensal e verba de lazer
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Metas Tangíveis</CardTitle>
                <CardDescription>
                  Transforme cada aposta evitada em progresso rumo aos seus sonhos e objetivos reais
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Modo Crise</CardTitle>
                <CardDescription>
                  Suporte imediato em momentos de vulnerabilidade com mensagens personalizadas e exercícios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-2/80 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Choque de Realidade</CardTitle>
                <CardDescription>
                  Alertas contextualizados que mostram o verdadeiro custo emocional e financeiro das apostas
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/80 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Estatísticas Motivadoras</CardTitle>
                <CardDescription>
                  Acompanhe sua evolução com gráficos e dados que celebram cada vitória
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-4/80 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Privacidade Total</CardTitle>
                <CardDescription>
                  Seus dados são protegidos com criptografia e total anonimato por design
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Pronto para começar sua jornada de recuperação?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que estão retomando o controle de suas vidas 
            e construindo um futuro mais saudável e próspero.
          </p>
          <Button size="lg" asChild className="text-lg px-8">
            <a href={getLoginUrl()}>
              Começar gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t">
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2026 HelpGames. Todos os direitos reservados.</p>
          <p className="mt-2">Uma ferramenta de apoio para combater o vício em apostas online.</p>
        </div>
      </footer>
    </div>
  );
}
