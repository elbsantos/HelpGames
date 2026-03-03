import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Chrome, Globe, Download, CheckCircle2, AlertCircle, ExternalLink, Zap, Lock, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const EXTENSION_ZIP_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663264143009/FrPGcyEcFhqBhETd.zip";

const INSTALL_STEPS_CHROME = [
  { step: 1, title: "Descarregar a extensão", desc: "Clique no botão abaixo para descarregar o ficheiro ZIP da extensão HelpGames." },
  { step: 2, title: "Abrir as extensões do Chrome", desc: 'Abra o Chrome e escreva chrome://extensions na barra de endereço. Prima Enter.' },
  { step: 3, title: "Activar o modo de programador", desc: 'No canto superior direito da página de extensões, active o "Modo de programador" (Developer mode).' },
  { step: 4, title: "Extrair e carregar a extensão", desc: 'Extraia o ficheiro ZIP. Clique em "Carregar sem compactação" (Load unpacked) e seleccione a pasta extraída.' },
  { step: 5, title: "Pronto!", desc: "A extensão HelpGames aparece no Chrome. Clique no ícone HG para activar o bloqueio." },
];

const INSTALL_STEPS_EDGE = [
  { step: 1, title: "Descarregar a extensão", desc: "Clique no botão abaixo para descarregar o ficheiro ZIP da extensão HelpGames." },
  { step: 2, title: "Abrir as extensões do Edge", desc: 'Abra o Edge e escreva edge://extensions na barra de endereço. Prima Enter.' },
  { step: 3, title: "Activar o modo de programador", desc: 'No canto inferior esquerdo, active o "Modo de programador".' },
  { step: 4, title: "Extrair e carregar a extensão", desc: 'Extraia o ficheiro ZIP. Clique em "Carregar descompactado" e seleccione a pasta extraída.' },
  { step: 5, title: "Pronto!", desc: "A extensão HelpGames aparece no Edge. Clique no ícone HG para activar o bloqueio." },
];

const FEATURES = [
  { icon: <Shield className="w-5 h-5 text-emerald-400" />, title: "200+ sites bloqueados", desc: "Lista actualizada com os principais sites de apostas do Brasil e Portugal" },
  { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: "Bloqueio instantâneo", desc: "Intercepta o acesso antes da página carregar — sem atrasos" },
  { icon: <Lock className="w-5 h-5 text-blue-400" />, title: "Persistente", desc: "O bloqueio mantém-se activo mesmo após fechar e reabrir o browser" },
  { icon: <RefreshCw className="w-5 h-5 text-purple-400" />, title: "Modo Crise", desc: "Bloqueio de 1 hora com um clique para momentos de impulso forte" },
];

export default function ExtensaoBloqueio() {
  const [browser, setBrowser] = useState<"chrome" | "edge">("chrome");
  const [downloaded, setDownloaded] = useState(false);
  const handleDownload = () => {
    window.open(EXTENSION_ZIP_URL, "_blank");
    setDownloaded(true);
    toast.success("Download iniciado! Siga os passos abaixo para instalar a extensão.");
  };

  const steps = browser === "chrome" ? INSTALL_STEPS_CHROME : INSTALL_STEPS_EDGE;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Shield className="w-4 h-4" />
            Bloqueio Real e Efectivo
          </div>
          <h1 className="text-4xl font-bold">Extensão HelpGames</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Instale a extensão no seu browser e bloqueie automaticamente mais de <strong className="text-emerald-400">200 sites de apostas</strong> — sem precisar de força de vontade a cada tentativa.
          </p>
        </div>

        {/* Funcionalidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardContent className="flex items-start gap-4 pt-5">
                <div className="p-2 rounded-lg bg-background border border-border/50 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Download CTA */}
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg">Descarregar Extensão HelpGames v2.0</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ficheiro ZIP · ~16 KB · Chrome e Edge compatíveis
                </p>
              </div>
              <Button
                onClick={handleDownload}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
                size="lg"
              >
                <Download className="w-5 h-5" />
                {downloaded ? "Descarregar novamente" : "Descarregar Extensão"}
              </Button>
            </div>
            {downloaded && (
              <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Download iniciado! Siga os passos abaixo para instalar.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selector de browser */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Guia de Instalação</h2>
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setBrowser("chrome")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                browser === "chrome"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-card border-border text-muted-foreground hover:border-emerald-500/30"
              }`}
            >
              <Chrome className="w-4 h-4" />
              Google Chrome
            </button>
            <button
              onClick={() => setBrowser("edge")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                browser === "edge"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-card border-border text-muted-foreground hover:border-emerald-500/30"
              }`}
            >
              <Globe className="w-4 h-4" />
              Microsoft Edge
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((s) => (
              <Card key={s.step} className={`border-border/50 ${s.step === 1 && downloaded ? "border-emerald-500/40 bg-emerald-500/5" : ""}`}>
                <CardContent className="flex items-start gap-4 pt-5 pb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    s.step === 1 && downloaded
                      ? "bg-emerald-500 text-black"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {s.step === 1 && downloaded ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{s.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                    {s.step === 2 && (
                      <code className="mt-2 block text-xs bg-muted px-3 py-1.5 rounded font-mono text-emerald-400">
                        {browser === "chrome" ? "chrome://extensions" : "edge://extensions"}
                      </code>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Aviso importante */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400 text-base">
              <AlertCircle className="w-5 h-5" />
              Informações Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Cobertura:</strong> A extensão bloqueia +200 domínios de apostas. Sites novos podem não estar incluídos — actualizamos a lista regularmente.
            </p>
            <p>
              <strong className="text-foreground">Outros browsers:</strong> A extensão é compatível com Chrome e Edge. Firefox e Safari requerem instalação diferente (em desenvolvimento).
            </p>
            <p>
              <strong className="text-foreground">Não é infalível:</strong> Um utilizador determinado pode desinstalar a extensão. Use como ferramenta de apoio, não como solução única.
            </p>
            <p>
              <strong className="text-foreground">Complemento:</strong> Combine com suporte profissional e as outras ferramentas do HelpGames para melhores resultados.
            </p>
          </CardContent>
        </Card>

        {/* Links de ajuda */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-emerald-500/30 transition-all"
          >
            <Chrome className="w-4 h-4" />
            Chrome Web Store
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
          <a
            href="https://microsoftedge.microsoft.com/addons"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground hover:border-emerald-500/30 transition-all"
          >
            <Globe className="w-4 h-4" />
            Edge Add-ons
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
