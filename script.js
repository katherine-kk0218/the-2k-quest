const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(f, d) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = f; o.connect(g); g.connect(audioCtx.destination);
    o.start(); g.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + d);
    o.stop(audioCtx.currentTime + d);
}

let dungeonData = JSON.parse(localStorage.getItem('Quest2K_Data_V4')) || {
    saldo: 0, hp: 5, logs: []
};

const logElement = document.getElementById('log-sistema');

function updateUI() {
    document.getElementById('hp-val').innerText = dungeonData.hp;
    document.getElementById('saldo-val').innerText = dungeonData.saldo;
    const progress = Math.min((dungeonData.saldo / 2000) * 100, 100).toFixed(1);
    document.getElementById('progress-bar').style.width = progress + "%";
    document.getElementById('label-progresso').innerText = progress + "%";
    document.getElementById('lista-historico').innerHTML = dungeonData.logs.slice(-3).reverse().map(l => `<li>${l}</li>`).join('');
    localStorage.setItem('Quest2K_Data_V4', JSON.stringify(dungeonData));
}

function rodarDado() {
    playSound(260, 0.2);
    const roll = Math.floor(Math.random() * 20) + 1;
    let v = 25, h = 0, txt = "[EXPLORAÇÃO]: Caminho seguro. <br> 💰 MISSÃO: Deposite R$ 25,00.";

    if (roll <= 5) { v = 10; h = 1; txt = "[EMBOSCADA]: Goblins atacaram! -1 HP. <br> 💰 MISSÃO: Deposite R$ 10,00."; }
    else if (roll >= 16 && roll <= 19) { v = 50; txt = "[BAÚ]: Você achou um tesouro! <br> 💰 MISSÃO: Deposite R$ 50,00."; }
    else if (roll === 20) { v = 80; h = -5; txt = "[CRÍTICO]: Sorte divina! Vida restaurada. <br> 💰 MISSÃO: Deposite R$ 80,00."; }

    window.activeQuest = { value: v, damage: h };
    logElement.innerHTML = `> [DADO]: Girou ${roll}!<br>> ${txt}`;
    document.getElementById('btn-rodar').classList.add('hidden');
    document.getElementById('btn-depositar').classList.remove('hidden');
}

function confirmar() {
    playSound(400, 0.2);
    dungeonData.saldo += window.activeQuest.value;
    if (window.activeQuest.damage === -5) dungeonData.hp = 5;
    else dungeonData.hp -= window.activeQuest.damage;

    dungeonData.logs.push(`+ R$ ${window.activeQuest.value} (${new Date().toLocaleDateString()})`);

    if (dungeonData.hp <= 0) {
        logElement.innerHTML = `> [SISTEMA]: GAME OVER! HP esgotado. <br> ⛪ Pague o Dízimo de R$ 60,00 para voltar.`;
        document.getElementById('btn-depositar').classList.add('hidden');
        document.getElementById('btn-ressuscitar').classList.remove('hidden');
    } else {
        document.getElementById('btn-depositar').classList.add('hidden');
        document.getElementById('btn-rodar').classList.remove('hidden');
        logElement.innerHTML = `> [SISTEMA]: Depósito confirmado!`;
    }
    updateUI();
}

function ressuscitar() {
    dungeonData.saldo += 60;
    dungeonData.hp = 5;
    document.getElementById('btn-ressuscitar').classList.add('hidden');
    document.getElementById('btn-rodar').classList.remove('hidden');
    updateUI();
}

updateUI();