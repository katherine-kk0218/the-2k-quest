// Sistema de Salvamento Blindado
let dungeonData = JSON.parse(localStorage.getItem('Quest2K_Data_Final')) || {
    saldo: 0,
    hp: 5
};

function salvar() {
    localStorage.setItem('Quest2K_Data_Final', JSON.stringify(dungeonData));
    atualizarUI();
}

function atualizarUI() {
    document.getElementById('hp-val').innerText = dungeonData.hp;
    document.getElementById('saldo-val').innerText = dungeonData.saldo;
    
    let progresso = Math.min((dungeonData.saldo / 2000) * 100, 100).toFixed(1);
    document.getElementById('progress-bar').style.width = progresso + "%";
    document.getElementById('label-progresso').innerText = progresso + "%";
}

function rodarDado() {
    const d = Math.floor(Math.random() * 20) + 1;
    let v = 0, h = 0, msg = "";

    // NOVA TABELA EQUILIBRADA
    if (d <= 4) { // 20% de chance
        v = 10; h = 1; msg = "[EMBOSCADA]: Goblins roubaram suas provisões! -1 HP. <br> 💰 DEPOSITE: R$ 10,00";
    } else if (d <= 10) { // 30% de chance
        v = 25; h = 0; msg = "[EXPLORAÇÃO]: Dia tranquilo de caminhada. <br> 💰 DEPOSITE: R$ 25,00";
    } else if (d <= 17) { // 35% de chance
        v = 50; h = 0; msg = "[TESOURO]: Você encontrou um baú de prata! <br> 💰 DEPOSITE: R$ 50,00";
    } else { // 15% de chance (18, 19, 20)
        v = 80; h = -5; msg = "[RELÍQUIA]: Sorte divina! Recuperou toda sua vida. <br> 💰 DEPOSITE: R$ 80,00";
    }

    window.missaoAtiva = { v, h };
    document.getElementById('log-sistema').innerHTML = `> [DADO]: Girou ${d}!<br>> ${msg}`;
    
    document.getElementById('btn-rodar').style.display = 'none';
    document.getElementById('btn-depositar').style.display = 'block';
}

function confirmar() {
    dungeonData.saldo += window.missaoAtiva.v;
    
    if (window.missaoAtiva.h === -5) dungeonData.hp = 5;
    else dungeonData.hp -= window.missaoAtiva.h;

    if (dungeonData.hp <= 0) {
        document.getElementById('log-sistema').innerHTML = "> [SISTEMA]: Você CAIU! <br> ⛪ Pague o dízimo de R$ 60 para ressuscitar.";
        document.getElementById('btn-depositar').style.display = 'none';
        document.getElementById('btn-ressuscitar').style.display = 'block';
    } else {
        document.getElementById('btn-rodar').style.display = 'block';
        document.getElementById('btn-depositar').style.display = 'none';
        document.getElementById('log-sistema').innerHTML = "> [SISTEMA]: Depósito gravado na Dungeon!";
    }
    salvar(); // Salva logo após a ação
}

function ressuscitar() {
    dungeonData.saldo += 60;
    dungeonData.hp = 5;
    document.getElementById('btn-ressuscitar').style.display = 'none';
    document.getElementById('btn-rodar').style.display = 'block';
    document.getElementById('log-sistema').innerHTML = "> [SISTEMA]: Você voltou à vida!";
    salvar();
}

// Inicializa a tela ao abrir
window.onload = atualizarUI;
