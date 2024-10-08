// Sicherstellen, dass das DOM vollständig geladen ist, bevor der Event Listener gesetzt wird
document.addEventListener('DOMContentLoaded', function() {
    // Fragen für das Quiz
    const questions = [
        {
            question: "Wie oft wurde der meistgespielte Song insgesamt abgespielt?",
            answers: ["100 mal", "200 mal", "300 mal", "400 mal"],
            correct: 2 // Index der richtigen Antwort (0-basiert)
        },
        {
            question: "Wie oft kommt in allen gespielten Songs der letzten Woche das Wort 'Love' vor?",
            answers: ["10 mal", "20 mal", "30 mal", "40 mal"],
            correct: 1
        },
        {
            question: "Welcher Künstler wurde in dieser Woche insgesamt am meisten im Radio gespielt?",
            answers: ["Künstler 1", "Künstler 2", "Künstler 3", "Künstler 4"],
            correct: 3
        },
        {
            question: "Welcher dieser Songs wurde in dieser Woche am meisten gespielt?",
            answers: ["Song 1", "Song 2", "Song 3", "Song 4"],
            correct: 0
        }
    ];

    let currentQuestionIndex = 0;
    let selectedAnswerIndex = null;  // Die gewählte Antwort des Benutzers
    let shuffledQuestions = [];

    // Funktion, um die Fragen zufällig zu mischen
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

        // Zurück-Button anzeigen, wenn nicht bei der ersten Frage
        if (currentQuestionIndex > 0) {
            html += `<button class="button" id="prevButton">Zurück</button>`;
        }

        // Weiter-Button anzeigen
        html += `<button class="button" id="nextButton" disabled>Weiter</button></div>`;

        contentDiv.innerHTML = html;

        // Event Listener für die Antwortauswahl
        document.querySelectorAll('.answer-box').forEach(box => {
            box.addEventListener('click', function() {
                // Markiere die gewählte Antwort
                document.querySelectorAll('.answer-box').forEach(box => box.style.backgroundColor = '');  // Entferne Highlight
                this.style.backgroundColor = 'white';  // Markiere die gewählte Antwort
                selectedAnswerIndex = parseInt(this.getAttribute('data-index'));  // Speichere die gewählte Antwort
                document.getElementById('nextButton').disabled = false;  // Aktiviere den Weiter-Button
            });
        });

        // Event Listener für "Weiter"-Button
        document.getElementById('nextButton').addEventListener('click', function() {
            showAnswer();  // Zeige die Antwortseite an
        });

        // Event Listener für "Zurück"-Button (falls vorhanden)
        const prevButton = document.getElementById('prevButton');
        if (prevButton) {
            prevButton.addEventListener('click', function() {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion();
                }
            });
        }
    }

    // Funktion zum Anzeigen der Antwortseite ("Richtig" oder "Falsch")
    function showAnswer() {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const contentDiv = document.getElementById('content');

        // Überprüfen, ob die Antwort richtig oder falsch ist
        const isCorrect = selectedAnswerIndex === currentQuestion.correct;

        let html = `<h2>${isCorrect ? 'Richtig!' : 'Falsch!'}</h2>`;
        html += `<div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;

        // Zurück-Button anzeigen
        html += `<button class="button" id="prevButton">Zurück</button>`;

        // Weiter-Button anzeigen
        html += `<button class="button" id="nextButton">Weiter</button></div>`;

        contentDiv.innerHTML = html;

        // Event Listener für "Weiter"-Button
        document.getElementById('nextButton').addEventListener('click', function() {
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResult();  // Wenn alle Fragen beantwortet sind, Ergebnis anzeigen
            }
        });

        // Event Listener für "Zurück"-Button
        document.getElementById('prevButton').addEventListener('click', function() {
            showQuestion();  // Zeige die aktuelle Frage erneut an
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
        document.getElementById('restartQuiz').addEventListener('click', function() {
            currentQuestionIndex = 0;  // Zurück zur ersten Frage
            shuffleQuestions();  // Fragen erneut mischen
            showQuestion();  // Zeige die erste Frage an
        });
    }

    // Event Listener für den "Quiz starten"-Button
    document.getElementById('startQuiz').addEventListener('click', function() {
        shuffleQuestions();  // Mische die Fragen zufällig
        showQuestion();  // Startet das Quiz, indem die erste Frage angezeigt wird
    });
});
