// HelpGames Extension - Popup Script
const CONFIG = {
    BLOCKING_DURATION: 30 * 60 * 1000, // 30 minutos
    CRISIS_DURATION: 60 * 60 * 1000,   // 1 hora
};

let isBlocking = false;
let blockingStartTime = null;
let timerInterval = null;

// Elementos do DOM
const statusText = document.getElementById('statusText');
const toggleBtn = document.getElementById('toggleBlockingBtn');
const crisisBtn = document.getElementById('crisisModeBtn');
const timerContainer = document.getElementById('timerContainer');
const timerValue = document.getElementById('timerValue');
const blocksToday = document.getElementById('blocksToday');
const timeSaved = document.getElementById('timeSaved');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateUI();
    toggleBtn.addEventListener('click', toggleBlocking);
    crisisBtn.addEventListener('click', activateCrisisMode);
});

function toggleBlocking() {
    if (isBlocking) {
        deactivateBlocking();
    } else {
        activateBlocking();
    }
}

function activateBlocking() {
    isBlocking = true;
    blockingStartTime = Date.now();
    saveState();
    updateUI();
    startTimer();
    showNotification('Bloqueio Ativado', 'Bloqueio de 30 minutos ativado');
}

function deactivateBlocking() {
    isBlocking = false;
    blockingStartTime = null;
    saveState();
    updateUI();
    stopTimer();
}

function activateCrisisMode() {
    isBlocking = true;
    blockingStartTime = Date.now();
    saveState();
    updateUI();
    startTimer(CONFIG.CRISIS_DURATION);
    showNotification('🚨 Modo Crise', 'Modo Crise ativado - 1 hora de proteção');
}

function startTimer(duration = CONFIG.BLOCKING_DURATION) {
    if (timerInterval) clearInterval(timerInterval);
    
    timerContainer.style.display = 'block';
    
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - blockingStartTime;
        const remaining = Math.max(0, duration - elapsed);
        
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        timerValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (remaining === 0) {
            deactivateBlocking();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerContainer.style.display = 'none';
}

function updateUI() {
    if (isBlocking) {
        statusText.textContent = 'Bloqueio Ativo';
        statusText.classList.add('active');
        toggleBtn.textContent = 'Desativar Bloqueio';
        toggleBtn.classList.add('active');
    } else {
        statusText.textContent = 'Extensão Ativa';
        statusText.classList.remove('active');
        toggleBtn.textContent = 'Ativar Bloqueio';
        toggleBtn.classList.remove('active');
    }
}

function saveState() {
    chrome.storage.local.set({
        blockingState: {
            isBlocking,
            blockingStartTime,
        }
    });
}

function loadState() {
    chrome.storage.local.get(['blockingState'], (result) => {
        if (result.blockingState) {
            isBlocking = result.blockingState.isBlocking;
            blockingStartTime = result.blockingState.blockingStartTime;
            
            if (isBlocking && blockingStartTime) {
                const elapsed = Date.now() - blockingStartTime;
                if (elapsed < CONFIG.BLOCKING_DURATION) {
                    startTimer();
                } else {
                    deactivateBlocking();
                }
            }
        }
    });
}

function showNotification(title, message) {
    if (chrome.notifications) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect fill="%23059669" width="128" height="128" rx="12"/><text x="64" y="80" text-anchor="middle" font-size="60" fill="white" font-weight="bold">HG</text></svg>',
            title: title,
            message: message,
        });
    }
}
