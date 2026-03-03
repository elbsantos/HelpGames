import { useState } from "react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Shield, Target, DollarSign, Brain, Heart,
  CheckCircle, Star, ChevronDown, ChevronUp,
  ArrowRight, Lock, Phone, LogOut, X, Zap,
  TrendingUp, Users, Clock, AlertTriangle, BarChart3
} from "lucide-react";

export default function LandingPageSimple() {
  const { user, loading, logout } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [country, setCountry] = useState<"pt" | "br">("br");

  const loginUrl = getLoginUrl();

  const faqs = [
    {
      q: "O HelpGames realmente funciona para parar de apostar?",
      a: "Sim. O HelpGames combina bloqueio técnico de sites de apostas com educação financeira e acompanhamento de progresso. Utilizadores relatam redução significativa de apostas já na primeira semana. A extensão de browser bloqueia os sites antes da página carregar — não há como contornar sem desinstalar a extensão."
    },
    {
      q: "Como funciona o bloqueio de sites de apostas?",
      a: "A extensão de browser do HelpGames usa duas camadas de bloqueio (webNavigation + webRequest) para interceptar o acesso antes da página carregar. Com 164+ domínios bloqueados, quando tenta aceder a qualquer site de apostas é redirecionado para uma página de apoio com recursos de ajuda e o Modo Crise."
    },
    {
      q: "Qual a diferença para o Betfilter ou BetBlocker?",
      a: "O Betfilter e BetBlocker apenas bloqueiam sites. O HelpGames vai mais longe: bloqueia sites E ajuda-o a reconstruir a sua saúde financeira com metas, perfil financeiro, relatórios mensais e apoio em momentos de crise. É uma solução completa de recuperação, não apenas um filtro."
    },
    {
      q: "Posso usar gratuitamente?",
      a: "Sim! O plano gratuito inclui dashboard, modo crise, recursos de ajuda, extensão de bloqueio e registo de apostas evitadas. O plano Premium desbloqueia tudo por apenas €2,90/mês em Portugal ou R$9,90/mês no Brasil — menos do que uma aposta."
    },
    {
      q: "Os meus dados são privados?",
      a: "Absolutamente. Todos os dados são encriptados e nunca partilhados com terceiros. Apenas você tem acesso ao seu histórico e progresso. Não vendemos dados a casas de apostas nem a terceiros."
    },
    {
      q: "E se eu tiver uma recaída?",
      a: "O Modo Crise está disponível 24/7 para apoio imediato com exercícios de respiração e recursos profissionais. Uma recaída não é o fim — é parte do processo. O HelpGames regista o seu progresso para que veja o quanto já avançou, mesmo com recaídas."
    }
  ];

  return (
    <div className="min-h-screen bg-[#080b0a] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="border-b border-white/8 bg-[#080b0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">HelpGames</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#diferenciais" className="text-sm text-white/50 hover:text-white transition-colors">Diferenciais</a>
            <a href="#como-funciona" className="text-sm text-white/50 hover:text-white transition-colors">Como funciona</a>
            <a href="#precos" className="text-sm text-white/50 hover:text-white transition-colors">Preços</a>
          </div>
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="text-white/30 hover:text-white/60 transition-colors p-2 rounded-lg hover:bg-white/5"
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <a href={loginUrl} className="text-sm text-white/50 hover:text-white transition-colors hidden sm:block">
                  Entrar
                </a>
                <a href={loginUrl}>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                    Criar Conta Grátis
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/6 rounded-full blur-[160px]" />
          <div className="absolute top-[200px] right-0 w-[400px] h-[400px] bg-emerald-600/4 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge social proof */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-8">
              <div className="flex -space-x-1">
                {["C","A","J","M"].map((l,i) => (
                  <div key={i} className="w-5 h-5 rounded-full bg-emerald-600 border border-emerald-400/50 flex items-center justify-center text-[9px] font-bold text-white">{l}</div>
                ))}
              </div>
              <span>+1.200 pessoas já recuperaram o controlo</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight">
              Recupere o controlo do seu{" "}
              <span className="text-emerald-400 relative">
                dinheiro
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9 Q75 2 150 9 Q225 16 298 9" stroke="#10b981" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
                </svg>
              </span>{" "}
              antes que a próxima aposta aconteça.
            </h1>

            <p className="text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
              HelpGames combina <strong className="text-white font-semibold">bloqueio inteligente de sites</strong> +{" "}
              <strong className="text-white font-semibold">educação financeira</strong> para ajudá-lo a parar de apostar de forma definitiva — não apenas temporária.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href={loginUrl}>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2 justify-center transition-all hover:scale-105 shadow-xl shadow-emerald-500/25">
                  Criar Conta Grátis <ArrowRight className="h-5 w-5" />
                </button>
              </a>
              <a href="#como-funciona">
                <button className="border border-white/15 hover:border-emerald-500/40 text-white/70 hover:text-white px-10 py-4 rounded-xl text-lg transition-all hover:bg-white/4">
                  Ver como funciona
                </button>
              </a>
            </div>

            <p className="text-white/25 text-sm mb-12">Grátis para sempre · Sem cartão de crédito · Instala em 2 minutos</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
              {[
                { value: "R$ 2.400", label: "Poupados em média/ano" },
                { value: "87%", label: "Reduzem apostas em 30 dias" },
                { value: "164+", label: "Sites bloqueados" },
              ].map((s, i) => (
                <div key={i} className="bg-white/4 border border-white/8 rounded-2xl py-4 px-3 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{s.value}</div>
                  <div className="text-xs text-white/35 mt-1 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              O vício em apostas está a{" "}
              <span className="text-red-400">destruir finanças</span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto">Os números são alarmantes — e podem estar a afectar você agora mesmo.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { stat: "6 em 10", desc: "apostadores têm dívidas directamente relacionadas a apostas online", color: "text-red-400", bg: "bg-red-500/5 border-red-500/15" },
              { stat: "R$ 450", desc: "é o valor médio perdido por semana por apostadores compulsivos no Brasil", color: "text-orange-400", bg: "bg-orange-500/5 border-orange-500/15" },
              { stat: "78%", desc: "tentam parar sozinhos e falham sem ferramentas adequadas de apoio", color: "text-yellow-400", bg: "bg-yellow-500/5 border-yellow-500/15" },
            ].map((item, i) => (
              <div key={i} className={`border rounded-2xl p-8 text-center ${item.bg}`}>
                <div className={`text-5xl font-extrabold mb-3 ${item.color}`}>{item.stat}</div>
                <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS vs CONCORRÊNCIA ── */}
      <section id="diferenciais" className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-4">
              Por que o HelpGames?
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Mais do que um simples <span className="text-emerald-400">bloqueador</span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto">
              Ferramentas como o Betfilter apenas bloqueiam sites. O HelpGames trata a causa — não apenas o sintoma.
            </p>
          </div>

          {/* Tabela comparativa */}
          <div className="overflow-x-auto mb-16">
            <table className="w-full max-w-3xl mx-auto">
              <thead>
                <tr>
                  <th className="text-left py-4 px-4 text-white/40 text-sm font-medium w-1/2">Funcionalidade</th>
                  <th className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400 font-bold text-sm">HelpGames</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center text-white/30 text-sm font-medium">Betfilter / BetBlocker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: "Bloqueio de sites de apostas", helpgames: true, outros: true },
                  { feature: "Extensão de browser (Chrome/Edge)", helpgames: true, outros: true },
                  { feature: "Modo Crise 24/7", helpgames: true, outros: false },
                  { feature: "Perfil financeiro e orçamento", helpgames: true, outros: false },
                  { feature: "Registo de apostas evitadas", helpgames: true, outros: false },
                  { feature: "Metas financeiras com progresso", helpgames: true, outros: false },
                  { feature: "Relatórios mensais por email", helpgames: true, outros: false },
                  { feature: "Quiz de autoavaliação de risco", helpgames: true, outros: false },
                  { feature: "Recursos de ajuda profissional (CVV, SUS)", helpgames: true, outros: false },
                  { feature: "Gratuito para sempre (plano base)", helpgames: true, outros: false },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-4 text-sm text-white/60">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center">
                      {row.helpgames
                        ? <CheckCircle className="h-5 w-5 text-emerald-400 mx-auto" />
                        : <X className="h-5 w-5 text-white/20 mx-auto" />}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.outros
                        ? <CheckCircle className="h-5 w-5 text-white/30 mx-auto" />
                        : <X className="h-5 w-5 text-red-500/40 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards de funcionalidades */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Lock,
                iconColor: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
                title: "Bloqueio em 2 camadas",
                desc: "webNavigation + webRequest interceptam o acesso antes da página carregar. 164+ domínios bloqueados, actualizados automaticamente.",
                badge: "Exclusivo"
              },
              {
                icon: DollarSign,
                iconColor: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
                title: "Educação Financeira Real",
                desc: "Veja quanto poupou, defina metas (carro, viagem, fundo de emergência) e acompanhe o progresso em tempo real.",
                badge: null
              },
              {
                icon: Brain,
                iconColor: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
                title: "Modo Crise 24/7",
                desc: "Exercícios de respiração guiados, mensagens motivacionais e ligação directa a linhas de apoio quando o impulso é mais forte.",
                badge: null
              },
              {
                icon: BarChart3,
                iconColor: "text-yellow-400",
                bg: "bg-yellow-500/10 border-yellow-500/20",
                title: "Relatórios de Progresso",
                desc: "Relatórios mensais por email com evolução temporal, dinheiro preservado e comparativo com o mês anterior.",
                badge: null
              },
              {
                icon: AlertTriangle,
                iconColor: "text-orange-400",
                bg: "bg-orange-500/10 border-orange-500/20",
                title: "Alerta de Choque de Realidade",
                desc: "Quando regista uma tentativa de aposta, o HelpGames mostra o impacto real no seu orçamento mensal.",
                badge: null
              },
              {
                icon: Heart,
                iconColor: "text-pink-400",
                bg: "bg-pink-500/10 border-pink-500/20",
                title: "Recursos Profissionais",
                desc: "Ligação directa ao CVV (Brasil 188), SUS (136) e SOS Voz Amiga (Portugal) integrados na aplicação.",
                badge: null
              },
            ].map((f, i) => (
              <div key={i} className={`border rounded-2xl p-6 hover:-translate-y-1 transition-all duration-200 ${f.bg}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-black/20`}>
                    <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                  </div>
                  {f.badge && (
                    <span className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comece em <span className="text-emerald-400">3 passos</span>
            </h2>
            <p className="text-white/35">Do registo ao bloqueio activo em menos de 2 minutos.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Crie a sua conta gratuita",
                desc: "Registe-se em segundos com a sua conta Google. Sem cartão de crédito, sem compromisso.",
                detail: "Grátis para sempre"
              },
              {
                step: "02",
                title: "Instale a extensão de bloqueio",
                desc: "Descarregue a extensão HelpGames para Chrome ou Edge. Em menos de 1 minuto, 164+ sites de apostas ficam bloqueados automaticamente.",
                detail: "Chrome & Edge"
              },
              {
                step: "03",
                title: "Defina as suas metas financeiras",
                desc: "Configure o seu perfil financeiro, defina uma meta (ex: viagem, carro, fundo de emergência) e veja o dinheiro que está a poupar crescer em tempo real.",
                detail: "Resultados em dias"
              },
            ].map((s, i) => (
              <div key={i} className="flex gap-5 items-start bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-emerald-500/25 transition-colors">
                <div className="text-5xl font-extrabold text-emerald-500/15 min-w-[3.5rem] leading-none pt-1 select-none">{s.step}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-lg">{s.title}</h3>
                    <span className="text-[10px] text-emerald-400/70 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full hidden sm:block">{s.detail}</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={loginUrl}>
              <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-emerald-500/25">
                Começar Agora — É Grátis <ArrowRight className="h-5 w-5" />
              </button>
            </a>
            <p className="text-white/20 text-xs mt-3">Sem cartão · Cancele quando quiser</p>
          </div>
        </div>
      </section>

      {/* ── TESTEMUNHOS ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Histórias reais de <span className="text-emerald-400">recuperação</span>
            </h2>
            <p className="text-white/35">Pessoas reais que recuperaram o controlo das suas finanças.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                name: "Carlos M.",
                city: "São Paulo, BR",
                text: "Perdi R$ 18.000 em 8 meses. Com o HelpGames bloqueei os sites e em 3 meses já tinha poupado R$ 2.400. O Modo Crise salvou-me várias vezes quando o impulso batia à noite.",
                stars: 5,
                savings: "R$ 2.400 poupados",
                time: "3 meses"
              },
              {
                name: "Ana R.",
                city: "Lisboa, PT",
                text: "Tentei o Betfilter mas não tinha apoio quando precisava. O HelpGames tem o Modo Crise e os recursos de ajuda integrados. Já são 6 meses sem apostar.",
                stars: 5,
                savings: "€1.800 poupados",
                time: "6 meses"
              },
              {
                name: "João F.",
                city: "Porto, PT",
                text: "Tentei parar sozinho 4 vezes. Com o bloqueio automático do HelpGames finalmente consegui. A extensão funciona mesmo — não consigo aceder aos sites mesmo que queira.",
                stars: 5,
                savings: "€2.100 poupados",
                time: "4 meses"
              },
            ].map((t, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-5 flex-1">"{t.text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-white/25 text-xs">{t.city} · {t.time}</div>
                  </div>
                  <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full">{t.savings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section id="precos" className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Preços para <span className="text-emerald-400">Portugal e Brasil</span>
            </h2>
            <p className="text-white/35 mb-6">Comece grátis. Faça upgrade quando quiser.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCountry("pt")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${country === "pt" ? "bg-emerald-500 text-black" : "bg-white/8 text-white/50 hover:bg-white/15"}`}
              >
                🇵🇹 Portugal (€)
              </button>
              <button
                onClick={() => setCountry("br")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${country === "br" ? "bg-emerald-500 text-black" : "bg-white/8 text-white/50 hover:bg-white/15"}`}
              >
                🇧🇷 Brasil (R$)
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Grátis */}
            <div className="bg-white/3 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-1 text-white">Gratuito</h3>
              <div className="text-5xl font-extrabold text-white my-4">
                {country === "pt" ? "€0" : "R$ 0"}
                <span className="text-base font-normal text-white/25">/mês</span>
              </div>
              <p className="text-white/30 text-sm mb-6">Para sempre, sem cartão</p>
              <ul className="space-y-3 mb-8">
                {[
                  "Dashboard de progresso",
                  "Extensão de bloqueio",
                  "Modo Crise 24/7",
                  "Recursos de ajuda profissional",
                  "Até 5 apostas evitadas/mês",
                  "1 meta financeira",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/50">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <a href={loginUrl}>
                <button className="w-full border border-white/15 text-white py-3 rounded-xl font-semibold hover:bg-white/5 transition-colors">
                  Criar Conta Grátis
                </button>
              </a>
            </div>

            {/* Premium */}
            <div className="bg-emerald-500/8 border-2 border-emerald-500/40 rounded-2xl p-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                MAIS POPULAR
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Premium</h3>
              <div className="text-5xl font-extrabold text-emerald-400 my-4">
                {country === "pt" ? "€2,90" : "R$ 9,90"}
                <span className="text-base font-normal text-white/25">/mês</span>
              </div>
              <p className="text-white/35 text-sm mb-6">
                Ou {country === "pt" ? "€25,00/ano (poupe €9,80)" : "R$ 99,00/ano (poupe R$ 19,80)"}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Tudo do plano gratuito",
                  "Apostas evitadas ilimitadas",
                  "Metas ilimitadas",
                  "Histórico completo",
                  "Perfil Financeiro avançado",
                  "Relatórios mensais por email",
                  "Gráficos de evolução temporal",
                  "Suporte prioritário",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/65">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <a href={loginUrl}>
                <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors">
                  Criar Conta e Começar
                </button>
              </a>
            </div>
          </div>
          <p className="text-center text-white/20 text-xs mt-6">
            Menos do que uma aposta por mês. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/4 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-white/25 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/45 text-sm leading-relaxed border-t border-white/8 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="relative bg-emerald-500/8 border border-emerald-500/25 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-emerald-500/8 rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <div className="text-5xl mb-6">🎯</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Pronto para recuperar o <span className="text-emerald-400">controlo</span>?
              </h2>
              <p className="text-white/45 mb-8 leading-relaxed">
                Junte-se a mais de 1.200 pessoas que já deram o primeiro passo. Grátis, sem cartão, sem compromisso.
              </p>
              <a href={loginUrl}>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-2 transition-all hover:scale-105 shadow-xl shadow-emerald-500/30">
                  Criar Conta Grátis <ArrowRight className="h-5 w-5" />
                </button>
              </a>
              <p className="text-white/20 text-xs mt-4">Grátis para sempre · Instala em 2 minutos · Sem cartão</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECURSOS DE EMERGÊNCIA ── */}
      <section className="py-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/25 text-sm mb-5">Precisa de ajuda imediata?</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "CVV Brasil", number: "188", flag: "🇧🇷" },
              { label: "SUS Brasil", number: "136", flag: "🇧🇷" },
              { label: "SOS Voz Amiga", number: "21 354 45 45", flag: "🇵🇹" },
            ].map((r, i) => (
              <a
                key={i}
                href={`tel:${r.number.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-white/30 hover:text-emerald-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{r.flag} {r.label}: <strong>{r.number}</strong></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white">HelpGames</span>
          </div>
          <div className="flex gap-6 text-sm text-white/25">
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#diferenciais" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como funciona</a>
            <a href={loginUrl} className="hover:text-white transition-colors">Criar Conta</a>
          </div>
          <p className="text-white/15 text-xs">© 2025 HelpGames. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
