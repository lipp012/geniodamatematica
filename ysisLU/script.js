// script.js - Com telas de Game Over e Ranking funcionando

// BANCO DE DADOS DE QUESTÕES
const allQuestions = [
    { q: "Quanto é 5 + 3?", options: ["7", "8", "9", "10"], answer: 1 },
    { q: "Quanto é 2 + 2?", options: ["3", "4", "5", "6"], answer: 1 },
    { q: "Quanto é 10 - 4?", options: ["5", "6", "7", "8"], answer: 1 },
    { q: "Quanto é 3 × 2?", options: ["4", "5", "6", "7"], answer: 2 },
    { q: "Quanto é 8 ÷ 2?", options: ["2", "3", "4", "5"], answer: 2 },
    { q: "Qual é o dobro de 5?", options: ["8", "9", "10", "11"], answer: 2 },
    { q: "Qual é a metade de 10?", options: ["3", "4", "5", "6"], answer: 2 },
    { q: "Quantos lados tem um quadrado?", options: ["3", "4", "5", "6"], answer: 1 },
    { q: "Quantos lados tem um triângulo?", options: ["2", "3", "4", "5"], answer: 1 },
    { q: "Qual número vem depois de 9?", options: ["8", "9", "10", "11"], answer: 2 },
];

// Gerar mais perguntas
for(let i = 11; i <= 50; i++) {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    allQuestions.push({
        q: `Quanto é ${a} + ${b}?`,
        options: [`${a+b-1}`, `${a+b}`, `${a+b+1}`, `${a+b+2}`],
        answer: 1
    });
}

// VARIÁVEIS GLOBAIS
let gameQuestions = [];
let currentQuestionIndex = 0;
let startTime;
let timerInterval;
let playerName = "Anônimo";
let lives = 3;
let score = 0;

// FUNÇÃO PARA TROCAR DE TELA
function switchScreen(screenName) {
    console.log(`🔄 Indo para: ${screenName}`);
    
    // Lista de todas as telas
    const screens = [
        'start-screen',
        'game-screen', 
        'game-over-screen',
        'win-screen',
        'ranking-screen'
    ];
    
    // Esconder todas as telas
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('hidden');
        }
    });
    
    // Mostrar a tela solicitada
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        console.log(`✅ Mostrando: ${screenName}`);
    } else {
        console.error(`❌ Tela não encontrada: ${screenName}`);
    }
}

// FUNÇÃO PARA INICIAR O JOGO
function startGame() {
    console.log("🚀 Iniciando jogo...");
    
    // Pegar nome do jogador
    const nameInput = document.getElementById('player-name');
    if (nameInput && nameInput.value.trim()) {
        playerName = nameInput.value.trim().toUpperCase();
    } else {
        playerName = "ANÔNIMO";
    }
    
    // Resetar variáveis
    gameQuestions = shuffle([...allQuestions]).slice(0, 15);
    currentQuestionIndex = 0;
    lives = 3;
    score = 0;
    
    console.log(`👤 Jogador: ${playerName}`);
    
    // Atualizar vidas
    updateLivesDisplay();
    
    // Iniciar timer
    startTimer();
    
    // Mudar para tela do jogo
    switchScreen('game');
    
    // Carregar primeira pergunta
    loadQuestion();
}

// FUNÇÃO PARA CARREGAR PERGUNTA
function loadQuestion() {
    clearFloatingButtons();
    
    // Verificar se ainda tem perguntas
    if (currentQuestionIndex >= gameQuestions.length) {
        finishGame(true);
        return;
    }
    
    const currentQ = gameQuestions[currentQuestionIndex];
    
    // Atualizar número da pergunta
    const qNumElement = document.getElementById('q-num');
    if (qNumElement) {
        qNumElement.textContent = `${currentQuestionIndex + 1}/${gameQuestions.length}`;
    }
    
    // Atualizar texto da pergunta
    const questionElement = document.getElementById('question');
    if (questionElement) {
        questionElement.textContent = currentQ.q;
    }
    
    // Atualizar barra de progresso
    const progElement = document.getElementById('progress-fill');
    if (progElement) {
        const progress = (currentQuestionIndex / gameQuestions.length) * 100;
        progElement.style.width = `${progress}%`;
    }
    
    // Limpar opções anteriores
    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        // Criar botões para cada opção
        currentQ.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'btn btn-opt';
            button.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(button);
        });
    }
}

// FUNÇÃO PARA VERIFICAR RESPOSTA
function checkAnswer(selectedIndex) {
    const currentQ = gameQuestions[currentQuestionIndex];
    
    if (selectedIndex === currentQ.answer) {
        // Resposta correta
        score++;
        currentQuestionIndex++;
        
        // Efeito visual
        const buttons = document.querySelectorAll('.btn-opt');
        if (buttons[selectedIndex]) {
            buttons[selectedIndex].style.animation = 'bounce 0.5s';
        }
        
        if (currentQuestionIndex < gameQuestions.length) {
            setTimeout(loadQuestion, 500);
        } else {
            finishGame(true);
        }
    } else {
        // Resposta errada
        loseLife();
        
        // Efeito visual
        const buttons = document.querySelectorAll('.btn-opt');
        if (buttons[selectedIndex]) {
            buttons[selectedIndex].style.animation = 'shake 0.5s';
        }
    }
}

// FUNÇÃO PARA PERDER VIDA
function loseLife() {
    lives--;
    updateLivesDisplay();
    
    if (lives <= 0) {
        setTimeout(() => {
            finishGame(false);
        }, 1000);
    }
}

