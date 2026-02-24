import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Mail, User, MapPin, CheckCircle, AlertCircle } from "lucide-react";

interface LeadCaptureFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export default function LeadCaptureForm({ onSuccess, compact = false }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    location: "Portugal"
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("Email é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Email inválido");
      return false;
    }
    if (!formData.name || formData.name.trim().length < 2) {
      setError("Nome é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular envio de dados
      // Em produção, isso seria uma chamada tRPC
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Salvar em localStorage para rastreamento
      const leads = JSON.parse(localStorage.getItem("helpgames_leads") || "[]");
      leads.push({
        ...formData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem("helpgames_leads", JSON.stringify(leads));

      setSubmitted(true);
      // Toast de sucesso

      if (onSuccess) {
        onSuccess();
      }

      // Reset form após 3 segundos
      setTimeout(() => {
        setFormData({ email: "", name: "", location: "Portugal" });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setError("Erro ao enviar formulário. Tente novamente.");
      // Toast de erro
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10"
              disabled={loading}
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {submitted ? (
          <div className="flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            Cadastro realizado com sucesso!
          </div>
        ) : (
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? "Enviando..." : "Cadastre-se Agora"}
          </Button>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Comece Sua Jornada</h3>
        <p className="text-slate-600">Cadastre-se agora e receba acesso imediato</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 h-12 text-base"
              disabled={loading}
            />
          </div>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Nome Completo *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              name="name"
              placeholder="Seu nome"
              value={formData.name}
              onChange={handleChange}
              className="pl-10 h-12 text-base"
              disabled={loading}
            />
          </div>
        </div>

        {/* Localização */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Localização
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full pl-10 pr-4 h-12 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-base"
              disabled={loading}
            >
              <option value="Portugal">🇵🇹 Portugal</option>
              <option value="Brasil">🇧🇷 Brasil</option>
              <option value="Outro">🌍 Outro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Mensagem de Sucesso */}
      {submitted ? (
        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-600">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Sucesso!</p>
            <p className="text-sm">Verifique seu email para confirmar o cadastro.</p>
          </div>
        </div>
      ) : (
        <Button 
          type="submit" 
          disabled={loading}
          size="lg"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg h-12 font-semibold"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Enviando...
            </span>
          ) : (
            "Cadastre-se Agora (100% Gratuito)"
          )}
        </Button>
      )}

      <p className="text-xs text-slate-600 text-center">
        ✓ Sem cartão de crédito • ✓ 100% Privado • ✓ Sem spam
      </p>
    </form>
  );
}
