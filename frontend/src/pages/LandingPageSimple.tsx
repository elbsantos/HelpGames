import { useState } from "react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Shield, Target, DollarSign, Brain, Heart,
  CheckCircle, Star, ChevronDown, ChevronUp,
  ArrowRight, Lock, Phone, LogOut
} from "lucide-react";

export default function LandingPageSimple() {
  const { user, loading, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [country, setCountry] = useState<"pt" | "br">("br");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const leads = JSON.parse(localStorage.getItem("helpgames_leads") || "[]");
    leads.push({ email, date: new Date().toISOString(), country });
    localStorage.setItem("helpgames_leads", JSON.stringify(leads));
    setSubmitted(true);
    setEmail("");
  };

  const faqs = [
    {
      q: "O HelpGames realmente funciona para parar de apostar?",
      a: "Sim. O HelpGames combina bloqueio técnico de sites de apostas com educação financeira e acompanhamento de progresso. Utilizadores relatam redução significativa de apostas já na primeira semana."
    },
    {
      q: "Como funciona o bloqueio de sites de apostas?",
      a: "A extensão de navegador do HelpGames bloqueia automaticamente centenas de sites de apostas conhecidos. Quando tenta aceder, é redirecionado para uma página de apoio com recursos de ajuda."
    },
    {
      q: "Posso usar gratuitamente?",
      a: "Sim! O plano gratuito inclui dashboard básico, modo crise, recursos de ajuda e até 5 registos de apostas evitadas por mês. O plano Premium desbloqueia tudo por apenas €2,90/mês em Portugal ou R$9,90/mês no Brasil."
    },
    {
      q: "Os meus dados são privados?",
      a: "Absolutamente. Todos os seus dados são encriptados e nunca partilhados com terceiros. Apenas você tem acesso ao seu histórico e progresso."
    },
    {
      q: "E se eu tiver uma recaída?",
      a: "O Modo Crise está disponível 24/7 para apoio imediato. Também conectamos a recursos profissionais como o CVV (Brasil) e SOS Voz Amiga (Portugal). Uma recaída não é o fim — é parte do processo."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Nav */}
      <nav className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white">HelpGames</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#precos" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Preços</a>
            <a href="#como-funciona" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Recursos</a>
            {!loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white/40 hover:text-white/70 transition-colors p-2 rounded-lg hover:bg-white/5"
                    title="Sair da conta"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <a href={getLoginUrl()}>
                  <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                    Criar Conta Grátis
                  </button>
                </a>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-sm text-emerald-400 mb-8">
            <Shield className="h-3.5 w-3.5" />
            Mais de 1.200 pessoas já recuperaram o controlo
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-4xl mx-auto tracking-tight">
            Recupere o controlo do seu{" "}
            <span className="text-emerald-400">dinheiro</span>{" "}
            antes que a próxima aposta aconteça.
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            HelpGames combina <strong className="text-white">bloqueio inteligente</strong> +{" "}
            <strong className="text-white">educação financeira</strong> para ajudar você a parar de apostar de forma definitiva.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
            {loading ? (
              <div className="h-14 w-64 bg-white/10 rounded-xl animate-pulse" />
            ) : user ? (
              <Link href="/dashboard">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl text-lg flex items-center gap-2 justify-center transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
                  Ir ao Dashboard <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl text-lg flex items-center gap-2 justify-center transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
                  Criar Conta Grátis <ArrowRight className="h-5 w-5" />
                </button>
              </a>
            )}
            <a href="#como-funciona">
              <button className="border border-white/20 hover:border-emerald-500/50 text-white px-8 py-4 rounded-xl text-lg transition-all hover:bg-white/5">
                Ver como funciona
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto border-t border-white/10 pt-10">
            {[
              { value: "R$ 2.400", label: "Poupados em média/ano" },
              { value: "87%", label: "Reduzem apostas em 30 dias" },
              { value: "24/7", label: "Bloqueio activo" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problema */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              O vício em apostas está a{" "}
              <span className="text-red-400">destruir finanças</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Os números são alarmantes — e podem estar a afectar você agora mesmo.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { stat: "6 em 10", desc: "apostadores têm dívidas relacionadas a apostas", color: "text-red-400", bg: "bg-red-500/5 border-red-500/20" },
              { stat: "R$ 450", desc: "é o valor médio perdido por semana por apostadores compulsivos", color: "text-orange-400", bg: "bg-orange-500/5 border-orange-500/20" },
              { stat: "78%", desc: "tentam parar sozinhos e falham sem ferramentas adequadas", color: "text-yellow-400", bg: "bg-yellow-500/5 border-yellow-500/20" },
            ].map((item, i) => (
              <div key={i} className={`border rounded-2xl p-8 text-center ${item.bg}`}>
                <div className={`text-5xl font-extrabold mb-3 ${item.color}`}>{item.stat}</div>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solução */}
      <section id="como-funciona" className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Uma solução <span className="text-emerald-400">completa</span> para parar de apostar
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Quatro pilares que trabalham juntos para a sua recuperação.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Lock, title: "Bloqueio Inteligente", desc: "Extensão que bloqueia automaticamente centenas de sites de apostas em tempo real.", iconColor: "text-emerald-400", bgColor: "bg-emerald-500/10" },
              { icon: DollarSign, title: "Educação Financeira", desc: "Veja quanto poupou, defina metas e acompanhe o seu progresso financeiro.", iconColor: "text-blue-400", bgColor: "bg-blue-500/10" },
              { icon: Brain, title: "Modo Crise", desc: "Apoio imediato 24/7 quando o impulso de apostar é mais forte.", iconColor: "text-purple-400", bgColor: "bg-purple-500/10" },
              { icon: Heart, title: "Comunidade & Ajuda", desc: "Recursos profissionais em Portugal e Brasil, incluindo SUS e CVV.", iconColor: "text-pink-400", bgColor: "bg-pink-500/10" },
            ].map((f, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.bgColor}`}>
                  <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Comece em <span className="text-emerald-400">3 passos simples</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { step: "01", title: "Crie a sua conta gratuita", desc: "Registe-se em segundos com a sua conta Google. Sem cartão de crédito, sem compromisso." },
              { step: "02", title: "Instale a extensão de bloqueio", desc: "Em menos de 1 minuto, a extensão bloqueia automaticamente todos os sites de apostas." },
              { step: "03", title: "Defina as suas metas financeiras", desc: "Veja o dinheiro que está a poupar crescer em tempo real e celebre cada vitória." },
            ].map((s, i) => (
              <div key={i} className="flex gap-6 items-start bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                <div className="text-4xl font-extrabold text-emerald-500/20 min-w-[3rem] leading-none pt-1">{s.step}</div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            {!loading && !user && (
              <a href={getLoginUrl()}>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
                  Começar Agora — É Grátis <ArrowRight className="h-5 w-5" />
                </button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Planos para <span className="text-emerald-400">Portugal e Brasil</span>
            </h2>
            <p className="text-white/40 mb-6">Comece grátis. Faça upgrade quando quiser.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setCountry("pt")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${country === "pt" ? "bg-emerald-500 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                🇵🇹 Portugal (€)
              </button>
              <button
                onClick={() => setCountry("br")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${country === "br" ? "bg-emerald-500 text-black" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                🇧🇷 Brasil (R$)
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Grátis */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-1 text-white">Gratuito</h3>
              <div className="text-5xl font-extrabold text-white my-4">
                {country === "pt" ? "€0" : "R$ 0"}
                <span className="text-base font-normal text-white/30">/mês</span>
              </div>
              <p className="text-white/40 text-sm mb-6">Para sempre, sem cartão</p>
              <ul className="space-y-3 mb-8">
                {["Dashboard básico", "Até 5 apostas evitadas/mês", "1 meta financeira", "Histórico 7 dias", "Modo Crise", "Recursos de Ajuda"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {user ? (
                <Link href="/dashboard">
                  <button className="w-full border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/5 transition-colors">
                    Ir ao Dashboard
                  </button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <button className="w-full border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/5 transition-colors">
                    Criar Conta Grátis
                  </button>
                </a>
              )}
            </div>

            {/* Premium */}
            <div className="bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                RECOMENDADO
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">Premium</h3>
              <div className="text-5xl font-extrabold text-emerald-400 my-4">
                {country === "pt" ? "€2,90" : "R$ 9,90"}
                <span className="text-base font-normal text-white/30">/mês</span>
              </div>
              <p className="text-white/40 text-sm mb-6">
                Ou {country === "pt" ? "€25,00/ano" : "R$ 99,00/ano"} — poupe {country === "pt" ? "€9,80" : "R$ 19,80"}
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Tudo do plano gratuito",
                  "Apostas evitadas ilimitadas",
                  "Metas ilimitadas",
                  "Histórico completo",
                  "Perfil Financeiro avançado",
                  "Relatórios detalhados",
                  "Sem anúncios",
                  "Suporte prioritário"
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              {user ? (
                <Link href="/precos">
                  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors">
                    Fazer Upgrade
                  </button>
                </Link>
              ) : (
                <a href={getLoginUrl()}>
                  <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition-colors">
                    Criar Conta e Começar
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Histórias reais de <span className="text-emerald-400">recuperação</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Carlos M.", city: "São Paulo, BR", text: "Perdi R$ 18.000 em 8 meses. Com o HelpGames bloqueei os sites e em 3 meses já tinha poupado R$ 2.400. Mudou a minha vida.", stars: 5, savings: "R$ 2.400 poupados" },
              { name: "Ana R.", city: "Lisboa, PT", text: "O Modo Crise salvou-me várias vezes. Quando o impulso vinha, abria o app e passava. Já são 6 meses sem apostar.", stars: 5, savings: "€1.800 poupados" },
              { name: "João F.", city: "Porto, PT", text: "Tentei parar sozinho 4 vezes. Com o bloqueio automático do HelpGames finalmente consegui. A extensão funciona mesmo.", stars: 5, savings: "€2.100 poupados" },
            ].map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/20 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-white/30 text-xs">{t.city}</div>
                  </div>
                  <div className="text-emerald-400 text-xs font-bold">{t.savings}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-white/30 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-white/50 text-sm leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Captura de leads */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-10">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para recuperar o <span className="text-emerald-400">controlo</span>?
            </h2>
            <p className="text-white/50 mb-8">
              Junte-se a mais de 1.200 pessoas que já deram o primeiro passo. Grátis, sem cartão.
            </p>
            {user ? (
              <Link href="/dashboard">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-xl text-lg inline-flex items-center gap-2 mx-auto transition-all hover:scale-105">
                  Ir ao Dashboard <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            ) : submitted ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 text-emerald-400 font-semibold">
                ✓ Obrigado! Entraremos em contacto em breve.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="O seu melhor email"
                  required
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/60 text-sm"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                  Quero começar
                </button>
              </form>
            )}
            {!user && <p className="text-white/20 text-xs mt-4">Sem spam. Cancele quando quiser.</p>}
          </div>
        </div>
      </section>

      {/* Recursos de emergência */}
      <section className="py-10 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/30 text-sm mb-5">Precisa de ajuda imediata?</p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "CVV Brasil", number: "188", flag: "🇧🇷" },
              { label: "SUS Brasil", number: "136", flag: "🇧🇷" },
              { label: "SOS Voz Amiga", number: "21 354 45 45", flag: "🇵🇹" },
            ].map((r, i) => (
              <a
                key={i}
                href={`tel:${r.number.replace(/\s/g, "")}`}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-emerald-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{r.flag} {r.label}: <strong>{r.number}</strong></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="font-bold text-white">HelpGames</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="/recursos-ajuda" className="hover:text-white transition-colors">Ajuda</a>
            {user
              ? <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              : <a href={getLoginUrl()} className="hover:text-white transition-colors">Entrar</a>
            }
          </div>
          <p className="text-white/20 text-xs">© 2025 HelpGames. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
