import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
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
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
