// HelpGames Extension - Content Script
// Executa no contexto de cada página

console.log('HelpGames Content Script carregado');

// Verificar se página está bloqueada
const urlParams = new URLSearchParams(window.location.search);
const blockedUrl = urlParams.get('url');

if (blockedUrl) {
    // Notificar background script
    chrome.runtime.sendMessage({
        type: 'LOG_ATTEMPT',
        url: blockedUrl
    });
}
