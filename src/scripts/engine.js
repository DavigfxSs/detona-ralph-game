const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector("#lives"), // Elemento para mostrar as vidas
        difficultyButtons: document.querySelectorAll('.game-button'), // Selecionando os botões de dificuldade
    },
    values: {
        timerId: null,
        countdownId: null,
        gameVelocity: 1000,
        currentTime: 60, // Tempo total do jogo
        score: 0,        // Pontuação do jogador
        lives: 3,        // Vidas do jogador
        currentEnemyIndex: -1, // Índice do quadrado onde o inimigo está
    },
};

// Função que ajusta a velocidade do jogo com base no botão clicado
function changeGameVelocity(velocity) {
    state.values.gameVelocity = velocity;
    resetGame(); // Reinicia o jogo com a nova velocidade
}

// Função para adicionar eventos de clique aos botões de dificuldade
function addDifficultyButtonListeners() {
    state.view.difficultyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.classList.contains("button1")) {
                changeGameVelocity(1000); // Velocidade normal
            } else if (button.classList.contains("button2")) {
                changeGameVelocity(750); // Velocidade mais rápida
            } else if (button.classList.contains("button3")) {
                changeGameVelocity(500); // Velocidade ainda mais rápida
            }
        });
    });
}

// Função de contagem regressiva
function countdown() {
    // Diminui o tempo em 1 a cada segundo
    state.values.currentTime--;

    // Atualiza o tempo restante na interface
    state.view.timeLeft.textContent = state.values.currentTime;

    // Verifica se o tempo acabou
    if (state.values.currentTime <= 0) {
        clearInterval(state.values.timerId); // Para o movimento do inimigo
        clearInterval(state.values.countdownId); // Para o contador
        alert(`Game Over! O seu resultado foi: ${state.values.score}`);
        resetGame(); // Reinicia o jogo após o alerta
    }
}

// Função para tocar o som do jogo
function playSound() {
    // Toca a música do game
    let audio = new Audio("./src/sounds/hit.m4a");
    audio.volume = 0.1;
    audio.play();
}

// Função para tocar o som de erro
function playErrorSound() {
    // Toca um som quando o jogador erra
    let audio = new Audio("./src/sounds/error.m4a"); // Caminho do som de erro
    audio.volume = 0.1;
    audio.play();
}

// Função para escolher um quadrado aleatório para o inimigo
function randomSquare() {
    // Remove a classe "enemy" de todos os quadrados
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    // Escolhe um quadrado aleatório e adiciona a classe "enemy"
    let randomNumber = Math.floor(Math.random() * state.view.squares.length);
    state.values.currentEnemyIndex = randomNumber; // Armazena o índice do quadrado do inimigo
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
}

// Função para mover o inimigo
function moveEnemy() {
    // Para garantir que não existam múltiplos intervalos
    clearInterval(state.values.timerId);

    // Define o intervalo para movimentar o inimigo
    state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// Função para adicionar listeners de clique nos quadrados
function addListenerHitBox() {
    // Adiciona um listener de clique a cada quadrado
    state.view.squares.forEach((square, index) => {
        square.addEventListener("click", () => {
            // Verifica se o quadrado clicado é o do inimigo
            if (index === state.values.currentEnemyIndex) {
                playSound();
                // Remove a classe "enemy" do quadrado clicado
                square.classList.remove("enemy");

                // Incrementa a pontuação no estado
                state.values.score += 1;

                // Atualiza a pontuação na interface
                state.view.score.textContent = state.values.score;
            } else {
                // Caso o usuário clique no quadrado errado, perde uma vida
                state.values.lives--;

                // Toca o som de erro
                playErrorSound();

                // Atualiza a interface de vidas apenas com o número
                state.view.lives.textContent = `x${state.values.lives}`;

                // Verifica se o jogador perdeu todas as vidas
                if (state.values.lives <= 0) {
                    clearInterval(state.values.timerId); // Para o movimento do inimigo
                    clearInterval(state.values.countdownId); // Para o contador
                    alert(`Game Over! O seu resultado foi: ${state.values.score}`);
                    resetGame(); // Reinicia o jogo após o alerta
                }
            }
        });
    });
}

// Função para resetar o jogo
function resetGame() {
    // Limpa os intervalos para garantir que o jogo não continue
    clearInterval(state.values.timerId);
    clearInterval(state.values.countdownId);

    // Redefine os valores do jogo
    state.values.currentTime = 60;
    state.values.score = 0;
    state.values.lives = 3;
    state.values.currentEnemyIndex = -1; // Reseta o índice do inimigo

    // Atualiza os elementos visuais
    state.view.timeLeft.textContent = state.values.currentTime;
    state.view.score.textContent = state.values.score;
    state.view.lives.textContent = `x${state.values.lives}`; // Exibe as vidas apenas com "x3"

    // Aguarda um tempo antes de reiniciar o jogo
    setTimeout(() => {
        initialize();
    }, 500); // Aguarda 500ms para reiniciar o jogo
}

// Função para inicializar o jogo
function initialize() {
    // Verifica se os quadrados foram carregados no DOM
    if (!state.view.squares.length) {
        console.error("Nenhum elemento com a classe '.square' encontrado.");
        return;
    }

    // Inicia o movimento do inimigo
    moveEnemy();

    // Adiciona os listeners para detectar cliques nos quadrados
    addListenerHitBox();

    // Inicia o contador de tempo
    state.values.countdownId = setInterval(countdown, 1000);

    // Atualiza o tempo restante na interface no início
    state.view.timeLeft.textContent = state.values.currentTime;

    console.log("Jogo iniciado!");
}

// Chama a função de inicialização
initialize();

// Chama a função para adicionar os listeners aos botões de dificuldade
addDifficultyButtonListeners();
