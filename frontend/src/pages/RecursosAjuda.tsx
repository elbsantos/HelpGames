import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Globe, Clock, MapPin, MessageCircle, Heart } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  description: string;
  type: "helpline" | "support" | "tool" | "therapy";
  phone?: string;
  website?: string;
  email?: string;
  hours?: string;
  region?: string;
  services: string[];
  color: string;
  icon: React.ReactNode;
}

const ORGANIZATIONS: Organization[] = [
  {
    id: "gamblers-anonymous",
    name: "Gamblers Anonymous",
    description: "Organização internacional de suporte com grupos de recuperação em 12 passos",
    type: "support",
    website: "https://www.gamblersanonymous.org",
    hours: "Reuniões diárias em diferentes horários",
    region: "Internacional",
    services: ["Grupos de suporte", "Mentoria", "Recursos educativos"],
    color: "text-blue-600",
    icon: <Heart className="w-8 h-8 text-blue-600" />,
  },
  {
    id: "ncpg",
    name: "National Council on Problem Gambling (NCPG)",
    description: "Helpline gratuita e confidencial com conselheiros treinados",
    type: "helpline",
    phone: "1-800-522-4700",
    website: "https://www.ncpg.org",
    hours: "24 horas, 7 dias por semana",
    region: "Estados Unidos",
    services: ["Helpline 24/7", "Chat online", "Recursos educativos", "Referências de tratamento"],
    color: "text-green-600",
    icon: <Phone className="w-8 h-8 text-green-600" />,
  },
  {
    id: "gamcare",
    name: "GamCare",
    description: "Serviço de suporte britânico com acesso a terapeutas especializados",
    type: "therapy",
    phone: "+44 (0) 808 8020 133",
    website: "https://www.gamcare.org.uk",
    hours: "Segunda-sexta 8am-midnight, Sábado-domingo 10am-midnight",
    region: "Reino Unido",
    services: ["Helpline", "Terapia online", "Suporte presencial", "Recursos para família"],
    color: "text-purple-600",
    icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
  },
  {
    id: "betfilter",
    name: "Betfilter",
    description: "Bloqueador de sites de apostas - ferramenta tecnológica de proteção",
    type: "tool",
    website: "https://www.betfilter.org",
    hours: "Disponível 24/7",
    region: "Internacional",
    services: ["Bloqueio de sites", "Bloqueio de apps", "Relatórios de uso", "Suporte técnico"],
    color: "text-red-600",
    icon: <Globe className="w-8 h-8 text-red-600" />,
  },
  {
    id: "gamblers-anonymous-br",
    name: "Jogadores Anônimos Brasil",
    description: "Filial brasileira com grupos de suporte em português",
    type: "support",
    website: "https://www.jogadoresanonimos.org.br",
    hours: "Reuniões em diferentes horários",
    region: "Brasil",
    services: ["Grupos de suporte", "Mentoria", "Recursos em português"],
    color: "text-yellow-600",
    icon: <Heart className="w-8 h-8 text-yellow-600" />,
  },
  {
    id: "cvv",
    name: "Centro de Valorização da Vida (CVV)",
    description: "Suporte emocional e prevenção de suicídio - útil em crises",
    type: "helpline",
    phone: "188 (ligação gratuita)",
    website: "https://www.cvv.org.br",
    hours: "24 horas, 7 dias por semana",
    region: "Brasil",
    services: ["Atendimento telefônico", "Chat online", "Email", "Suporte emocional"],
    color: "text-indigo-600",
    icon: <Phone className="w-8 h-8 text-indigo-600" />,
  },
];

const TIPS = [
  {
    title: "Procure ajuda profissional",
    description: "Terapeutas especializados em vício em apostas podem oferecer tratamento eficaz",
  },
  {
    title: "Envolva sua família",
    description: "Compartilhe suas preocupações com pessoas de confiança que possam apoiá-lo",
  },
  {
    title: "Use ferramentas de bloqueio",
    description: "Instale extensões como Betfilter para bloquear sites de apostas automaticamente",
  },
  {
    title: "Participe de grupos de suporte",
    description: "Grupos como Gamblers Anonymous oferecem apoio de pessoas com experiências similares",
  },
  {
    title: "Estabeleça limites financeiros",
    description: "Controle seu acesso a dinheiro e peça ajuda para gerenciar finanças se necessário",
  },
  {
    title: "Desenvolva hobbies alternativos",
    description: "Encontre atividades prazerosas que substituam o impulso de apostar",
  },
];

export default function RecursosAjuda() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Recursos de Ajuda</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Você não está sozinho. Existem muitos recursos disponíveis para ajudá-lo a recuperar o controle
            sobre suas apostas. Abaixo estão organizações confiáveis e ferramentas que podem fazer diferença.
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ORGANIZATIONS.map((org) => (
            <Card key={org.id} className="border-2 hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">{org.icon}</div>
                  <span className="text-xs font-semibold bg-slate-100 px-2 py-1 rounded">
                    {org.region}
                  </span>
                </div>
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <CardDescription>{org.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 flex-1 flex flex-col">
                {/* Services */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Serviços:</h4>
                  <ul className="space-y-1">
                    {org.services.map((service, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  {org.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${org.phone}`} className="text-blue-600 hover:underline font-medium">
                        {org.phone}
                      </a>
                    </div>
                  )}
                  {org.hours && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>{org.hours}</span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        Visitar site
                      </a>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  asChild
                  className="w-full mt-auto"
                  variant={org.type === "helpline" ? "default" : "outline"}
                >
                  {org.phone ? (
                    <a href={`tel:${org.phone}`}>Ligar Agora</a>
                  ) : (
                    <a href={org.website} target="_blank" rel="noopener noreferrer">
                      Saiba Mais
                    </a>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Section */}
        <Card className="bg-red-50 border-2 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Heart className="w-6 h-6" />
              Em Crise? Procure Ajuda Imediata
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Se você está em risco imediato ou tendo pensamentos prejudiciais, entre em contato com um serviço
              de emergência ou ligue para um número de prevenção de suicídio:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <p className="font-semibold text-red-600 mb-1">Brasil - CVV</p>
                <p className="text-2xl font-bold text-red-600">188</p>
                <p className="text-sm text-gray-600">Ligação gratuita, 24/7</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <p className="font-semibold text-red-600 mb-1">EUA - National Suicide Prevention</p>
                <p className="text-2xl font-bold text-red-600">988</p>
                <p className="text-sm text-gray-600">Ligação gratuita, 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Dicas para Recuperação</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TIPS.map((tip, idx) => (
              <Card key={idx} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Resources Summary */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Lembre-se</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>✓ Você não está sozinho:</strong> Milhões de pessoas enfrentam problemas com apostas e
              encontraram ajuda.
            </p>
            <p>
              <strong>✓ Recuperação é possível:</strong> Com o apoio certo, você pode recuperar o controle e
              construir uma vida melhor.
            </p>
            <p>
              <strong>✓ Procure ajuda cedo:</strong> Quanto mais cedo você agir, mais fácil será o processo de
              recuperação.
            </p>
            <p>
              <strong>✓ Múltiplas opções:</strong> Diferentes abordagens funcionam para diferentes pessoas - terapia,
              grupos de suporte, ferramentas tecnológicas.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
