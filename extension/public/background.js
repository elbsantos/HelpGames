// HelpGames Extension - Background Service Worker

const BLOCKED_SITES = new Set([
    'bet365.com', 'betano.com.br', 'betfair.com', 'betsul.com.br',
    'betmotion.com', 'betclic.com.br', 'rivalo.com.br', 'dafabet.com',
    'parimatch.com.br', 'sportingbet.com', 'marathonbet.com', 'pinnacle.com',
    'betking.com', 'betwild.com', 'betpix.com', 'cassino.com',
    'pokerstars.com', 'partypoker.com', 'fulltilt.com', '888poker.com'
]);

// Interceptar requisições
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        const url = new URL(details.url);
        const domain = url.hostname.replace('www.', '');
        
        // Verificar se está bloqueado
        if (isBlocked(domain)) {
            chrome.storage.local.get(['blockingState'], (result) => {
                if (result.blockingState && result.blockingState.isBlocking) {
                    // Redirecionar para página de bloqueio
                    return {
                        redirectUrl: chrome.runtime.getURL('blocked.html?url=' + encodeURIComponent(details.url))
                    };
                }
            });
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

function isBlocked(domain) {
    // Verificar domínio exato
    if (BLOCKED_SITES.has(domain)) return true;
    
    // Verificar subdomínios
    for (let site of BLOCKED_SITES) {
        if (domain.endsWith('.' + site) || domain === site) {
            return true;
        }
    }
    
    return false;
}

// Listener para mensagens do content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'LOG_ATTEMPT') {
        // Registrar tentativa de acesso
        console.log('Tentativa de acesso bloqueada:', request.url);
    }
});
