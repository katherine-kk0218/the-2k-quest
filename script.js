/**
 * THE 2K QUEST - MOTOR DO RPG FINANCEIRO
 * Desenvolvido para sua "Tranquilidade Financeira"
 */

// 1. GERADOR DE ÁUDIO SINTÉTICO (Para evitar erros de bloqueio do navegador)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playEffect(frequency, duration, type = 'sine') {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

// 2. SISTEMA DE BANCO DE DADOS LOCAL (Salvamento Automático)
// Usamos uma chave única 'Quest2K_Data_Final_v1' para garantir que o save seja novo e limpo.
let dungeonData = JSON.parse(localStorage.getItem('Quest2K_Data_Final_v1')) || {
    saldo: 0,
    hp: 5,
    historico: []
};

// 3. ATUALIZAÇÃO DA INTERFACE (UI)
function atualizarUI() {
    // Atualiza os textos de HP e Saldo
    document.getElementById('hp-val').innerText = dungeonData.hp;
    document.getElementById('saldo-val').innerText = dungeonData.saldo;
    
    // Calcula e atualiza a barra de progresso (Meta de R$ 2.000,00)
    let porcentagem = Math.min((dungeonData.saldo / 2000) * 100, 100).toFixed(1);
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('label-progresso');
    
    if (progressBar) progressBar.style.width = porcentagem + "%";
    if (progressLabel) progressLabel.innerText = porcentagem + "%";

    // Atualiza a lista de histórico (últimos 3 depósitos)
    const listaHistorico = document.getElementById('lista-historico');
    if (listaHistorico) {
        listaHistorico.innerHTML = dungeonData.historico.slice(-3).reverse().map(item => `<li>• ${item}</li>`).join('');
    }

    // GRAVAÇÃO DEFINITIVA NO NAVEGADOR
    localStorage.setItem('Quest2K_Data_Final_v1', JSON.stringify(dungeonData));
}

// 4. LÓGICA DO DADO (Nova Tabela de Valores Equilibrada)
function rodarDado() {
    playEffect(300, 0.2, 'triangle'); // Som de clique
    const dado = Math.floor(Math.random() * 20) + 1;
    let valor = 0, dano = 0, mensagem = "";

    // Tabela de Encontros Variada (Eliminando a repetição do R$ 25)
    if (dado <= 3) { 
        valor = 15; dano = 1; 
        mensagem = "🩸 [ARMADILHA]: Você pisou em espinhos! <br> 💰 DEPOSITE: R$ 15,00";
    } else if (dado <= 8) { 
        valor = 30; dano = 0; 
        mensagem = "⚔️ [PATRULHA]: Orcs à vista! Você se escondeu bem. <br> 💰 DEPOSITE: R$ 30,00";
    } else if (dado <= 13) { 
        valor = 45; dano = 0; 
        mensagem = "⚖️ [MERCADOR]: Troque ouro por provisões. <br> 💰 DEPOSITE: R$ 45,00";
    } else if (dado <= 18) { 
        valor = 70; dano = 0; 
        mensagem = "🗝️ [COFRE]: Um baú pesado e trancado! <br> 💰 DEPOSITE: R$ 70,00";
    } else if (dado === 19) { 
        valor = 100; dano = 0; 
        mensagem = "🐲 [DRAGÃO]: Você pegou uma escama de ouro! <br> 💰 DEPOSITE: R$ 100,00";
    } else { // Dado 20
        valor = 150; dano = -5; // Recupera toda a vida
        mensagem = "👑 [BÊNÇÃO]: O Rei da Dungeon te abençoou! HP Restaurado. <br> 💰 DEPOSITE: R$ 150,00";
    }

    // Armazena a missão atual na memória temporária para confirmação
    window.missaoAtiva = { valor, dano, mensagem };

    // Atualiza o log do terminal
    const logTela = document.getElementById('log-sistema');
    logTela.innerHTML = `> [DADO]: Girou ${dado}!<br>> ${mensagem}`;
    
    // Troca os botões (Solução para o bug de elementos fantasmas)
    document.getElementById('btn-rodar').style.display = 'none';
    document.getElementById('btn-depositar').style.display = 'block';
}

// 5. CONFIRMAÇÃO DO DEPÓSITO
function confirmar() {
    playEffect(600, 0.3, 'sine'); // Som de moedas (agudo)
    
    // Processa os valores
    dungeonData.saldo += window.missaoAtiva.valor;
    
    if (window.missaoAtiva.dano === -5) {
        dungeonData.hp = 5; // Recuperação Total
    } else {
        dungeonData.hp -= window.missaoAtiva.dano;
    }

    // Registra no histórico com a data atual
    const dataAtual = new Date().toLocaleDateString();
    dungeonData.historico.push(`R$ ${window.missaoAtiva.valor} (${dataAtual})`);

    // Verifica se o jogador morreu
    if (dungeonData.hp <= 0) {
        document.getElementById('log-sistema').innerHTML = `> [STATUS]: VOCÊ CAIU! <br> ⛪ Pague o Dízimo de R$ 60,00 para ressuscitar.`;
        document.getElementById('btn-depositar').style.display = 'none';
        document.getElementById('btn-ressuscitar').style.display = 'block';
    } else {
        // Volta ao estado normal de rodar dado
        document.getElementById('btn-rodar').style.display = 'block';
        document.getElementById('btn-depositar').style.display = 'none';
        document.getElementById('log-sistema').innerHTML = `> [SISTEMA]: Depósito confirmado! Saldo e HP atualizados.`;
    }

    atualizarUI(); // Salva e atualiza a tela
}

// 6. RESSURREIÇÃO (Pagar Dízimo)
function ressuscitar() {
    playEffect(150, 0.5, 'square'); // Som grave de ressurreição
    dungeonData.saldo += 60;
    dungeonData.hp = 5;
    dungeonData.historico.push(`⛪ Ressurreição: + R$ 60,00`);
    
    document.getElementById('btn-ressuscitar').style.display = 'none';
    document.getElementById('btn-rodar').style.display = 'block';
    document.getElementById('log-sistema').innerHTML = `> [MESTRE]: Você voltou à vida! Não desperdice essa chance.`;
    
    atualizarUI(); // Salva e atualiza a tela
}

// 7. INICIALIZAÇÃO (Roda assim que a página abre)
window.onload = function() {
    atualizarUI();
    console.log("Dungeon Master carregado. Progresso recuperado.");
};
