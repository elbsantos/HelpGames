import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { 
  ArrowRight, 
  Heart, 
  Shield, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Users,
  Zap,
  Award,
  Lock,
  Smartphone,
  BarChart3,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

export default function LandingPageWithForm() {
  const { user, loading } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se usuário está logado, mostrar mensagem
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-slate-900">Bem-vindo de volta!</h1>
          <p className="text-xl text-slate-600">Você já está cadastrado e logado.</p>
          <a href="/dashboard" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg">
            Ir para Dashboard
          </a>
        </div>
      </div>
    );
  }

  const testimonials = [
    {
      name: "João Silva",
      age: 34,
      location: "São Paulo, Brasil",
      quote: "Perdi R$50.000 em 6 meses. HelpGames me ajudou a recuperar o controle. Já economizei R$5.000 em 30 dias.",
      saved: "R$5.000",
      avatar: "👨‍💼"
    },
    {
      name: "Maria Santos",
      age: 28,
      location: "Lisboa, Portugal",
      quote: "Gamban era caro e não me educava. HelpGames é gratuito e me ensinou sobre finanças. Recomendo!",
      saved: "€2.500",
      avatar: "👩‍💼"
    },
    {
      name: "Carlos Oliveira",
      age: 41,
      location: "Rio de Janeiro, Brasil",
      quote: "O Modo Crise salvou minha vida. Quando sinto o impulso, ativo e tenho suporte imediato.",
      saved: "R$8.000",
      avatar: "👨‍🦱"
    }
  ];

  const faqs = [
    {
      question: "É realmente gratuito?",
      answer: "Sim, 100% gratuito. Não há planos pagos, sem anúncios, sem upsell. Acreditamos que todos merecem acesso a ferramentas de recuperação."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim. Usamos criptografia de ponta a ponta, senhas bcrypt, e não compartilhamos dados com terceiros. Seus dados são seus."
    },
    {
      question: "Funciona em todos os navegadores?",
      answer: "A extensão funciona em Chrome, Firefox, Edge e Safari. Se você usa outro navegador, pode usar o bloqueio de 30 minutos manual."
    },
    {
      question: "Posso usar em múltiplos dispositivos?",
      answer: "Sim. Você pode instalar a extensão em todos os seus navegadores e acessar sua conta de qualquer dispositivo."
    },
    {
      question: "Preciso de cartão de crédito?",
      answer: "Não. HelpGames é 100% gratuito. Não pedimos informações de pagamento."
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

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold animate-pulse-glow">
            <Heart className="h-4 w-4" />
            <span>✨ Usado por 1000+ pessoas em Portugal e Brasil</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
            Recupere o Controle das Suas{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Apostas Online
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Ferramenta gratuita que bloqueia sites de apostas, educa sobre finanças e oferece suporte emocional. 
            Tudo o que você precisa para recuperar sua vida.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 h-14 animate-pulse-glow">
              <a href={getLoginUrl()}>
                Começar Agora (100% Gratuito) <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 h-14 border-2 border-slate-300">
              <a href="#como-funciona">Como Funciona</a>
            </Button>
          </div>

          <div className="pt-8 flex justify-center gap-8 text-sm text-slate-600">
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

      {/* Problema Section */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-orange-50 border-y border-slate-200">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                O Vício em Apostas Online é Real
              </h2>
              <p className="text-xl text-slate-600">
                Milhões de pessoas lutam contra apostas online. Você não está sozinho.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 border-2 border-red-200 shadow-lg">
                <div className="text-5xl font-bold text-red-600 mb-2">Milhões</div>
                <p className="text-slate-600 font-semibold">de pessoas afetadas globalmente</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
                <div className="text-5xl font-bold text-orange-600 mb-2">R$50k</div>
                <p className="text-slate-600 font-semibold">perda média por ano</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 border-yellow-200 shadow-lg">
                <div className="text-5xl font-bold text-yellow-600 mb-2">$5.19</div>
                <p className="text-slate-600 font-semibold">custo mensal de Gamban</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solução Section */}
      <section id="como-funciona" className="container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              HelpGames: Tudo o Que Você Precisa
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Uma solução completa que combina bloqueio, educação e suporte
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-emerald-600" />
                </div>
                <CardTitle className="text-slate-900">Bloqueio Automático</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Extensão que bloqueia 329k+ sites de apostas. Proteção 24/7.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-blue-600" />
                </div>
                <CardTitle className="text-slate-900">Educação Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Aprenda a regra 50-30-20 e gerencie seu dinheiro com inteligência.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:border-red-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-red-600" />
                </div>
                <CardTitle className="text-slate-900">Modo Crise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Proteção imediata em momentos críticos com suporte emocional.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 hover:border-yellow-500 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-yellow-600" />
                </div>
                <CardTitle className="text-slate-900">Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Suporte entre pares que entendem sua luta e jornada.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Formulário de Captura */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <LeadCaptureForm />
          </div>
        </div>
      </section>

      {/* Comparação vs Gamban */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Por Que Escolher HelpGames?
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-700">
                    <th className="text-left py-4 px-4 font-semibold text-slate-300">Aspecto</th>
                    <th className="text-center py-4 px-4 font-semibold">HelpGames</th>
                    <th className="text-center py-4 px-4 font-semibold text-slate-400">Gamban</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">Custo</td>
                    <td className="text-center py-4 px-4 font-bold text-emerald-400">Gratuito</td>
                    <td className="text-center py-4 px-4 text-slate-400">$5.19/mês</td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">Sites Bloqueados</td>
                    <td className="text-center py-4 px-4 font-bold text-emerald-400">329k+</td>
                    <td className="text-center py-4 px-4 text-slate-400">200k+</td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">Educação Financeira</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-6 w-6 text-emerald-400 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-600">✗</td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">Modo Crise</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-6 w-6 text-emerald-400 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-600">✗</td>
                  </tr>
                  <tr className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">Comunidade</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-6 w-6 text-emerald-400 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-600">✗</td>
                  </tr>
                  <tr className="hover:bg-slate-800 transition-colors">
                    <td className="py-4 px-4">Rastreamento</td>
                    <td className="text-center py-4 px-4"><CheckCircle className="h-6 w-6 text-emerald-400 mx-auto" /></td>
                    <td className="text-center py-4 px-4 text-slate-600">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testimoniais */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4">
              Histórias de Sucesso
            </h2>
            <p className="text-xl text-center text-slate-600 mb-16">
              Pessoas reais que recuperaram suas vidas com HelpGames
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <Card key={idx} className="border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-5xl">{testimonial.avatar}</div>
                      <div>
                        <p className="font-bold text-slate-900">{testimonial.name}</p>
                        <p className="text-sm text-slate-600">{testimonial.age} anos • {testimonial.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700 italic">"{testimonial.quote}"</p>
                    <div className="bg-emerald-100 rounded-lg p-3">
                      <p className="text-sm text-slate-600">Economizou:</p>
                      <p className="text-2xl font-bold text-emerald-600">{testimonial.saved}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 mb-16">
            Perguntas Frequentes
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 transition-colors">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-slate-900 text-left">{faq.question}</h3>
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

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Pronto para Recuperar o Controle?
            </h2>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já estão se recuperando. 
              Comece hoje, 100% gratuito.
            </p>
            <Button size="lg" asChild className="bg-white text-emerald-600 hover:bg-slate-100 text-lg px-8 h-14">
              <a href={getLoginUrl()}>
                Cadastre-se Agora <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <p className="text-sm text-emerald-100">
              ✓ Sem cartão de crédito • ✓ 100% Privado • ✓ Funciona em 2 minutos
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">HelpGames</h3>
              <p className="text-sm">Ferramenta gratuita contra apostas online</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Ajuda Profissional</h4>
              <ul className="space-y-2 text-sm">
                <li>🇵🇹 SOS Voz Amiga: 213 544 848</li>
                <li>🇧🇷 CVV: 188</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>© 2026 HelpGames. Todos os direitos reservados.</p>
            <p className="mt-2">Uma ferramenta de apoio para combater o vício em apostas online.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
