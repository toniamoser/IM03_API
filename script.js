document.addEventListener('DOMContentLoaded', async function () {
    console.log('DOM vollständig geladen');

    // URL zu deinem API-Endpunkt (unload.php)
    const url = 'https://projektim03.mariareichmuth.ch/etl/unload.php';

    // Funktion zum Abrufen der Fragen basierend auf der Datenbank
    async function loadQuestions() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Daten von der API:', data); // Zeige die abgerufenen Daten in der Konsole an
            return data;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    const data = await loadQuestions(); // Holt die Daten aus der Datenbank

    if (!data || data.length === 0) {
        console.error('Fehler beim Abrufen der Daten.');
        return;
    }

    // Funktion, um falsche Antworten zu generieren
    function generateWrongAnswers(correctAnswer) {
        const wrongAnswers = [];
        const deviation = Math.floor(correctAnswer * 0.1);  // 10% Abweichung
        for (let i = 1; i <= 3; i++) {
            wrongAnswers.push(correctAnswer + (deviation * i));  // Falsche Antworten nahe an der richtigen
        }
        return wrongAnswers;
    }

    // Quizfragen basierend auf den API-Daten
    console.log('Daten:', data);

let topSongsFrequency = data.reduce(
    (acc, next) => {
    const key = `${next.artist}-${next.title}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
    },
    {}
   );
   
   let topSongs = Object.entries(topSongsFrequency)
    .map(([key, count]) => {
    let [artist, title] = key.split("-");
    return {
    artist: artist,
    title: title,
    playCount: count
    };
    })
    .sort((a, b) => b.playCount - a.playCount).slice(0, 4);

    console.log(topSongs);


let loveCount = data.filter(song => song.title.includes('Love')).length;  // Richtige Antwort: Anzahl der Songs mit "Love"

let topArtists = [...new Set(data.map(song => song.artist))]  // Nimmt nur einzigartige Künstlernamen
    .slice(0, 4);  // Befüllt mit den Top 4 Künstlern

    let topSongTitle = data.slice(0, 4).map(song => song.title);  // Befüllt mit den Titeln der Top 4 Songs

    // befüllen mit top 4 meistgespielten songs
    // befüllen mit wert songtitel

    // let loceCount = []
    // befüllen


    const questions = [
        {
            question: "Wie oft wurde der meistgespielte Song insgesamt abgespielt?",
            answers: shuffleArray(topSongs),
            correct: topSongs[0]
        },
        {
            question: "Wie oft kommt in allen gespielten Songs der letzten Woche das Wort «Love» vor?",
            answers: shuffleArray([ loveCount.length, 4, 5, 6]),
            correct: loveCount.length
        },
        {
            question: "Welcher Künstler wurde in dieser Woche insgesamt am meisten im Radio gespielt?",
            answers: shuffleArray(topArtists),
            correct: topArtists[0]
        },
        {
            question: "Welcher dieser Songs wurde in dieser Woche am meisten gespielt?",
            answers: shuffleArray(topSongTitle),
            correct: topSongTitle[0]
        }
    ];

    console.log(questions)

    let currentQuestionIndex = 0;
    let selectedAnswerIndex = null;
    let shuffledQuestions = [];

    // Funktion, um die Fragen zufällig zu mischen
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function shuffleQuestions() {
        shuffledQuestions = [...questions];  // Kopie der Fragen erstellen
        shuffledQuestions.sort(() => Math.random() - 0.5);  // Zufällige Reihenfolge
    }

    // Funktion zum Anzeigen der aktuellen Frage und Antworten
    function showQuestion() {
        selectedAnswerIndex = null;  // Zurücksetzen der Auswahl
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const contentDiv = document.getElementById('content');

        // Frage anzeigen
        let html = `<h2>${currentQuestion.question}</h2><div class="answer-boxes">`;

        // Antwortmöglichkeiten anzeigen
        currentQuestion.answers.forEach((answer, index) => {
            html += `<div class="answer-box" data-index="${index}">
                        <p>${answer}</p>
                    </div>`;
        });

        html += `</div><div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;

        // Weiter-Button anzeigen
        html += `<button class="button" id="nextButton" disabled>Weiter</button></div>`;

        contentDiv.innerHTML = html;

        // Event Listener für die Antwortauswahl
        document.querySelectorAll('.answer-box').forEach(box => {
            box.addEventListener('click', function () {
                // Entferne das Highlight von allen Boxen
                document.querySelectorAll('.answer-box').forEach(box => {
                    box.style.backgroundColor = '';  // Entferne den weißen Hintergrund
                    box.querySelector('p').style.color = '';  // Setze die Schriftfarbe zurück
                });

                // Markiere die gewählte Antwort: Hintergrund Weiß und Schrift Blau
                this.style.backgroundColor = 'white';
                this.querySelector('p').style.color = '#0055ff';  // Blau aus deinem CSS

                // Speichere die gewählte Antwort
                selectedAnswerIndex = parseInt(this.getAttribute('data-index'));

                // Aktiviere den Weiter-Button
                document.getElementById('nextButton').disabled = false;
            });
        });

        // Event Listener für "Weiter"-Button
        document.getElementById('nextButton').addEventListener('click', function () {
            showAnswer();  // Zeige die Antwortseite an
        });
    }

    // Funktion zum Anzeigen der Antwortseite ("Richtig" oder "Falsch")
    function showAnswer() {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const contentDiv = document.getElementById('content');

        // Überprüfen, ob die Antwort richtig oder falsch ist
        const isCorrect = currentQuestion.answers[selectedAnswerIndex] === currentQuestion.correct;

        // Frage erneut anzeigen, um alle Optionen zu visualisieren
        let html = `<h2>${isCorrect ? 'Richtig!' : 'Das war leider falsch.'}</h2><div class="answer-boxes">`;

        // Antwortmöglichkeiten anzeigen mit Markierungen
        currentQuestion.answers.forEach((answer, index) => {
            let backgroundColor = '';
            let textColor = '';
            let symbol = '';

            if (answer === currentQuestion.correct) {
                backgroundColor = 'white';  // Markiere richtige Antwort
                textColor = '#0055ff';  // Schrift Blau
                symbol = `<span style="color: #0055ff;">&#10003;</span>`;  // Haken für richtige Antwort
            }

            if (index === selectedAnswerIndex && !isCorrect) {
                backgroundColor = 'white';  // Markiere falsche Antwort
                textColor = '#ff0000';  // Schrift Rot
                symbol = `<span style="color: #ff0000;">&#10007;</span>`;  // Kreuz für falsche Antwort
            }

            html += `<div class="answer-box" style="background-color: ${backgroundColor}; color: ${textColor};">
                        <p>${answer} ${symbol}</p>
                    </div>`;
        });

        html += `</div><div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;

        // Weiter-Button anzeigen
        html += `<button class="button" id="nextButton">Weiter</button></div>`;

        contentDiv.innerHTML = html;

        // Event Listener für "Weiter"-Button
        document.getElementById('nextButton').addEventListener('click', function () {
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResult();  // Wenn alle Fragen beantwortet sind, Ergebnis anzeigen
            }
        });
    }

    // Funktion zum Anzeigen des Ergebnisses
    function showResult() {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = `
            <h2>Quiz beendet!</h2>
            <p>Danke fürs Mitmachen!</p>
            <button class="button" id="restartQuiz">Quiz wiederholen</button>
        `;

        // Event Listener für "Quiz wiederholen"-Button
        document.getElementById('restartQuiz').addEventListener('click', function () {
            currentQuestionIndex = 0;  // Zurück zur ersten Frage
            shuffleQuestions();  // Fragen erneut mischen
            showQuestion();  // Zeige die erste Frage an
        });
    }

    // Event Listener für den "Quiz starten"-Button
    document.getElementById('startQuiz').addEventListener('click', function () {
        shuffleQuestions();  // Mische die Fragen zufällig
        showQuestion();  // Startet das Quiz, indem die erste Frage angezeigt wird
    });
});
