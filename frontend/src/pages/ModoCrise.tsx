import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Heart, MessageSquare, Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import BreathingExercise from "@/components/BreathingExercise";

export default function ModoCrise() {
  const { user, loading: authLoading } = useAuth();
  
  const { data: messages, isLoading } = trpc.crisisMessages.list.useQuery(undefined, {
    enabled: !!user,
  });
  
  const utils = trpc.useUtils();
  
  const createMessage = trpc.crisisMessages.create.useMutation({
    onSuccess: () => {
      utils.crisisMessages.list.invalidate();
      toast.success("Mensagem criada com sucesso!");
      setNewMessage("");
      setShowAddDialog(false);
    },
    onError: (error) => {
      toast.error(`Erro ao criar mensagem: ${error.message}`);
    },
  });
  
  const deleteMessage = trpc.crisisMessages.delete.useMutation({
    onSuccess: () => {
      utils.crisisMessages.list.invalidate();
      toast.success("Mensagem removida");
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const [showCrisisMode, setShowCrisisMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showBreathing, setShowBreathing] = useState(false);

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

  const handleCreateMessage = () => {
    if (!newMessage.trim()) {
      toast.error("A mensagem não pode estar vazia");
      return;
    }
    
    createMessage.mutate({ message: newMessage.trim() });
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta mensagem?")) {
      deleteMessage.mutate({ id });
    }
  };

  const activateCrisisMode = () => {
    setShowCrisisMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HelpGames</h1>
                <p className="text-sm text-muted-foreground">Modo Crise</p>
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
          {/* Botão de Emergência */}
          <Card className="border-2 border-destructive/50 bg-gradient-to-br from-destructive/10 to-destructive/5">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-destructive" />
                Precisa de Apoio Imediato?
              </CardTitle>
              <CardDescription className="text-base">
                Se você está sentindo um forte impulso de apostar, clique no botão abaixo para ativar o Modo Crise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={activateCrisisMode} 
                size="lg" 
                variant="destructive" 
                className="w-full text-lg py-6"
              >
                <AlertCircle className="mr-2 h-6 w-6" />
                Ativar Modo Crise
              </Button>
            </CardContent>
          </Card>

          {/* Mensagens Personalizadas */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Suas Mensagens de Apoio
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Escreva mensagens para você mesmo em momentos de clareza. Elas serão exibidas quando você ativar o Modo Crise.
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {messages && messages.length > 0 ? (
                messages.map((msg) => (
                  <Card key={msg.id} className="bg-secondary/30">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-foreground flex-1">{msg.message}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Você ainda não criou nenhuma mensagem de apoio.</p>
                  <p className="text-sm mt-2">Clique em "Adicionar" para criar sua primeira mensagem.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dicas */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Dicas para Mensagens Eficazes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <p className="text-sm">
                  <strong>Seja específico:</strong> Mencione razões concretas pelas quais você quer parar de apostar
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <p className="text-sm">
                  <strong>Mencione pessoas queridas:</strong> Lembre-se de quem você ama e que se importa com você
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <p className="text-sm">
                  <strong>Foque no futuro:</strong> Descreva a vida que você quer ter sem as apostas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog: Adicionar Mensagem */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Mensagem de Apoio</DialogTitle>
            <DialogDescription>
              Escreva uma mensagem para você mesmo que será exibida em momentos de crise.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="newMessage">Sua Mensagem</Label>
              <Textarea
                id="newMessage"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ex: Lembre-se do quanto você ama sua família. Eles precisam de você presente e saudável, não perdido nas apostas."
                rows={6}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleCreateMessage} className="flex-1" disabled={createMessage.isPending}>
                {createMessage.isPending ? "Salvando..." : "Salvar Mensagem"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Modo Crise Ativado */}
      <Dialog open={showCrisisMode} onOpenChange={setShowCrisisMode}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 text-destructive">
              <AlertCircle className="h-6 w-6" />
              Modo Crise Ativado
            </DialogTitle>
            <DialogDescription className="text-base">
              Respire fundo. Você está no controle. Vamos passar por isso juntos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Mensagens Personalizadas */}
            {messages && messages.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Suas Mensagens de Apoio:</h3>
                {messages.map((msg) => (
                  <Card key={msg.id} className="border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="pt-4">
                      <p className="text-foreground text-lg">{msg.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Exercício de Respiração */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Exercício de Respiração:</h3>
              {!showBreathing ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      Faça um exercício de respiração para recuperar o controle emocional
                    </p>
                    <Button onClick={() => setShowBreathing(true)} size="lg">
                      Iniciar Exercício de Respiração
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <BreathingExercise onComplete={() => {
                  toast.success("Exercício concluído! Como você está se sentindo agora?");
                }} />
              )}
            </div>

            {/* Ações Alternativas */}
            <Card className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-lg">O que você pode fazer agora:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard">
                    <Target className="mr-2 h-4 w-4" />
                    Ver suas metas e progresso
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/registrar-aposta">
                    <Heart className="mr-2 h-4 w-4" />
                    Registrar esta vitória (você resistiu!)
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={() => setShowCrisisMode(false)} className="flex-1">
                Estou Melhor Agora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
