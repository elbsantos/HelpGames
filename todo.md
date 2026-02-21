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

## Bloqueio de Bets (Novo)
- [x] Modelo de dados para bloqueio temporário (tabela bets_blockages)
- [x] Procedimento tRPC para ativar bloqueio (30 minutos)
- [x] Procedimento tRPC para verificar status de bloqueio
- [x] Botão "Bloquear Bets" no Dashboard (ao lado do "Modo Crise")
- [x] Mensagem de sucesso ao ativar bloqueio
- [x] Timer visual mostrando tempo restante do bloqueio
- [x] Integração com banco de dados

## Ajustes de UI
- [x] Mover botão "Bloquear Bets" para header ao lado do "Modo Crise"
- [x] Aplicar cor vermelha (destructive) ao botão "Bloquear Bets"
- [x] Remover botão de bloqueio da seção "Ações Rápidas" do Dashboard

## Correção de TypeScript
- [x] Corrigir erros de type annotations em RegistrarTentativaAposta.tsx (error, site, hobby)

## Correção de Colisão tRPC
- [x] Corrigir caminho de import em frontend/src/lib/trpc.ts
- [x] Corrigir nomes de propriedades em RegistrarTentativaAposta.tsx
- [x] Corrigir caminho de import em imageGeneration.ts
- [x] Eliminar todos os erros de TypeScript (48 → 0 erros)

## Campo de Apostas do Mês Atual
- [x] Adicionar coluna gasto_apostas_mes_atual ao schema (bettingSpentThisMonth + lastResetDate)
- [x] Atualizar funções de banco de dados (addBettingSpending, getBettingSpentThisMonth, resetBettingSpendingIfNeeded)
- [x] Atualizar frontend para usar novo campo (RegistrarTentativaAposta.tsx)

## Integração de Rastreamento de Gastos
- [x] Atualizar procedimento tRPC gambling.registerAccessAttempt para chamar addBettingSpending
- [x] Atualizar frontend para invalidar cache e exibir gastos atualizados
- [x] Testar fluxo completo de registro e rastreamento

## Alertas de Limite Mensal
- [x] Criar componente de alerta para limite próximo
- [x] Adicionar lógica de cálculo de percentual de uso (80%+ amarelo, 95%+ vermelho)
- [x] Integrar alerta em RegistrarTentativaAposta com barra de progresso

## Histórico de Bloqueios
- [x] Criar procedimento tRPC para obter histórico de bloqueios (getHistory, getStats)
- [x] Criar página HistoricoBloqueios.tsx com estatísticas e lista
- [x] Adicionar rota e navegação no App.tsx e Dashboard

## Notificações por Email
- [x] Adicionar coluna de email notificado ao schema (notifiedAt80Percent, notifiedAt95Percent)
- [x] Criar função para enviar email de alerta (sendLimitAlertEmail, resetMonthlyNotifications)
- [x] Integrar envio de email ao registrar apostas (addBettingSpending)

## Gráfico de Evolução Temporal
- [x] Criar procedimento tRPC para obter dados de evolução (getTemporalEvolutionData)
- [x] Criar componente de gráfico com Recharts (TemporalEvolutionChart)
- [x] Integrar gráfico no Dashboard com dados em tempo real

## Página Informativa sobre Sites de Apostas
- [x] Criar dados de 6 categorias de sites de apostas (Esportes, Cassino, Pôquer, Loterias, Bingo, Fantasy Sports)
- [x] Criar página SitesApostas.tsx com cards informativos (riscos, sinais de alerta)
- [x] Adicionar rota /sites-apostas e link no Dashboard

## Notificações Push no Navegador
- [x] Criar hook customizado para notificações push (usePushNotification)
- [x] Integrar notificações ao registrar apostas (80% e 95%)
- [x] Integrar notificações ao bloquear bets

## Quiz de Autoavaliação
- [x] Criar página QuizAutoavaliacao.tsx com 10 perguntas
- [x] Implementar lógica de cálculo de score e 4 níveis de risco (baixo, leve, moderado, severo)
- [x] Adicionar rota /quiz-autoavaliacao e card no Dashboard

## Página de Recursos de Ajuda
- [x] Criar página RecursosAjuda.tsx com 6 organizações internacionais e brasileiras
- [x] Adicionar cards com informações de contato, horários e links diretos
- [x] Adicionar rota /recursos-ajuda e card rosa no Dashboard
