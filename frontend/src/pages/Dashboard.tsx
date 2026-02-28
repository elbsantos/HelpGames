import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Calendar, DollarSign, Lock, LogOut, Star, Target, TrendingUp, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { TemporalEvolutionChart } from "@/components/TemporalEvolutionChart";
import { usePushNotification } from "@/hooks/usePushNotification";


export default function Dashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const { sendNotification } = usePushNotification();
  const [blockageTimer, setBlockageTimer] = useState<number>(0);
  
  const { data: stats, isLoading: statsLoading } = trpc.statistics.get.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: goals, isLoading: goalsLoading } = trpc.goals.list.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: totalPreserved } = trpc.avoidedBets.totalPreserved.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: blockageStatus } = trpc.betsBlockage.getStatus.useQuery(undefined, {
    enabled: !!user,
    refetchInterval: 1000, // Atualizar a cada segundo
  });
  
  const { data: temporalData, isLoading: temporalLoading } = trpc.statistics.temporalEvolution.useQuery(undefined, {
    enabled: !!user,
  });
  
  const activateBlockage = trpc.betsBlockage.activate.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setBlockageTimer(30 * 60); // 30 minutos em segundos
      
      // Enviar notificação push
      sendNotification({
        title: "🔐 Bloqueio Ativado!",
        body: "Seus acessos a sites de apostas foram bloqueados por 30 minutos. Você consegue resistir!",
        tag: "blockage-active",
        requireInteraction: false,
      });
    },
    onError: (error) => {
      toast.error(`Erro ao ativar bloqueio: ${error.message}`);
    },
  });
  
  // Timer para atualizar o contador
  useEffect(() => {
    if (blockageStatus?.remainingSeconds) {
      setBlockageTimer(blockageStatus.remainingSeconds);
    }
  }, [blockageStatus?.remainingSeconds]);
  
  useEffect(() => {
    if (blockageTimer <= 0) return;
    
    const interval = setInterval(() => {
      setBlockageTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [blockageTimer]);

  if (authLoading || statsLoading || goalsLoading) {
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

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeGoal = goals?.find(g => g.isCompleted === 0);
  const goalProgress = activeGoal && totalPreserved 
    ? Math.min((totalPreserved / activeGoal.targetAmount) * 100, 100)
    : 0;

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
                <p className="text-sm text-muted-foreground">Olá, {user.name || 'Usuário'}!</p>
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
              <Button 
                onClick={() => activateBlockage.mutate()}
                disabled={blockageStatus?.isBlocked || activateBlockage.isPending}
                variant="destructive"
                className="gap-2"
              >
                <Lock className="h-4 w-4" />
                {blockageStatus?.isBlocked ? `Bloqueado ${blockageStatus.remainingMinutes}min` : 'Bloquear Bets'}
              </Button>
              <Link href="/modo-crise">
                <Button variant="destructive">Modo Crise</Button>
              </Link>
              <Link href="/precos">
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <Star className="h-3 w-3" />
                  Planos
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[100]">
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-muted-foreground">{user?.email || user?.name}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/precos" className="cursor-pointer">
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Ver Planos</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair da Conta</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dinheiro Preservado</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(totalPreserved || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total economizado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dias sem Apostar</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.daysWithoutBetting || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Continue assim! 🎉
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Apostas Evitadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalBetsAvoided || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Vitórias conquistadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meta Ativa</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{goalProgress.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeGoal ? activeGoal.title : 'Nenhuma meta ativa'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meta Ativa */}
        {activeGoal && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Meta Ativa: {activeGoal.title}
              </CardTitle>
              <CardDescription>
                Você está {goalProgress.toFixed(0)}% mais perto do seu objetivo!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">
                    {formatCurrency(totalPreserved || 0)} / {formatCurrency(activeGoal.targetAmount)}
                  </span>
                </div>
                <Progress value={goalProgress} className="h-3" />
              </div>
              
              {activeGoal.imageUrl && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={activeGoal.imageUrl} 
                    alt={activeGoal.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/registrar-aposta">Registrar Aposta Evitada</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/metas">Ver Todas as Metas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}



        {/* Ações Rápidas */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <Link href="/registrar-aposta">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Registrar Aposta Evitada
                </CardTitle>
                <CardDescription>
                  Celebre mais uma vitória sobre o impulso de apostar
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-blue/50 transition-colors cursor-pointer border-blue/20">
            <Link href="/historico-bloqueios">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Histórico de Bloqueios
                </CardTitle>
                <CardDescription>
                  Veja seus períodos de proteção
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-destructive/50 transition-colors cursor-pointer border-destructive/20">
            <Link href="/modo-crise">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Modo Crise
                </CardTitle>
                <CardDescription>
                  Precisa de apoio imediato? Clique aqui
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-purple/50 transition-colors cursor-pointer border-purple/20">
            <Link href="/sites-apostas">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                  Saiba Mais sobre Apostas
                </CardTitle>
                <CardDescription>
                  Entenda os riscos e categorias de sites
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-indigo/50 transition-colors cursor-pointer border-indigo/20">
            <Link href="/quiz-autoavaliacao">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-indigo-600" />
                  Quiz de Autoavaliação
                </CardTitle>
                <CardDescription>
                  Avalie seu risco de comportamento de apostas
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-pink/50 transition-colors cursor-pointer border-pink/20">
            <Link href="/recursos-ajuda">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Recursos de Ajuda
                </CardTitle>
                <CardDescription>
                  Encontre organizações e ferramentas de suporte
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:border-amber/50 transition-colors cursor-pointer border-amber/20">
            <Link href="/relatorio-mensal">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                  Relatorio Mensal
                </CardTitle>
                <CardDescription>
                  Acompanhe seu progresso e estatisticas
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Gráfico de Evolução Temporal */}
        {stats && stats.totalBetsAvoided > 0 && (
          <TemporalEvolutionChart data={temporalData || []} isLoading={temporalLoading} />
        )}

        {/* Primeira vez? */}
        {!stats || stats.totalBetsAvoided === 0 ? (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Bem-vindo ao HelpGames! 🎉</CardTitle>
              <CardDescription className="text-base">
                Comece sua jornada de recuperação seguindo estes passos:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Configure seu perfil financeiro</p>
                  <p className="text-sm text-muted-foreground">
                    Informe sua renda e despesas para calcular sua verba de lazer segura
                  </p>
                  <Button variant="link" asChild className="px-0">
                    <Link href="/perfil-financeiro">Configurar agora →</Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Crie sua primeira meta</p>
                  <p className="text-sm text-muted-foreground">
                    Escolha algo que você realmente deseja e veja seu progresso crescer
                  </p>
                  <Button variant="link" asChild className="px-0">
                    <Link href="/metas">Criar meta →</Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Registre sua primeira vitória</p>
                  <p className="text-sm text-muted-foreground">
                    Sempre que evitar uma aposta, registre aqui e celebre!
                  </p>
                  <Button variant="link" asChild className="px-0">
                    <Link href="/registrar-aposta">Registrar →</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
