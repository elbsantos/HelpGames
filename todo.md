# HelpGames - TODO do Projeto

## Autenticação e Usuários
- [x] Sistema de autenticação via Manus OAuth (já configurado no scaffold)
- [x] Página de login com redirecionamento
- [x] Página de perfil do usuário

## Perfil Financeiro
- [x] Modelo de dados para perfil financeiro (renda, despesas fixas)
- [x] Formulário de cadastro/edição de perfil financeiro
- [x] Cálculo automático de verba de lazer segura (regra 50-30-20)
- [x] Exibição de resumo financeiro no dashboard
- [x] CORREÇÃO: Distribuição 3:2 (Lazer:Poupança) em TODOS os cenários
- [x] CORREÇÃO: Eliminar categoria "Outros" - usar apenas Necessidades, Lazer, Poupança
- [x] CORREÇÃO: Alerta quando Despesas Fixas > 50% da Renda
- [x] CORREÇÃO: Validar soma = 100% da Renda em todos os cenários

## Registro de Apostas Evitadas
- [x] Modelo de dados para apostas evitadas (data, valor, contexto emocional)
- [x] Formulário de registro rápido de aposta evitada
- [x] Listagem de histórico de apostas evitadas
- [x] Cálculo de dinheiro total preservado

## Dashboard Principal
- [x] Layout do dashboard com estatísticas principais
- [x] Card de dinheiro total preservado
- [x] Card de dias sem apostar (streak)
- [x] Visualização de progresso das metas
- [ ] Gráfico de evolução temporal (economia acumulada)

## Sistema de Metas Pessoais
- [x] Modelo de dados para metas (item desejado, valor, imagem)
- [x] Formulário de cadastro de meta
- [x] Visualização de progresso percentual da meta
- [x] Barra de progresso visual com gradiente
- [x] Celebração ao atingir meta

## Alertas de Choque de Realidade
- [x] Cálculo de impacto percentual em relação à verba de lazer
- [x] Modal/alerta contextualizado ao registrar aposta
- [x] Mensagens personalizadas baseadas no impacto

## Modo Crise
- [x] Modelo de dados para mensagens personalizadas do usuário
- [x] Botão de emergência fixo/acessível
- [x] Modal de modo crise com mensagem personalizada
- [ ] Timer de 15 minutos de bloqueio/reflexão
- [x] Integração com exercícios de respiração

## Exercícios de Respiração
- [x] Componente de exercício de respiração guiado
- [x] Animação visual (círculo expandindo/contraindo)
- [x] Instruções de inspirar/segurar/expirar
- [x] Timer configurável (padrão: 4-7-8)

## Lista de Sites de Apostas
- [ ] Página informativa com lista de sites de apostas comuns no Brasil
- [ ] Categorização por tipo (esportes, cassino, etc.)
- [ ] Alertas educativos sobre riscos

## Estatísticas e Gráficos
- [ ] Gráfico de linha: economia acumulada ao longo do tempo
- [ ] Gráfico de barras: apostas evitadas por semana/mês
- [ ] Estatística de dias consecutivos sem apostar
- [ ] Comparativo: dinheiro preservado vs. dinheiro que seria perdido

## Design e UX
- [x] Escolha de paleta de cores elegante e confiável
- [x] Tipografia refinada (Google Fonts)
- [x] Tema visual consistente (light theme com tons suaves)
- [x] Animações sutis e transições suaves
- [x] Responsividade mobile-first
- [x] Ícones apropriados (lucide-react)

## Testes
- [x] Testes unitários para procedures críticos (perfil financeiro, cálculos)
- [x] Testes de integração para fluxo de registro de aposta
- [x] Testes de validação de formulários
- [x] Testes de cálculo de metas e progresso

## Documentação e Entrega
- [ ] README atualizado com instruções de uso
- [ ] Checkpoint final criado
- [ ] Apresentação ao usuário com guia de funcionalidades
