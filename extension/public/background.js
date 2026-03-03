// HelpGames Extension - Background Service Worker (Manifest V3 - Corrigido)
// Lista completa de domínios de apostas - Portugal + Brasil + Internacional

const BLOCKED_DOMAINS = [
  // Brasil - Principais
  "bet365.com","betano.com.br","betano.com","betfair.com",
  "betsul.com.br","betsul.com","betmotion.com","betmotion.com.br",
  "betclic.com.br","betclic.com","rivalo.com.br","rivalo.com",
  "dafabet.com","parimatch.com.br","parimatch.com",
  "sportingbet.com","sportingbet.com.br",
  "betpix365.com","betpix.com","betpix.bet",
  "esportiva.bet","superbet.com.br","superbet.com",
  "vaidebet.com","vaidebet.bet","estrela.bet","estrelabet.com",
  "novibet.com.br","novibet.com","betsson.com","betsson.com.br",
  "unibet.com","unibet.com.br","1xbet.com","1xbet.com.br",
  "22bet.com","22bet.com.br","melbet.com","melbet.com.br",
  "mostbet.com","mostbet.com.br",
  "pin-up.bet","pinup.bet","pinup.com.br",
  "blaze.com","blaze.bet.br","blazewin.com",
  "brazino777.com","brazino777.bet",
  "cassino.com","cassino.bet",
  "pixbet.com","pixbet.bet",
  "betfast.com.br","betfast.bet",
  "betgol.com.br","betgol.bet",
  "betboo.com","betboo.com.br",
  "betway.com","betway.com.br",
  "bet7k.com","bet7k.bet",
  "betnacional.com","betnacional.bet",
  "betesporte.com","betesporte.bet",
  "segurobet.com","segurobet.bet",
  "apostaganha.com","apostaganha.bet",
  "br4bet.com","br4bet.bet",
  "realsbet.com","realsbet.bet",
  "sportsbet.io","sportsbet.com.br",
  "mrjackbet.com","galera.bet","galerabet.com",
  "f12.bet","f12bet.com","h2bet.com","h2bet.bet",
  "pagol.com.br","pagol.bet","onabet.com.br","onabet.bet",
  "kto.com","kto.bet","leovegas.com","leovegas.com.br",
  "betcris.com","betcris.com.br","codere.com.br","codere.bet",
  "bwin.com","bwin.com.br","williamhill.com","ladbrokes.com",
  "coral.co.uk","paddypower.com","skybet.com","betvictor.com",
  "888sport.com","888sport.com.br","bet-at-home.com","interwetten.com",
  "tipico.com","winamax.fr","marathonbet.com","pinnacle.com",
  "betking.com","betwild.com","bethard.com","nordicbet.com",
  "casumo.com","casumo.com.br",
  "888casino.com","888casino.com.br","888poker.com",
  "pokerstars.com","pokerstars.net","pokerstars.com.br",
  "partypoker.com","ggpoker.com","winamax.com","natural8.com",
  // Portugal
  "betclic.pt","bet.pt","solverde.pt","solverde.com",
  "casino.pt","placard.pt","placard.com",
  "betway.pt","bwin.pt","unibet.pt","sportingbet.pt",
  "betano.pt","moosh.pt","casino-estoril.pt","casino-lisboa.pt",
  "estorilsol.pt","luckia.pt","888casino.pt","leovegas.pt",
  "casumo.pt","bet365.pt","betsson.pt","nordicbet.pt",
  "betfair.pt","williamhill.pt","coral.pt","ladbrokes.pt",
  "paddypower.pt","skybet.pt","betvictor.pt","bet-at-home.pt",
  "interwetten.pt","tipico.pt","winamax.pt","bethard.pt",
  // Crypto apostas
  "stake.com","stake.us","rollbit.com","roobet.com",
  "duelbits.com","bc.game","cloudbet.com","nitrogen.sports",
  "betcoin.ag","1xbit.com","fortunejack.com","bitstarz.com",
  "mbitcasino.com","cryptowild.com","primedice.com",
  // E-sports
  "gg.bet","ggbet.com","loot.bet","thunderpick.com",
  "betspawn.com","rivalry.com","unikrn.com",
  // Fantasy sports
  "draftkings.com","fanduel.com","prizepicks.com",
  "betmgm.com","pointsbet.com","foxbet.com",
  // Cassinos online
  "slottica.com","jetspin.com","luckynugget.com",
  "jackpotcity.com","spinpalace.com","royalvegas.com",
  "platincasino.com","casinoroom.com","playmillion.com",
  "rizk.com","mrgreen.com","videoslots.com","casinoeuro.com",
  "thrills.com","guts.com","dunder.com","karamba.com",
  "slotsmillion.com","slotsmagic.com",
  "bovada.lv","betonline.ag","mybookie.ag","sportsbetting.ag",
];

const BLOCKED_SITES = new Set(BLOCKED_DOMAINS.map(d => d.toLowerCase().replace(/^www\./, "")));

