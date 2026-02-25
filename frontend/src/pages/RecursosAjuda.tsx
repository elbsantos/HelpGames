import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
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
    id: "gamblers-anonymous-br",
    name: "Associação Nacional de Jogadores Anônimos",
    description: "Programa de 12 passos para recuperação de vício em jogo com grupos de suporte em português",
    type: "support",
    website: "https://www.jogadoresanonimos.org.br",
    hours: "Reuniões em diferentes horários",
    region: "Brasil",
    services: ["Grupos de suporte", "Mentoria", "Programa de 12 passos"],
    color: "text-yellow-600",
    icon: <Heart className="w-8 h-8 text-yellow-600" />,
  },
  {
    id: "sus-brasil",
    name: "SUS - Serviço de Atenção a Transtornos por Uso de Substâncias",
    description: "Tratamento especializado para transtornos de jogo e dependência através do SUS brasileiro",
    type: "therapy",
    phone: "136 (Disque Saúde)",
    website: "https://www.saude.gov.br",
    hours: "24 horas, 7 dias por semana",
    region: "Brasil - SUS",
    services: ["Atendimento médico especializado", "Terapia individual", "Terapia em grupo", "Medicação"],
    color: "text-blue-600",
    icon: <Phone className="w-8 h-8 text-blue-600" />,
  },
  {
    id: "cvv",
    name: "Centro de Valorização da Vida (CVV)",
    description: "Apoio emocional e prevenção de suicídio - essencial em crises relacionadas a apostas",
    type: "helpline",
    phone: "188 (ligação gratuita)",
    website: "https://www.cvv.org.br",
    hours: "24 horas, 7 dias por semana",
    region: "Brasil",
    services: ["Atendimento telefônico", "Chat online", "Email", "Apoio emocional"],
    color: "text-indigo-600",
    icon: <Phone className="w-8 h-8 text-indigo-600" />,
  },
  {
    id: "sos-voz-amiga",
    name: "SOS Voz Amiga",
    description: "Serviço de apoio emocional português com atendimento especializado em crises",
    type: "helpline",
    phone: "21 354 45 45",
    website: "https://www.sosvozamiga.org",
    hours: "24 horas, 7 dias por semana",
    region: "Portugal",
    services: ["Atendimento telefônico", "Apoio emocional", "Suporte em crises"],
    color: "text-green-600",
    icon: <Phone className="w-8 h-8 text-green-600" />,
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
    title: "Use a proteção integrada do HelpGames",
    description: "Ative a extensão de navegador do HelpGames para bloquear automaticamente sites de apostas",
  },
  {
    title: "Participe de grupos de suporte",
    description: "Grupos como Jogadores Anônimos oferecem apoio de pessoas com experiências similares",
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
        <div className="text-center space-y-4 mb-6">
          <h1 className="text-4xl font-bold">Recursos de Ajuda</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Você não está sozinho. Existem muitos recursos disponíveis para ajudá-lo a recuperar o controle sobre suas apostas. Abaixo estão organizações confiáveis e ferramentas que podem fazer diferença.
          </p>
        </div>

        {/* Organizations Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
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
                <p className="font-semibold text-red-600 mb-1">Brasil - CVV (SUS)</p>
                <p className="text-2xl font-bold text-red-600">188</p>
                <p className="text-sm text-gray-600">Ligação gratuita, 24/7</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <p className="font-semibold text-red-600 mb-1">Portugal - SOS Voz Amiga</p>
                <p className="text-2xl font-bold text-red-600">21 354 45 45</p>
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
              grupos de suporte, ferramentas tecnológicas integradas.
            </p>
          </CardContent>
        </Card>

        {/* Footer com botão de voltar */}
        <div className="flex justify-center pt-6 border-t">
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              ← Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
