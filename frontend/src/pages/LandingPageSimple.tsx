import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeInSection } from "@/components/FadeInSection";
import { 
  ArrowRight, 
  Shield, 
  BarChart3,
  Zap,
  Users,
  CheckCircle,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";

export default function LandingPageSimple() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Salvar em localStorage
      const leads = JSON.parse(localStorage.getItem("helpgames_leads") || "[]");
      leads.push({ email, date: new Date().toISOString() });
      localStorage.setItem("helpgames_leads", JSON.stringify(leads));
      
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const testimonials = [
    {
      name: "João Silva",
      quote: "Perdi R$50.000 em 6 meses. HelpGames me ajudou a recuperar o controle.",
      saved: "R$5.000"
    },
    {
      name: "Maria Santos",
      quote: "Gamban era caro. HelpGames é gratuito e me ensinou sobre finanças.",
      saved: "€2.500"
    },
    {
      name: "Carlos Oliveira",
      quote: "O Modo Crise salvou minha vida. Quando sinto o impulso, ativo e tenho suporte.",
      saved: "R$8.000"
    }
  ];

  const faqs = [
    {
      question: "É realmente gratuito?",
      answer: "Sim, 100% gratuito. Sem planos pagos, sem anúncios."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim. Criptografia de ponta a ponta, senhas bcrypt, sem compartilhamento."
    },
    {
      question: "Funciona em todos os navegadores?",
      answer: "Chrome, Firefox, Edge e Safari. Suporte completo."
    },
    {
      question: "Posso usar em múltiplos dispositivos?",
      answer: "Sim. Instale em todos os seus navegadores."
    },
    {
      question: "Preciso de cartão de crédito?",
      answer: "Não. 100% gratuito, sem informações de pagamento."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                HelpGames
              </span>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <FadeInSection direction="up" duration={700}>
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
            Recupere o Controle das Suas{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Apostas Online
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            Ferramenta gratuita que bloqueia sites de apostas, educa sobre finanças e oferece suporte emocional.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <a href={getLoginUrl()}>
                Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#como-funciona">Como Funciona</a>
            </Button>
          </div>

          <div className="flex justify-center gap-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>100% Privado</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span>Funciona em 2 min</span>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Problema */}
      <FadeInSection direction="up" duration={700}>
      <section className="py-20 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">
            O Vício em Apostas Online é Real
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-red-200">
              <div className="text-5xl font-bold text-red-600 mb-2">Milhões</div>
              <p className="text-slate-600">de pessoas afetadas</p>
            </Card>
            <Card className="p-8 border-2 border-orange-200">
              <div className="text-5xl font-bold text-orange-600 mb-2">R$50k</div>
              <p className="text-slate-600">perda média por ano</p>
            </Card>
            <Card className="p-8 border-2 border-yellow-200">
              <div className="text-5xl font-bold text-yellow-600 mb-2">$5.19</div>
              <p className="text-slate-600">custo mensal de Gamban</p>
            </Card>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Solução */}
      <FadeInSection direction="up" duration={700}>
      <section id="como-funciona" className="container py-20">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
          HelpGames: Tudo o Que Você Precisa
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 border-2 border-emerald-200 hover:border-emerald-500 transition-colors">
            <Shield className="h-8 w-8 text-emerald-600 mb-4" />
            <h3 className="font-bold mb-2">Bloqueio Automático</h3>
            <p className="text-sm text-slate-600">329k+ sites bloqueados</p>
          </Card>

          <Card className="p-6 border-2 border-blue-200 hover:border-blue-500 transition-colors">
            <BarChart3 className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="font-bold mb-2">Educação Financeira</h3>
            <p className="text-sm text-slate-600">Aprenda a regra 50-30-20</p>
          </Card>

          <Card className="p-6 border-2 border-red-200 hover:border-red-500 transition-colors">
            <Zap className="h-8 w-8 text-red-600 mb-4" />
            <h3 className="font-bold mb-2">Modo Crise</h3>
            <p className="text-sm text-slate-600">Proteção imediata</p>
          </Card>

          <Card className="p-6 border-2 border-yellow-200 hover:border-yellow-500 transition-colors">
            <Users className="h-8 w-8 text-yellow-600 mb-4" />
            <h3 className="font-bold mb-2">Comunidade</h3>
            <p className="text-sm text-slate-600">Suporte entre pares</p>
          </Card>
        </div>
      </section>
      </FadeInSection>

      {/* Formulário */}
      <FadeInSection direction="up" duration={700}>
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container max-w-2xl">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-200">
            <h2 className="text-3xl font-bold mb-2 text-slate-900">Receba Atualizações</h2>
            <p className="text-slate-600 mb-6">Seja o primeiro a saber sobre novos recursos</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  required
                />
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Inscrever
                </Button>
              </div>
            </form>

            {submitted && (
              <div className="mt-4 p-4 bg-emerald-100 text-emerald-700 rounded-lg">
                ✓ Obrigado! Verifique seu email.
              </div>
            )}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Comparação */}
      <FadeInSection direction="up" duration={700}>
      <section className="py-20 bg-slate-900 text-white">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-12">Por Que Escolher HelpGames?</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-700">
                  <th className="text-left py-3 px-4">Aspecto</th>
                  <th className="text-center py-3 px-4">HelpGames</th>
                  <th className="text-center py-3 px-4">Gamban</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4">Custo</td>
                  <td className="text-center font-bold text-emerald-400">Gratuito</td>
                  <td className="text-center text-slate-400">$5.19/mês</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4">Educação</td>
                  <td className="text-center text-emerald-400">✓</td>
                  <td className="text-center text-slate-600">✗</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-3 px-4">Modo Crise</td>
                  <td className="text-center text-emerald-400">✓</td>
                  <td className="text-center text-slate-600">✗</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Comunidade</td>
                  <td className="text-center text-emerald-400">✓</td>
                  <td className="text-center text-slate-600">✗</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Testimoniais */}
      <FadeInSection direction="up" duration={700}>
      <section className="py-20">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Histórias de Sucesso
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="p-6 border-2 border-slate-200">
                <p className="text-slate-700 italic mb-4">"{t.quote}"</p>
                <p className="font-bold text-slate-900">{t.name}</p>
                <p className="text-2xl font-bold text-emerald-600">{t.saved}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* FAQ */}
      <FadeInSection direction="up" duration={700}>
      <section className="py-20 bg-slate-50">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Perguntas Frequentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                >
                  <h3 className="font-semibold text-slate-900 text-left">{faq.question}</h3>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-600 transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 py-4 bg-slate-50 border-t-2 border-slate-200">
                    <p className="text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* CTA Final */}
      <FadeInSection direction="up" duration={700}>
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container max-w-3xl text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">
            Pronto para Recuperar o Controle?
          </h2>
          <p className="text-xl text-emerald-50">
            Junte-se a milhares de pessoas que já estão se recuperando.
          </p>
          <Button size="lg" asChild className="bg-white text-emerald-600 hover:bg-slate-100">
            <a href={getLoginUrl()}>
              Cadastre-se Agora <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container text-center">
          <p>© 2026 HelpGames. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">Uma ferramenta de apoio para combater o vício em apostas online.</p>
        </div>
      </footer>
    </div>
  );
}