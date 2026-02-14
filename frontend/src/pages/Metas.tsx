import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, DollarSign, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Metas() {
  const { user, loading: authLoading } = useAuth();
  
  const { data: goals, isLoading } = trpc.goals.list.useQuery(undefined, {
    enabled: !!user,
  });
  
  const { data: totalPreserved } = trpc.avoidedBets.totalPreserved.useQuery(undefined, {
    enabled: !!user,
  });
  
  const utils = trpc.useUtils();
  
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
      toast.success("Meta criada com sucesso!");
      setTitle("");
      setTargetAmount("");
      setImageUrl("");
      setShowAddDialog(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar meta: ${error.message}`);
    },
  });
  
  const updateGoal = trpc.goals.update.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
      toast.success("Meta atualizada!");
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });
  
  const deleteGoal = trpc.goals.delete.useMutation({
    onSuccess: () => {
      utils.goals.list.invalidate();
      toast.success("Meta removida");
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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

  const handleCreateGoal = () => {
    if (!title.trim()) {
      toast.error("O título não pode estar vazio");
      return;
    }
    
    const amountInCents = Math.round(parseFloat(targetAmount) * 100);
    
    if (amountInCents <= 0) {
      toast.error("O valor da meta deve ser maior que zero");
      return;
    }
    
    createGoal.mutate({
      title: title.trim(),
      targetAmount: amountInCents,
      imageUrl: imageUrl.trim() || undefined,
    });
  };

  const handleCompleteGoal = (goalId: number) => {
    if (confirm("Parabéns! Marcar esta meta como concluída?")) {
      updateGoal.mutate({
        id: goalId,
        isCompleted: 1,
      });
    }
  };

  const handleDeleteGoal = (goalId: number) => {
    if (confirm("Tem certeza que deseja remover esta meta?")) {
      deleteGoal.mutate({ id: goalId });
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const activeGoals = goals?.filter(g => g.isCompleted === 0) || [];
  const completedGoals = goals?.filter(g => g.isCompleted === 1) || [];

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
                <p className="text-sm text-muted-foreground">Metas</p>
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

      <main className="container py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Título e Botão */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Suas Metas</h2>
              <p className="text-muted-foreground">
                Transforme cada aposta evitada em progresso rumo aos seus sonhos
              </p>
            </div>
            <Button onClick={() => setShowAddDialog(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Nova Meta
            </Button>
          </div>

          {/* Metas Ativas */}
          {activeGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Metas Ativas</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {activeGoals.map((goal) => {
                  const progress = totalPreserved 
                    ? Math.min((totalPreserved / goal.targetAmount) * 100, 100)
                    : 0;
                  
                  return (
                    <Card key={goal.id} className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{goal.title}</CardTitle>
                            <CardDescription className="mt-2">
                              Meta: {formatCurrency(goal.targetAmount)}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteGoal(goal.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {goal.imageUrl && (
                          <div className="rounded-lg overflow-hidden">
                            <img 
                              src={goal.imageUrl} 
                              alt={goal.title}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-semibold text-primary">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <p className="text-sm text-muted-foreground mt-2">
                            {formatCurrency(totalPreserved || 0)} de {formatCurrency(goal.targetAmount)}
                          </p>
                        </div>
                        
                        {progress >= 100 && (
                          <Button 
                            onClick={() => handleCompleteGoal(goal.id)}
                            className="w-full"
                            variant="default"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Marcar como Concluída
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metas Concluídas */}
          {completedGoals.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Metas Concluídas 🎉</h3>
              <div className="grid gap-6 md:grid-cols-2">
                {completedGoals.map((goal) => (
                  <Card key={goal.id} className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            {goal.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Meta: {formatCurrency(goal.targetAmount)}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {goal.imageUrl && (
                        <div className="rounded-lg overflow-hidden">
                          <img 
                            src={goal.imageUrl} 
                            alt={goal.title}
                            className="w-full h-48 object-cover opacity-75"
                          />
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground mt-4">
                        Concluída em {new Date(goal.completedAt || goal.updatedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Estado Vazio */}
          {activeGoals.length === 0 && completedGoals.length === 0 && (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhuma meta criada ainda
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Crie sua primeira meta e comece a transformar cada aposta evitada em progresso real rumo aos seus sonhos!
                </p>
                <Button onClick={() => setShowAddDialog(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Dialog: Adicionar Meta */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Nova Meta</DialogTitle>
            <DialogDescription>
              Escolha algo que você realmente deseja e veja seu progresso crescer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Meta</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Nova TV 4K, Viagem para a praia..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAmount">Valor da Meta (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0,00"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Cole o link de uma imagem que represente sua meta
              </p>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCreateGoal} className="flex-1" disabled={createGoal.isPending}>
                {createGoal.isPending ? "Criando..." : "Criar Meta"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
