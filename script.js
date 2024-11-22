const gameBoard = document.getElementById("game-board");
const cardCountSelect = document.getElementById("card-count");
const startGameButton = document.getElementById("start-game");
const scoreDisplay = document.getElementById("score");
const timerSelect = document.getElementById("time-limit");
const timeLeftDisplay = document.getElementById("time-left");

let cardCount = 12;
let flippedCards = [];
let matchedPairs = 0; //Default matched pairs
let score = 0; // Default score
let timeLimit = 1 * 60; // Default 1 minuut in seconden
let timeLeft = timeLimit; // Globale timer waarde
let gameTimer; 

// Start nieuw spel
startGameButton.addEventListener("click", () => {
    cardCount = parseInt(cardCountSelect.value);
    timeLimit = parseInt(timerSelect.value) * 60; // Minuten omzetten naar seconden
    timeLeft = timeLimit; // Zet de timer weer op de beginwaarde
    startNewGame();
});

// Start een nieuw spel
function startNewGame() {
    gameBoard.innerHTML = "";  // Maak het bord leeg
    matchedPairs = 0;  // Reset het aantal matches
    flippedCards = [];  // Reset de omgedraaide kaarten
    score = 0;  // Reset de score
    scoreDisplay.textContent = score;  // Toon de score
    clearInterval(gameTimer);  // Stop de oude timer
    startTimer();  // Start de nieuwe timer

    const cards = generateCards(cardCount / 2);  // Genereer kaarten voor het aantal geselecteerde paren
    shuffle(cards);  // Shuffle de kaarten
    renderCards(cards);  // Render de kaarten op het bord
}

// Genereer kaarten (paar voor elk plaatje)
function generateCards(pairCount) {
    const images = [
        'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg', 
        'img/image4.jpg', 'img/image5.jpg', 'img/image6.jpg'
    ];

    const cards = [];
    const colors = generateRandomColors(pairCount * 2);  // Genereer genoeg unieke kleuren

    // Genereer de kaarten met afbeeldingen en kleuren
    for (let i = 0; i < pairCount; i++) {
        const image = images[i % images.length];
        // Haal 2 verschillende kleuren voor dit paar
        const color1 = colors.pop();
        const color2 = colors.pop();
        
        // Voeg de kaarten toe met verschillende kleuren
        cards.push({ id: i, image: image, color: color1 });
        cards.push({ id: i, image: image, color: color2 });
    }

    return cards;
}

// Functie om een lijst met unieke kleuren te genereren
function generateRandomColors(count) {
    const colorArray = [];
    while (colorArray.length < count) {
        // Genereer een willekeurige kleur
        const randomColor = getRandomColor();
        if (!colorArray.includes(randomColor)) {
            colorArray.push(randomColor);  // Voeg toe als de kleur nog niet bestaat
        }
    }
    return colorArray;
}

// Functie om een willekeurige hex kleur te genereren
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Shuffle kaarten (Fisher-Yates shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];  // Wissel de kaarten
    }
}

// Render kaarten
function renderCards(cards) {
    gameBoard.setAttribute("data-cards", cardCount);  // Stel het aantal kaarten in voor de grid
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.innerHTML = `
            <div class="inner">
                <div class="front" style="background-color: ${card.color};"></div>
                <div class="back" style="background-image: url(${card.image})"></div>
            </div>
        `;
        cardElement.addEventListener("click", () => flipCard(cardElement, card));
        gameBoard.appendChild(cardElement);  // Voeg de kaart toe aan het bord
    });
}

// Flip kaart logica
function flipCard(cardElement, card) {
    if (flippedCards.length >= 2 || cardElement.classList.contains("flipped")) return;

    cardElement.classList.add("flipped");  // Draai de kaart om
    flippedCards.push({ card, cardElement });  // Voeg de omgedraaide kaart toe aan de lijst

    if (flippedCards.length === 2) {
        checkMatch();  // Controleer of de kaarten overeenkomen
    }
}

// Controleer of de kaarten overeenkomen
function checkMatch() {
    const [first, second] = flippedCards;

    if (first.card.id === second.card.id) {
        matchedPairs++;  // Als de kaarten matchen, verhoog het aantal gematchte paren
        score++;  // Verhoog de score
        scoreDisplay.textContent = score;  // Toon de score
        flippedCards = [];  // Reset de lijst van omgedraaide kaarten

        // Als alle paren zijn gematcht, geef een winstbericht weer
        if (matchedPairs === cardCount / 2) {
            setTimeout(() => alert("Gefeliciteerd, je hebt gewonnen!"), 500);
        }
    } else {
        setTimeout(() => {
            // Als de kaarten niet overeenkomen, draai ze weer om
            first.cardElement.classList.remove("flipped");
            second.cardElement.classList.remove("flipped");
            flippedCards = [];  // Reset de lijst van omgedraaide kaarten
        }, 1000);
    }
}

// Timer starten
function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;  // Verlaag de tijd
        const minutes = Math.floor(timeLeft / 60);  // Minuten berekenen
        const seconds = timeLeft % 60;  // Seconden berekenen
        timeLeftDisplay.textContent = `Tijd: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;  // Toon de resterende tijd

        // Stop de timer en toon een bericht als de tijd om is
        if (timeLeft <= 0) {
            clearInterval(gameTimer);  // Stop de timer
            alert("Tijd is om! Je hebt verloren!");  // Laat een melding zien bij tijdsuitloop
        }
    }, 1000);  // Elke seconde bijwerken
}