let blockingState = {
  isBlocking: false,
  blockingStartTime: null,
  blockingDuration: 30 * 60 * 1000,
  crisisMode: false,
};

// Carregar estado ao iniciar
chrome.storage.local.get(["helpgames_blocking_state", "helpgames_extra_sites"], (result) => {
  if (result.helpgames_blocking_state) {
    blockingState = result.helpgames_blocking_state;
    if (blockingState.isBlocking && blockingState.blockingStartTime) {
      const elapsed = Date.now() - blockingState.blockingStartTime;
      if (elapsed >= blockingState.blockingDuration) {
        blockingState.isBlocking = false;
        blockingState.blockingStartTime = null;
        saveState();
      }
    }
  }
  if (result.helpgames_extra_sites && Array.isArray(result.helpgames_extra_sites)) {
    result.helpgames_extra_sites.forEach(s => BLOCKED_SITES.add(s.toLowerCase().replace(/^www\./, "")));
  }
});

function saveState() {
  chrome.storage.local.set({ helpgames_blocking_state: blockingState });
}

function isDomainBlocked(hostname) {
  const domain = hostname.toLowerCase().replace(/^www\./, "");
  if (BLOCKED_SITES.has(domain)) return true;
  const parts = domain.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");
    if (BLOCKED_SITES.has(parent)) return true;
  }
  return false;
}

function isBlockingActive() {
  if (!blockingState.isBlocking) return false;
  if (!blockingState.blockingStartTime) return false;
  const elapsed = Date.now() - blockingState.blockingStartTime;
  if (elapsed >= blockingState.blockingDuration) {
    blockingState.isBlocking = false;
    blockingState.blockingStartTime = null;
    saveState();
    return false;
  }
  return true;
}

// Interceptar via webNavigation (Manifest V3 - funciona correctamente)
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;
  try {
    const url = new URL(details.url);
    if (!["http:", "https:"].includes(url.protocol)) return;
    if (!isDomainBlocked(url.hostname)) return;
    if (!isBlockingActive()) return;

    // Registar tentativa
    chrome.storage.local.get(["helpgames_attempts"], (r) => {
      const attempts = r.helpgames_attempts || [];
      attempts.unshift({ url: details.url, domain: url.hostname, timestamp: Date.now() });
      chrome.storage.local.set({ helpgames_attempts: attempts.slice(0, 100) });
    });

    const blockedUrl = chrome.runtime.getURL(
      `blocked.html?url=${encodeURIComponent(details.url)}&domain=${encodeURIComponent(url.hostname)}`
    );
    chrome.tabs.update(details.tabId, { url: blockedUrl });
  } catch (e) {}
});

// Também via webRequest para cobertura máxima
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.type !== "main_frame") return {};
    try {
      const url = new URL(details.url);
      if (!isDomainBlocked(url.hostname)) return {};
      if (!isBlockingActive()) return {};
      return {
        redirectUrl: chrome.runtime.getURL(
          `blocked.html?url=${encodeURIComponent(details.url)}&domain=${encodeURIComponent(url.hostname)}`
        )
      };
    } catch (e) { return {}; }
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);

// Mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_STATE") {
    const active = isBlockingActive();
    const remaining = active && blockingState.blockingStartTime
      ? Math.max(0, blockingState.blockingDuration - (Date.now() - blockingState.blockingStartTime))
      : 0;
    sendResponse({ isBlocking: active, remaining, crisisMode: blockingState.crisisMode, totalSites: BLOCKED_SITES.size });
    return true;
  }
  if (request.type === "ACTIVATE_BLOCKING") {
    const durationMs = (request.durationMinutes || 30) * 60 * 1000;
    blockingState = { isBlocking: true, blockingStartTime: Date.now(), blockingDuration: durationMs, crisisMode: request.crisisMode || false };
    saveState();
    sendResponse({ success: true });
    return true;
  }
  if (request.type === "DEACTIVATE_BLOCKING") {
    blockingState.isBlocking = false;
    blockingState.blockingStartTime = null;
    blockingState.crisisMode = false;
    saveState();
    sendResponse({ success: true });
    return true;
  }
  if (request.type === "GET_ATTEMPTS") {
    chrome.storage.local.get(["helpgames_attempts"], (r) => {
      sendResponse({ attempts: r.helpgames_attempts || [] });
    });
    return true;
  }
  if (request.type === "SYNC_SITES") {
    if (request.sites && Array.isArray(request.sites)) {
      request.sites.forEach(s => BLOCKED_SITES.add(s.toLowerCase().replace(/^www\./, "")));
      chrome.storage.local.set({ helpgames_extra_sites: request.sites });
    }
    sendResponse({ success: true, totalSites: BLOCKED_SITES.size });
    return true;
  }
  if (request.type === "CHECK_DOMAIN") {
    sendResponse({ blocked: isDomainBlocked(request.domain) });
    return true;
  }
});

// Verificar expiração periodicamente
chrome.alarms.create("check_blocking_expiry", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "check_blocking_expiry") isBlockingActive();
});
