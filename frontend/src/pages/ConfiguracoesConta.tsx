import { useState } from "react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { AlertTriangle, CreditCard, Trash2, LogOut, Crown, User } from "lucide-react";

export default function ConfiguracoesConta() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const utils = trpc.useUtils();

  const cancelSubscription = trpc.account.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Assinatura cancelada. Voltou para o plano gratuito.");
      setShowCancelDialog(false);
      utils.auth.me.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao cancelar assinatura.");
      setShowCancelDialog(false);
    },
  });

  const deleteAccount = trpc.account.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Conta excluída com sucesso.");
      setShowDeleteDialog(false);
      // Fazer logout e redirecionar para a landing page
      await logout();
      setLocation("/");
    },
    onError: (err) => {
      toast.error(err.message || "Erro ao excluir conta.");
      setShowDeleteDialog(false);
    },
  });

  const isPremium = (user as any)?.plan === "premium";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações da Conta</h1>
          <p className="text-muted-foreground mt-1">Gerencie a sua conta e assinatura.</p>
        </div>

        {/* Informações da conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Nome</span>
              <span className="text-sm font-medium">{user?.name || "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email || "—"}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plano actual</span>
              {isPremium ? (
                <Badge className="bg-emerald-500 text-white flex items-center gap-1">
                  <Crown className="w-3 h-3" /> Premium
                </Badge>
              ) : (
                <Badge variant="secondary">Gratuito</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gestão da assinatura */}
        {isPremium && (
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Assinatura Premium
              </CardTitle>
              <CardDescription>
                Gerencie a sua assinatura Premium. Ao cancelar, mantém o acesso até ao fim do período pago e depois volta automaticamente para o plano gratuito.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                onClick={() => setShowCancelDialog(true)}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Cancelar assinatura Premium
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Zona de perigo */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>
              Acções irreversíveis. Tenha cuidado ao prosseguir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Excluir conta</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Remove permanentemente a sua conta e todos os dados associados (metas, apostas evitadas, perfil financeiro, histórico). Esta acção não pode ser desfeita.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="shrink-0"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Botão de logout */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Terminar sessão</p>
                <p className="text-sm text-muted-foreground">Sair da conta neste dispositivo.</p>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Terminar sessão
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo: Cancelar assinatura */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              Cancelar assinatura Premium?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Ao cancelar, continuará a ter acesso Premium até ao fim do período já pago. Depois, a sua conta voltará automaticamente para o plano gratuito e perderá acesso às funcionalidades exclusivas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Manter Premium
            </Button>
            <Button
              variant="default"
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => cancelSubscription.mutate()}
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending ? "A cancelar..." : "Sim, cancelar assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo: Excluir conta */}
      <Dialog open={showDeleteDialog} onOpenChange={(open) => { setShowDeleteDialog(open); if (!open) setDeleteConfirmText(""); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Excluir conta permanentemente?
            </DialogTitle>
            <DialogDescription className="pt-2">
              Esta acção é <strong>irreversível</strong>. Todos os seus dados serão apagados permanentemente: metas, apostas evitadas, perfil financeiro, histórico de bloqueios e assinatura.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-2">
              Para confirmar, escreva <strong>EXCLUIR</strong> abaixo:
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="EXCLUIR"
              className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(""); }}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteAccount.mutate()}
              disabled={deleteConfirmText !== "EXCLUIR" || deleteAccount.isPending}
            >
              {deleteAccount.isPending ? "A excluir..." : "Excluir conta definitivamente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
