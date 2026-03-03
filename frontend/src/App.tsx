import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import PerfilFinanceiro from "./pages/PerfilFinanceiro";
import RegistrarAposta from "./pages/RegistrarAposta";
import RegistrarTentativaAposta from "./pages/RegistrarTentativaAposta";
import Metas from "./pages/Metas";
import ModoCrise from "./pages/ModoCrise";
import HistoricoBloqueios from "./pages/HistoricoBloqueios";
import SitesApostas from "./pages/SitesApostas";
import QuizAutoavaliacao from "./pages/QuizAutoavaliacao";
import RecursosAjuda from "./pages/RecursosAjuda";
import BloqueadoresSites from "./pages/BloqueadoresSites";
import ExtensaoBloqueio from "./pages/ExtensaoBloqueio";
import RelatorioMensal from "./pages/RelatorioMensal";
import Precos from "./pages/Precos";
import LandingPageSimple from "./pages/LandingPageSimple";

function Router() {
  return (
    <Switch>
      {/* Landing page é a rota raiz — visitantes não logados vêem CTA de registo */}
      <Route path={"/"} component={LandingPageSimple} />
      <Route path={"/landing-simple"} component={LandingPageSimple} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/perfil-financeiro"} component={PerfilFinanceiro} />
      <Route path={"/registrar-aposta"} component={RegistrarAposta} />
      <Route path={"/registrar-tentativa-aposta"} component={RegistrarTentativaAposta} />
      <Route path={"/metas"} component={Metas} />
      <Route path={"/modo-crise"} component={ModoCrise} />
      <Route path={"/historico-bloqueios"} component={HistoricoBloqueios} />
      <Route path={"/sites-apostas"} component={SitesApostas} />
      <Route path={"/quiz-autoavaliacao"} component={QuizAutoavaliacao} />
      <Route path={"/recursos-ajuda"} component={RecursosAjuda} />
      <Route path={"/bloqueadores-sites"} component={BloqueadoresSites} />
      <Route path={"/extensao-bloqueio"} component={ExtensaoBloqueio} />
      <Route path={"/relatorio-mensal"} component={RelatorioMensal} />
      <Route path={"/precos"} component={Precos} />
      <Route path={"/subscription/success"} component={() => {
        return <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]"><div className="text-center"><h1 className="text-3xl font-bold text-emerald-500 mb-4">✅ Pagamento Confirmado!</h1><p className="text-white/50 mb-6">O seu plano Premium foi ativado com sucesso.</p><a href="/dashboard" className="underline text-emerald-400">Ir para o Dashboard</a></div></div>;
      }} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
