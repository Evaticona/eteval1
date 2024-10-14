const ejercicios = [
    { piezas: ["2", "+", "3", "=", "5"], solucion: "5" },
    { piezas: ["1", "+", "4", "=", "5"], solucion: "5" },
    { piezas: ["6", "-", "2", "=", "4"], solucion: "4" },
    { piezas: ["8", "-", "3", "=", "5"], solucion: "5" },
    { piezas: ["5", "+", "7", "=", "12"], solucion: "12" }
];

let ejercicioActual;
let piezas = [];
let emptyPieceIndex = 0;
let ejerciciosDesordenados = [];

// Función para mezclar el array
function mezclarEjercicios(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Inicializar las piezas
function inicializarPiezas() {
    if (ejerciciosDesordenados.length === 0) {
        ejerciciosDesordenados = mezclarEjercicios([...ejercicios]);
    }

    ejercicioActual = ejerciciosDesordenados.pop();
    piezas = ejercicioActual.piezas.map((texto, index) => ({
        texto,
        pos: index
    }));

    // Añadir un espacio vacío
    piezas.push({ texto: "", pos: 5 });
    emptyPieceIndex = 5; // Última posición como espacio vacío

    dibujarPiezas();
}

// Crear una pieza
function crearPieza(pieza) {
    const div = document.createElement("div");
    div.className = "piece";
    div.textContent = pieza.texto;

    div.addEventListener("click", () => {
        moverPieza(pieza.texto);
    });

    return div;
}

// Mover la pieza
function moverPieza(texto) {
    const piezaIndex = piezas.findIndex(p => p.texto === texto);
    
    // Calcular las posiciones adyacentes
    const validMoves = [
        emptyPieceIndex - 1, // izquierda
        emptyPieceIndex + 1, // derecha
        emptyPieceIndex - 3, // arriba
        emptyPieceIndex + 3  // abajo
    ];

    if (validMoves.includes(piezaIndex)) {
        // Intercambiar posiciones
        [piezas[piezaIndex], piezas[emptyPieceIndex]] = [piezas[emptyPieceIndex], piezas[piezaIndex]];
        emptyPieceIndex = piezaIndex; // Actualiza la posición del espacio vacío
        dibujarPiezas();
    }
}

// Dibujar las piezas
function dibujarPiezas() {
    const puzzle = document.getElementById("puzzle");
    puzzle.innerHTML = ""; // Limpiar el puzzle

    piezas.forEach((pieza, index) => {
        const pieceDiv = crearPieza(pieza);
        pieceDiv.style.gridRowStart = Math.floor(index / 3) + 1;
        pieceDiv.style.gridColumnStart = (index % 3) + 1;
        puzzle.appendChild(pieceDiv);
    });
}

// Comprobar el resultado
document.getElementById("resolver").addEventListener("click", () => {
    const resultado = document.getElementById("resultado");
    const posicionesActuales = piezas.map(p => p.texto).filter(text => text !== "");
    if (posicionesActuales[posicionesActuales.length - 1] === ejercicioActual.solucion) {
        resultado.textContent = "😀 ¡Puzle resuelto correctamente!";
        document.getElementById("siguiente").style.display = "block";
    } else {
        resultado.textContent = "😞 El puzle no está resuelto aún.";
        document.getElementById("siguiente").style.display = "none";
    }
});

// Pasar al siguiente ejercicio
document.getElementById("siguiente").addEventListener("click", () => {
    inicializarPiezas();
    document.getElementById("resultado").textContent = "";
    document.getElementById("siguiente").style.display = "none";
});

// Inicializar y dibujar las piezas
ejerciciosDesordenados = mezclarEjercicios([...ejercicios]); // Mezclar ejercicios al inicio
inicializarPiezas();
