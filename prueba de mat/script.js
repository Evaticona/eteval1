let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 10;

const questions = generateQuestions(totalQuestions);

function generateQuestions(num) {
    const questions = [];
    for (let i = 0; i < num; i++) {
        const operation = Math.floor(Math.random() * 4);
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        let question = '';
        let answer = 0;

        switch (operation) {
            case 0: // Suma
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case 1: // Resta
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case 2: // Multiplicación
                question = `${num1} * ${num2}`;
                answer = num1 * num2;
                break;
            case 3: // División
                num1 = num2 * (Math.floor(Math.random() * 10) + 1); // Para que sea divisible
                question = `${num1} / ${num2}`;
                answer = num1 / num2;
                break;
        }

        questions.push({ question, answer, result: '' });
    }
    return questions;
}

function loadQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        document.getElementById('question-container').innerText = questions[currentQuestionIndex].question;
        document.getElementById('answer').value = '';
        document.getElementById('result').innerText = '';
        document.getElementById('next').style.display = 'none';
    } else {
        endGame();
    }
}

function endGame() {
    document.getElementById('game').style.display = 'none';
    document.getElementById('end-menu').style.display = 'block';
    document.getElementById('scoreValue').innerText = score;
    displayStarRating();
    showBalloons(); // Mostrar globos al final del juego
}

function displayStarRating() {
    const starRating = document.getElementById('star-rating');
    starRating.innerHTML = ''; // Limpiar contenido previo
    const stars = Math.round((score / totalQuestions) * 3); // Calcular estrellas

    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.innerHTML = i < stars ? '★' : '☆'; // Estrella llena o vacía
        star.classList.add('star');
        starRating.appendChild(star);
    }
}

function createBalloon() {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.left = Math.random() * 100 + 'vw'; // Posición horizontal aleatoria
    balloon.style.backgroundColor = getRandomColor(); // Color aleatorio
    balloon.style.width = (Math.random() * 30 + 40) + 'px'; // Ancho aleatorio
    balloon.style.height = (Math.random() * 40 + 60) + 'px'; // Alto aleatorio
    document.getElementById('balloon-container').appendChild(balloon);

    // Quitar el globo después de que flote
    setTimeout(() => {
        balloon.remove();
    }, 3000); // Eliminar el globo después de 3 segundos
}

function getRandomColor() {
    const colors = [
        '#ff5733', // Rojo
        '#33ff57', // Verde
        '#3357ff', // Azul
        '#f1c40f', // Amarillo
        '#8e44ad', // Púrpura
        '#e74c3c', // Rojo
        '#3498db', // Azul claro
        '#2ecc71', // Verde claro
        '#f39c12', // Naranja
        '#9b59b6'  // Púrpura claro
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showBalloons() {
    const balloonCount = 10; // Número de globos
    for (let i = 0; i < balloonCount; i++) {
        setTimeout(createBalloon, i * 300); // Crear globos con un intervalo más corto
    }
}

function updateUserScores() {
    const userScores = document.getElementById('user-scores');
    userScores.innerHTML = '<h2>Puntuaciones Guardadas</h2>';
    const keys = Object.keys(localStorage);
    
    if (keys.length === 0) {
        userScores.innerHTML += '<p>No hay puntuaciones guardadas.</p>';
    } else {
        keys.forEach(key => {
            const scoreData = JSON.parse(localStorage.getItem(key));
            userScores.innerHTML += `<p>${scoreData.name}: ${scoreData.score}</p>`;
        });
    }
}

document.getElementById('submit').addEventListener('click', function () {
    const answer = parseInt(document.getElementById('answer').value);
    if (answer === questions[currentQuestionIndex].answer) {
        score++;
        document.getElementById('result').innerText = '¡Correcto!';
        playSound('correct');
        animateCorrectAnswer();
    } else {
        document.getElementById('result').innerText = 'Incorrecto. La respuesta era: ' + questions[currentQuestionIndex].answer;
        playSound('incorrect');
        animateIncorrectAnswer();
    }
    document.getElementById('next').style.display = 'block';
});

function animateCorrectAnswer() {
    const container = document.querySelector('.container');
    container.classList.add('pulse'); // Agregar clase para animación
    setTimeout(() => {
        container.classList.remove('pulse'); // Remover después de 1 segundo
    }, 1000);
}

function animateIncorrectAnswer() {
    const container = document.querySelector('.container');
    container.style.backgroundColor = '#f44336'; // Cambiar color de fondo
    setTimeout(() => {
        container.style.backgroundColor = ''; // Remover color después de 1 segundo
    }, 1000);
}

function playSound(type) {
    const audio = new Audio(type === 'correct' ? 'correct.mp3' : 'incorrect.mp3');
    audio.play();
}

document.getElementById('next').addEventListener('click', function () {
    currentQuestionIndex++;
    loadQuestion();
});

// Funciones para el menú
document.getElementById('start-button').addEventListener('click', function () {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    loadQuestion();
});

// Funciones para el menú final
document.getElementById('restart-button').addEventListener('click', function () {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('end-menu').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
    updateUserScores();
});

document.getElementById('save-button').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    if (username) {
        const scoreData = {
            name: username,
            score: score
        };
        localStorage.setItem(username, JSON.stringify(scoreData));
        alert(`Puntuación guardada: ${username} - ${score}`);
        updateUserScores();
    } else {
        alert("Por favor, ingresa tu nombre.");
    }
});

// Mostrar u ocultar la lista de puntuaciones
document.getElementById('toggle-scores').addEventListener('click', function () {
    const userScores = document.getElementById('user-scores');
    if (userScores.style.display === 'none') {
        updateUserScores();
        userScores.style.display = 'block';
    } else {
        userScores.style.display = 'none';
    }
});

// Actualiza la lista de usuarios al cargar la página
updateUserScores();


