# 🧪 Guia de Testes - Extensão HelpGames

## Pré-requisitos

- Chrome ou Firefox instalado
- Extensão carregada em modo de desenvolvimento
- Backend HelpGames rodando em http://localhost:3000
- Usuário autenticado no HelpGames

## 1. Teste de Instalação

### Chrome
1. Abra `chrome://extensions/`
2. Ative "Modo de desenvolvedor"
3. Clique em "Carregar extensão sem empacotar"
4. Selecione a pasta `extension/public`
5. ✅ Extensão deve aparecer na lista

### Firefox
1. Abra `about:debugging#/runtime/this-firefox`
2. Clique em "Carregar extensão temporária"
3. Selecione `manifest.json` em `extension/public`
4. ✅ Extensão deve aparecer na lista

## 2. Teste de Interface (Popup)

### Verificações
- [ ] Ícone da extensão aparece na barra de ferramentas
- [ ] Clique no ícone abre popup
- [ ] Popup mostra:
  - [ ] Status "Extensão Ativa"
  - [ ] Contador "Bloqueios Hoje: 0"
  - [ ] Contador "Tempo Economizado: 0m"
  - [ ] Botão "Ativar Bloqueio" (branco)
  - [ ] Botão "🚨 Modo Crise" (vermelho)
  - [ ] Links de configurações (⚙️, ❓, 📊)

### Teste de Botões
1. Clique em "Ativar Bloqueio"
   - [ ] Botão muda para "Desativar Bloqueio"
   - [ ] Status muda para "Bloqueio Ativo"
   - [ ] Timer aparece mostrando "30:00"
   - [ ] Notificação aparece no navegador

2. Clique em "Desativar Bloqueio"
   - [ ] Botão volta para "Ativar Bloqueio"
   - [ ] Status volta para "Extensão Ativa"
   - [ ] Timer desaparece

## 3. Teste de Bloqueio de Sites

### Teste com Bet365
1. Ative bloqueio no popup
2. Abra nova aba
3. Digite `https://bet365.com`
4. ✅ Página de bloqueio deve aparecer com:
   - [ ] Ícone 🛡️
   - [ ] Título "Site Bloqueado"
   - [ ] URL bloqueada exibida
   - [ ] Timer mostrando "30:00"
   - [ ] Mensagem de apoio verde
   - [ ] Links para recursos
   - [ ] Botões "Ir para Dashboard" e "Preciso de Ajuda"

### Teste com Outros Sites
1. Tente acessar `https://google.com`
   - ✅ Deve carregar normalmente (não está na lista de bloqueio)

2. Tente acessar `https://betano.com.br`
   - ✅ Página de bloqueio deve aparecer

## 4. Teste de Timer

### Verificações
1. Ative bloqueio
2. Observe o timer no popup
   - [ ] Timer começa em 30:00
   - [ ] Decrementa a cada segundo
   - [ ] Mostra formato MM:SS

3. Aguarde 30 minutos (ou teste com duração menor)
   - [ ] Timer chega a 00:00
   - [ ] Bloqueio é desativado automaticamente
   - [ ] Status volta para "Extensão Ativa"

### Teste Rápido (sem esperar 30 min)
1. Modifique `CONFIG.BLOCKING_DURATION` em `popup.js` para `60000` (1 minuto)
2. Recarregue a extensão
3. Ative bloqueio
4. Aguarde 1 minuto
5. ✅ Bloqueio deve desativar automaticamente

## 5. Teste de Modo Crise

### Verificações
1. Clique em "🚨 Modo Crise"
   - [ ] Notificação aparece: "🚨 Modo Crise Ativado"
   - [ ] Timer mostra "01:00:00" (1 hora)
   - [ ] Bloqueio é ativado

2. Tente acessar site de apostas
   - [ ] Página de bloqueio aparece

3. Clique em "Desativar Bloqueio"
   - [ ] Bloqueio é desativado

## 6. Teste de Sincronização com Backend

### Verificações
1. Abra DevTools (F12)
2. Vá para aba "Network"
3. Ative bloqueio no popup
4. Verifique requisições:
   - [ ] POST para `/api/trpc/extension.logBlockingEvent`
   - [ ] Status 200 OK
   - [ ] Response contém `{"success": true}`

