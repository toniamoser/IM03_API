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
            console.error('Fehler beim Abrufen der Daten:', e);
            return false;
        }
    }

    const data = await loadQuestions(); // Holt die Daten aus der Datenbank

    if (!data || data.length === 0) {
        console.error('Fehler beim Abrufen der Daten.');
        return;
    }

    // Berechne das Datum vor 7 Tagen
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    console.log(`Aktuelles Datum: ${now}`);
    console.log(`Datum vor 7 Tagen: ${sevenDaysAgo}`);

    // Überprüfe das Format der Timestamps (playFrom) und filtere die Songs der letzten 7 Tage
    let recentSongs = data.filter(song => {
        const songDate = new Date(song.playFrom); // Verwende playFrom statt timestamp
        return songDate >= sevenDaysAgo;
    });

    if (recentSongs.length === 0) {
        console.error('Keine Songs in den letzten 7 Tagen gefunden.');
        return;
    }

    console.log('Songs der letzten 7 Tage:', recentSongs);

    // Berechne die Häufigkeit der abgespielten Songs
    let topSongsFrequency = recentSongs.reduce((acc, next) => {
        const key = `${next.artist}-${next.title}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    // Berechne die Häufigkeit der abgespielten Künstler
    let topArtistsFrequency = recentSongs.reduce((acc, next) => {
        if (next.artist) {  // Überprüfe, ob der Künstler vorhanden ist
            acc[next.artist] = (acc[next.artist] || 0) + 1;
        }
        return acc;
    }, {});

    // Top 4 Songs, absteigend sortiert nach PlayCount, und ohne "News Bern"
    let topSongs = Object.entries(topSongsFrequency)
        .map(([key, count]) => {
            let [artist, title] = key.split("-");
            return {
                artist: artist,
                title: title,
                playCount: count
            };
        })
        .filter(song => song.title !== "News Bern" && song.artist && song.title) // "News Bern" entfernen, und nur gültige Songs und Künstler
        .sort((a, b) => b.playCount - a.playCount) // Sortiere absteigend nach playCount
        .slice(0, 4); // Top 4 Songs auswählen

    if (topSongs.length === 0) {
        console.error('Keine Songs in den letzten 7 Tagen gefunden.');
        return;
    }

    // Top 4 Künstler, absteigend sortiert nach PlayCount
    let topArtists = Object.entries(topArtistsFrequency)
        .sort((a, b) => b[1] - a[1]) // Sortiere absteigend nach playCount
        .map(([artist, count]) => artist) // Nur die Künstlernamen
        .filter(artist => artist) // Entferne null oder undefined Werte
        .slice(0, 4); // Top 4 Künstler auswählen

    if (topArtists.length === 0) {
        console.error('Keine Künstler in den letzten 7 Tagen gefunden.');
        return;
    }

    console.log('Top Songs:', topSongs);
    console.log('Top Artists:', topArtists);

    // Zähle die Anzahl der Songs mit "Love", "Dance" und "My" im Titel
    let loveCount = recentSongs.filter(song => song.title.includes('Love')).length;
    let danceCount = recentSongs.filter(song => song.title.includes('Dance')).length;
    let myCount = recentSongs.filter(song => song.title.includes('My')).length;

    // Funktion zum Generieren von zufälligen Zahlen zwischen min und max
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generiere 3 zufällige falsche Antworten (zwischen 500 und 1000)
    let wrongAnswersForLoveCount = [
        getRandomNumber(500, 1000),
        getRandomNumber(500, 1000),
        getRandomNumber(500, 1000)
    ];

    let wrongAnswersForDanceCount = [
        getRandomNumber(500, 1000),
        getRandomNumber(500, 1000),
        getRandomNumber(500, 1000)
    ];

    let wrongAnswersForMyCount = [
        getRandomNumber(500, 1000),
        getRandomNumber(500, 1000),
        getRandomNumber(500, 1000)
    ];

    // Funktion zum Zufällig Mischen der Antworten, aber behalte die richtige Antwort korrekt
    function shuffleArrayWithCorrectAnswer(answers, correctAnswer) {
        const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5); // Erstelle eine Kopie und mische die Antworten
        return {
            answers: shuffledAnswers,
            correct: correctAnswer
        };
    }

    // Erstelle die Quizfragen, füge den Songtitel des meistgespielten Songs in die Frage ein
    const mostPlayedSongTitle = topSongs[0].title; // Meistgespielter Songtitel

    const questions = [
        {
            question: `Wie oft wurde der meistgespielte Song insgesamt abgespielt?`,  // Songtitel eingefügt
            ...shuffleArrayWithCorrectAnswer(topSongs.map(song => song.playCount), topSongs[0].playCount)
        },
        {
            question: "Wie oft kommt in allen gespielten Songs der letzten Woche das Wort «Love» vor?",
            ...shuffleArrayWithCorrectAnswer([loveCount, ...wrongAnswersForLoveCount], loveCount)
        },
        {
            question: "Wie oft kommt in allen gespielten Songs der letzten Woche das Wort «Dance» vor?",
            ...shuffleArrayWithCorrectAnswer([danceCount, ...wrongAnswersForDanceCount], danceCount)
        },
        {
            question: "Wie oft kommt in allen gespielten Songs der letzten Woche das Wort «My» vor?",
            ...shuffleArrayWithCorrectAnswer([myCount, ...wrongAnswersForMyCount], myCount)
        },
        {
            question: "Welcher Künstler wurde in dieser Woche insgesamt am meisten im Radio gespielt?",
            ...shuffleArrayWithCorrectAnswer(topArtists, topArtists[0])  // Der meistgespielte Künstler
        },
        {
            question: "Welcher dieser Songs wurde in dieser Woche am meisten gespielt?",
            ...shuffleArrayWithCorrectAnswer(topSongs.map(song => song.title), topSongs[0].title)  // Der meistgespielte Song
        }
    ];

    console.log(questions);

    let currentQuestionIndex = 0;
    let selectedAnswerIndex = null;
    let shuffledQuestions = [];

    // Funktion zum Zufällig Mischen der Fragen
    function shuffleQuestions() {
        shuffledQuestions = [...questions];
        shuffledQuestions.sort(() => Math.random() - 0.5);
    }

    // Funktion zum Anzeigen der aktuellen Frage und Antworten
    function showQuestion() {
        selectedAnswerIndex = null;
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const contentDiv = document.getElementById('content');

        let html = `<h2>${currentQuestion.question}</h2><div class="answer-boxes">`;

        currentQuestion.answers.forEach((answer, index) => {
            html += `<div class="answer-box" data-index="${index}">
                        <p>${answer}</p>
                    </div>`;
        });

        html += `</div><div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;
        html += `<button class="button" id="nextButton" disabled>Weiter</button></div>`;

        contentDiv.innerHTML = html;

        // Antwortauswahl
        document.querySelectorAll('.answer-box').forEach(box => {
            box.addEventListener('click', function () {
                document.querySelectorAll('.answer-box').forEach(box => {
                    box.style.backgroundColor = '';
                    box.querySelector('p').style.color = '';
                });

                this.style.backgroundColor = 'white';
                this.querySelector('p').style.color = '#0055ff';

                selectedAnswerIndex = parseInt(this.getAttribute('data-index'));
                document.getElementById('nextButton').disabled = false;
            });
        });

        // Weiter-Button
        document.getElementById('nextButton').addEventListener('click', function () {
            showAnswer();
        });
    }

    // Funktion zum Anzeigen der Antwortseite ("Richtig" oder "Falsch")
    function showAnswer() {
        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const contentDiv = document.getElementById('content');

        const isCorrect = currentQuestion.answers[selectedAnswerIndex] === currentQuestion.correct;

        let html = `<h2>${isCorrect ? 'Richtig!' : 'Das war leider falsch.'}</h2><div class="answer-boxes">`;

        currentQuestion.answers.forEach((answer, index) => {
            let backgroundColor = '';
            let textColor = '';
            let symbol = '';

            if (answer === currentQuestion.correct) {
                backgroundColor = 'white';
                textColor = '#0055ff';
                symbol = `<span style="color: #0055ff;">&#10003;</span>`;
            }

            if (index === selectedAnswerIndex && !isCorrect) {
                backgroundColor = 'white';
                textColor = '#ff0000';
                symbol = `<span style="color: #ff0000;">&#10007;</span>`;
            }

            html += `<div class="answer-box" style="background-color: ${backgroundColor}; color: ${textColor};">
                        <p>${answer} ${symbol}</p>
                    </div>`;
        });

        html += `</div><div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;
        html += `<button class="button" id="nextButton">Weiter</button></div>`;

        contentDiv.innerHTML = html;

        document.getElementById('nextButton').addEventListener('click', function () {
            if (currentQuestionIndex < shuffledQuestions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResult();
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

        document.getElementById('restartQuiz').addEventListener('click', function () {
            currentQuestionIndex = 0;
            shuffleQuestions();
            showQuestion();
        });
    }

    // Quiz starten
    document.getElementById('startQuiz').addEventListener('click', function () {
        shuffleQuestions();
        showQuestion();
    });
});
