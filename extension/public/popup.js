// HelpGames Extension - Popup Script v2.0
let selectedMinutes = 30;
let timerInterval = null;

// Elementos
const statusBadge = document.getElementById('statusBadge');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const timerDisplay = document.getElementById('timerDisplay');
const timerValue = document.getElementById('timerValue');
const mainBtn = document.getElementById('mainBtn');
const crisisBtn = document.getElementById('crisisBtn');
const sitesCount = document.getElementById('sitesCount');
const sitesCountFooter = document.getElementById('sitesCountFooter');
const attemptsCount = document.getElementById('attemptsCount');
const attemptsList = document.getElementById('attemptsList');
const durationBtns = document.querySelectorAll('.dur-btn');

// Selecção de duração
durationBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    durationBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedMinutes = parseInt(btn.dataset.minutes);
  });
});

// Botão principal
mainBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
    if (state && state.isBlocking) {
      // Desactivar
      chrome.runtime.sendMessage({ type: 'DEACTIVATE_BLOCKING' }, () => {
        refreshState();
      });
    } else {
      // Activar
      chrome.runtime.sendMessage({ type: 'ACTIVATE_BLOCKING', durationMinutes: selectedMinutes }, () => {
        refreshState();
      });
    }
  });
});

// Modo Crise
crisisBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'ACTIVATE_BLOCKING', durationMinutes: 60, crisisMode: true }, () => {
    refreshState();
  });
});

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  }
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
}

function updateTimer(remainingMs) {
  if (timerInterval) clearInterval(timerInterval);
  if (remainingMs <= 0) return;

  let remaining = remainingMs;
  timerValue.textContent = formatTime(remaining);
  timerDisplay.style.display = 'block';

  timerInterval = setInterval(() => {
    remaining -= 1000;
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerDisplay.style.display = 'none';
      refreshState();
      return;
    }
    timerValue.textContent = formatTime(remaining);
  }, 1000);
}

function refreshState() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, (state) => {
    if (!state) return;

    // Actualizar contagem de sites
    sitesCount.textContent = state.totalSites + '+';
    sitesCountFooter.textContent = state.totalSites + '+ sites';

    if (state.isBlocking) {
      const isCrisis = state.crisisMode;
      statusBadge.className = `status-badge ${isCrisis ? 'crisis' : 'active'}`;
      statusDot.className = `dot ${isCrisis ? 'crisis' : 'active'}`;
      statusText.textContent = isCrisis ? '🚨 Modo Crise Activo' : '🛡️ Bloqueio Activo';
      mainBtn.className = 'btn btn-danger';
      mainBtn.textContent = '⏹ Desactivar Bloqueio';
      document.getElementById('durationSelector').style.display = 'none';
      crisisBtn.style.display = 'none';
      timerValue.className = `timer ${isCrisis ? 'crisis' : ''}`;
      updateTimer(state.remaining);
    } else {
      statusBadge.className = 'status-badge inactive';
      statusDot.className = 'dot inactive';
      statusText.textContent = 'Bloqueio Inactivo';
      mainBtn.className = 'btn btn-primary';
      mainBtn.textContent = '🛡️ Activar Bloqueio';
      document.getElementById('durationSelector').style.display = 'flex';
      crisisBtn.style.display = 'block';
      timerDisplay.style.display = 'none';
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }
  });

  // Carregar tentativas
  chrome.runtime.sendMessage({ type: 'GET_ATTEMPTS' }, (result) => {
    if (!result || !result.attempts) return;
    const today = new Date().toDateString();
    const todayAttempts = result.attempts.filter(a => new Date(a.timestamp).toDateString() === today);
    attemptsCount.textContent = todayAttempts.length;

    if (result.attempts.length === 0) {
      attemptsList.innerHTML = '<div class="no-attempts">Nenhuma tentativa registada</div>';
      return;
    }

    const recent = result.attempts.slice(0, 5);
    attemptsList.innerHTML = recent.map(a => {
      const time = new Date(a.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return `<div class="attempt-item">
        <span class="attempt-domain">🚫 ${a.domain}</span>
        <span class="attempt-time">${time}</span>
      </div>`;
    }).join('');
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  refreshState();
});