### Teste de Tentativas Bloqueadas
1. Ative bloqueio
2. Tente acessar `https://bet365.com`
3. Verifique requisições:
   - [ ] POST para `/api/blocking/log-attempt`
   - [ ] URL está no body da requisição

## 7. Teste de Persistência (Storage)

### Verificações
1. Ative bloqueio
2. Abra DevTools → Application → Local Storage
3. Procure por chave `blockingState`
   - [ ] Deve conter `isBlocking: true`
   - [ ] Deve conter `blockingDuration: 1800000`

4. Recarregue a página
5. Abra popup
   - [ ] Bloqueio ainda está ativo
   - [ ] Timer continua de onde parou

## 8. Teste de Página de Bloqueio

### Verificações
1. Ative bloqueio
2. Acesse site bloqueado
3. Página de bloqueio deve ter:
   - [ ] Design profissional com gradiente
   - [ ] Mensagem de apoio
   - [ ] Timer visual
   - [ ] Links para recursos (4 links)
   - [ ] Botão "Ir para Dashboard"
   - [ ] Botão "Preciso de Ajuda"

### Teste de Botões
1. Clique em "Ir para Dashboard"
   - [ ] Abre https://helpgames.com.br/dashboard

2. Clique em "Preciso de Ajuda"
   - [ ] Abre https://helpgames.com.br/modo-crise

3. Clique em links de recursos
   - [ ] Cada link abre página correspondente

## 9. Teste de Notificações

### Verificações
1. Ative bloqueio
   - [ ] Notificação do navegador aparece
   - [ ] Título: "HelpGames - Bloqueador de Apostas"
   - [ ] Mensagem: "Bloqueio de 30 minutos ativado"

2. Ative Modo Crise
   - [ ] Notificação diferente aparece
   - [ ] Mensagem: "Modo Crise Ativado"

## 10. Teste de Responsividade

### Popup em Diferentes Tamanhos
- [ ] Popup em resolução 1920x1080
- [ ] Popup em resolução 1366x768
- [ ] Popup em resolução 768x1024 (tablet)

### Página de Bloqueio em Diferentes Tamanhos
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 11. Teste de Performance

### Verificações
1. Ative bloqueio
2. Abra DevTools → Performance
3. Grave 10 segundos
4. Verifique:
   - [ ] FPS > 60
   - [ ] Memory < 50MB
   - [ ] CPU < 5%

## 12. Teste de Segurança

### Verificações
1. Verifique que token JWT é enviado
   - [ ] Headers contêm `Authorization: Bearer <token>`

2. Verifique que dados sensíveis não são logados
   - [ ] Console não mostra tokens
   - [ ] Network não mostra senhas

3. Verifique que HTTPS é usado
   - [ ] Todas as requisições são HTTPS
   - [ ] Sem avisos de segurança

## 13. Teste de Compatibilidade

### Chrome
- [ ] Versão 90+
- [ ] Manifest v3 funciona
- [ ] Todas as permissões são concedidas

### Firefox
- [ ] Versão 88+
- [ ] Manifest v2/v3 funciona
- [ ] Todas as permissões são concedidas

## 14. Teste de Casos Extremos

### Múltiplas Abas
1. Ative bloqueio
2. Abra 5 abas
3. Tente acessar sites bloqueados em cada aba
   - [ ] Todas mostram página de bloqueio

### Múltiplas Extensões
1. Instale outra extensão
2. Verifique que não há conflitos
   - [ ] Ambas funcionam normalmente

### Bloqueio Consecutivo
1. Ative bloqueio (30 min)
2. Desative após 5 segundos
3. Ative novamente
   - [ ] Novo timer começa em 30:00

## 15. Teste de Relatório

### Checklist Final
- [ ] Todos os testes passaram
- [ ] Sem erros no console
- [ ] Sem warnings no console
- [ ] Performance aceitável
- [ ] UI responsiva
- [ ] Sincronização com backend funcionando
- [ ] Notificações funcionando
- [ ] Bloqueio funcionando
- [ ] Timer funcionando
- [ ] Storage funcionando

## Bugs Encontrados

Documente aqui qualquer bug encontrado:

```
Bug #1: [Descrição]
- Passos para reproduzir: 
- Resultado esperado:
- Resultado atual:
- Severidade: [Crítica/Alta/Média/Baixa]
```

## Notas

- Extensão está em fase de desenvolvimento
- Alguns recursos podem não estar 100% funcionais
- Feedback é bem-vindo!