// FUNÇÃO PARA ATUALIZAR DISPLAY DE VIDAS
function updateLivesDisplay() {
    const livesContainer = document.getElementById('lives-container');
    if (!livesContainer) return;
    
    livesContainer.innerHTML = '';
    
    // Texto
    const livesText = document.createElement('span');
    livesText.textContent = '❤️ Vidas: ';
    livesText.style.fontWeight = 'bold';
    livesText.style.color = '#ff6b6b';
    livesContainer.appendChild(livesText);
    
    // Corações
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = 'life';
        if (i >= lives) {
            heart.classList.add('lost');
        }
        livesContainer.appendChild(heart);
    }
}

// FUNÇÃO PARA FINALIZAR O JOGO
function finishGame(win) {
    console.log(`🎯 Fim do jogo - Vitória: ${win}`);
    clearInterval(timerInterval);
    
    // Atualizar pontuação nas telas
    const finalScoreElement = document.getElementById('final-score');
    const winScoreElement = document.getElementById('win-score');
    const finalTimeElement = document.getElementById('final-time-display');
    const gameOverTimeElement = document.getElementById('game-over-time');
    const timeElement = document.getElementById('time-display');
    
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (winScoreElement) winScoreElement.textContent = score;
    
    const time = timeElement ? timeElement.textContent : '0';
    if (finalTimeElement) finalTimeElement.textContent = time;
    if (gameOverTimeElement) gameOverTimeElement.textContent = time;
    
    // Salvar no ranking
    saveScore();
    
    // Limpar botões flutuantes
    clearFloatingButtons();
    
    // Ir para tela correta
    if (win) {
        switchScreen('win');
    } else {
        switchScreen('game-over');
    }
}

// FUNÇÃO PARA SALVAR PONTUAÇÃO
function saveScore() {
    let ranking = JSON.parse(localStorage.getItem('genioRank200')) || [];
    const timeElement = document.getElementById('time-display');
    const finalTime = timeElement ? parseInt(timeElement.textContent) : 0;
    
    // Verificar se jogador já existe
    const existingIndex = ranking.findIndex(p => p.name === playerName);
    
    if (existingIndex !== -1) {
        // Atualizar se for melhor
        if (score > ranking[existingIndex].score || 
            (score === ranking[existingIndex].score && finalTime < ranking[existingIndex].time)) {
            ranking[existingIndex].score = score;
            ranking[existingIndex].time = finalTime;
        }
    } else {
        ranking.push({ name: playerName, score: score, time: finalTime });
    }
    
    // Ordenar
    ranking.sort((a, b) => b.score - a.score || a.time - b.time);
    
    // Manter top 10
    localStorage.setItem('genioRank200', JSON.stringify(ranking.slice(0, 10)));
}

// FUNÇÃO PARA MOSTRAR RANKING
function showRanking() {
    console.log("📊 Carregando ranking...");
    
    // Ir para tela de ranking
    switchScreen('ranking');
    
    // Carregar dados
    const ranking = JSON.parse(localStorage.getItem('genioRank200')) || [];
    const rankList = document.getElementById('ranking-list');
    
    if (!rankList) {
        console.error("❌ Elemento ranking-list não encontrado!");
        return;
    }
    
    if (ranking.length === 0) {
        rankList.innerHTML = '<li>Nenhum recorde ainda!</li>';
        return;
    }
    
    // Gerar lista
    rankList.innerHTML = ranking.map((player, index) => `
        <li class="${index === 0 ? 'top-player' : ''}">
            <span>${index + 1}. ${player.name}</span>
            <span>${player.score} pts / ${player.time}s</span>
        </li>
    `).join('');
    
    console.log(`✅ Ranking carregado: ${ranking.length} jogadores`);
}

// FUNÇÃO PARA EMBARALHAR
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// FUNÇÃO PARA INICIAR TIMER
function startTimer() {
    startTime = Date.now();
    clearInterval(timerInterval);
    
    const timeElement = document.getElementById('time-display');
    if (!timeElement) return;
    
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timeElement.textContent = elapsed;
    }, 1000);
}

// FUNÇÃO PARA LIMPAR BOTÕES FLUTUANTES
function clearFloatingButtons() {
    document.querySelectorAll('.sneaky-btn').forEach(btn => btn.remove());
}

// FUNÇÕES DE NAVEGAÇÃO (CHAMADAS PELO HTML)
function restartGame() {
    console.log("🔄 Reiniciando...");
    startGame();
}

function backToMenu() {
    console.log("🏠 Voltando ao menu...");
    switchScreen('start');
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM carregado!");
    
    // Configurar botões
    const startBtn = document.querySelector('.btn-start');
    const rankingBtn = document.querySelector('.btn-rank');
    const nameInput = document.getElementById('player-name');
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    if (rankingBtn) {
        rankingBtn.addEventListener('click', showRanking);
    }
    
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startGame();
            }
        });
        
        // Focar no input
        setTimeout(() => nameInput.focus(), 100);
    }
    
    // Garantir que estamos na tela inicial
    setTimeout(() => {
        switchScreen('start');
    }, 200);
    
    // Verificar se todos os elementos existem
    const requiredElements = [
        'start-screen', 'game-screen', 'game-over-screen', 
        'win-screen', 'ranking-screen', 'player-name',
        'time-display', 'q-num', 'question', 'progress-fill',
        'options-container', 'lives-container', 'final-score',
        'win-score', 'final-time-display', 'game-over-time',
        'ranking-list'
    ];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`⚠️ Elemento #${id} não encontrado`);
        }
    });
});