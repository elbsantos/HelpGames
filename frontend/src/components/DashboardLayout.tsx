import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { LayoutDashboard, LogOut, PanelLeft, Star, TrendingUp, Target, AlertTriangle, History, Globe, BookOpen, HelpCircle, Shield, BarChart3, DollarSign, Settings } from "lucide-react";
import { Badge } from "./ui/badge";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

function PlanBadge() {
  const { data } = trpc.subscription.getCurrent.useQuery();
  if (!data || data.plan === 'free') return null;
  return (
    <Badge variant="default" className="hidden sm:flex gap-1 text-xs bg-yellow-500 text-black hover:bg-yellow-400">
      <Star className="h-3 w-3" />
      Premium
    </Badge>
  );
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: TrendingUp, label: "Perfil Financeiro", path: "/perfil-financeiro" },
  { icon: Target, label: "Metas", path: "/metas" },
  { icon: AlertTriangle, label: "Registar Aposta Evitada", path: "/registrar-aposta" },
  { icon: Shield, label: "Extensão de Bloqueio", path: "/extensao-bloqueio" },
  { icon: History, label: "Histórico de Bloqueios", path: "/historico-bloqueios" },
  { icon: Globe, label: "Sites de Apostas", path: "/sites-apostas" },
  { icon: AlertTriangle, label: "Modo Crise", path: "/modo-crise" },
  { icon: BookOpen, label: "Quiz de Autoavaliação", path: "/quiz-autoavaliacao" },
  { icon: HelpCircle, label: "Recursos de Ajuda", path: "/recursos-ajuda" },
  { icon: BarChart3, label: "Relatório Mensal", path: "/relatorio-mensal" },
  { icon: DollarSign, label: "Planos e Preços", path: "/precos" },
  { icon: Settings, label: "Configurações da Conta", path: "/configuracoes-conta" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user, logout } = useAuth();
  const [location] = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState<typeof menuItems[0] | null>(null);

  useEffect(() => {
    const active = menuItems.find((item) => item.path === location);
    setActiveMenuItem(active || null);
  }, [location]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4">Você precisa estar logado para acessar esta página.</p>
          <a href={getLoginUrl()}>
            <Button>Fazer Login</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
              <PanelLeft className="h-4 w-4" />
            </div>
            <span className="font-semibold truncate">HelpGames</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild isActive={activeMenuItem?.path === item.path}>
                  <a href={item.path}>
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user?.name}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-56 z-50">
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair da Conta</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Header fixo com hamburger sempre visível */}
        <header className="flex border-b h-14 items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-2 min-w-0">
            {/* SidebarTrigger sempre visível — abre o Sheet no mobile, colapsa no desktop */}
            <SidebarTrigger className="h-9 w-9 rounded-lg flex-shrink-0" />
            <span className="tracking-tight text-foreground text-sm font-semibold truncate">
              {activeMenuItem?.label ?? "Dashboard"}
            </span>
          </div>

          {/* User menu no header */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <PlanBadge />
            <a href="/precos" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Star className="h-3 w-3" />
                Planos
              </Button>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm truncate max-w-[120px]">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[100]">
                <DropdownMenuItem disabled>
                  <span className="text-xs text-gray-500 truncate">{user?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/precos" className="cursor-pointer">
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Ver Planos</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/configuracoes-conta" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações da Conta</span>
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
          </div>
        </header>
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
