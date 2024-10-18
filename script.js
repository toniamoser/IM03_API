document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM vollständig geladen');

    const url = 'https://projektim03.mariareichmuth.ch/etl/unload.php';

    let questionBoxHeights = [];
    let questionBoxWidths = [];
    let data = null;
    let score = 0; // Variable für den Punktestand

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(script);

    async function loadQuestions() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Daten von der API:', data);
            return data;
        } catch (e) {
            console.error('Fehler beim Abrufen der Daten:', e);
            return false;
        }
    }

    async function startQuiz() {
        if (!data) {
            console.log('Lade Daten...');
            data = await loadQuestions();

            if (!data || data.length === 0) {
                console.error('Fehler beim Abrufen der Daten.');
                return;
            }
        }

        initializeQuiz(data);
        shuffleQuestions();
        showQuestion();
    }

    function initializeQuiz(data) {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let recentSongs = data.filter(song => {
            const songDate = new Date(song.playFrom);
            return songDate >= sevenDaysAgo;
        });

        if (recentSongs.length === 0) {
            console.error('Keine Songs in den letzten 7 Tagen gefunden.');
            return;
        }

        let topSongsFrequency = recentSongs.reduce((acc, next) => {
            const key = `${next.artist}-${next.title}`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        let topArtistsFrequency = recentSongs.reduce((acc, next) => {
            if (next.artist) {
                acc[next.artist] = (acc[next.artist] || 0) + 1;
            }
            return acc;
        }, {});

        let topSongs = Object.entries(topSongsFrequency)
            .map(([key, count]) => {
                let [artist, title] = key.split("-");
                let song = recentSongs.find(song => song.title === title && song.artist === artist);
                return {
                    artist: artist,
                    title: title,
                    playCount: count,
                    imageUrl: song ? song.imageUrl : ''
                };
            })
            .filter(song => song.title !== "News Bern" && song.artist && song.title)
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 4);

        let topArtists = Object.entries(topArtistsFrequency)
            .sort((a, b) => b[1] - a[1])
            .map(([artist, count]) => artist)
            .slice(0, 4);

        let loveCount = recentSongs.filter(song => song.title.includes('Love')).length;
        let danceCount = recentSongs.filter(song => song.title.includes('Dance')).length;
        let myCount = recentSongs.filter(song => song.title.includes('My')).length;

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        let wrongAnswersForPlayCount = [
            getRandomNumber(20, 100),
            getRandomNumber(20, 100),
            getRandomNumber(20, 100)
        ];

        let wrongAnswersForLoveCount = [
            getRandomNumber(10, 200),
            getRandomNumber(10, 200),
            getRandomNumber(10, 200)
        ];

        let wrongAnswersForDanceCount = [
            getRandomNumber(10, 100),
            getRandomNumber(10, 100),
            getRandomNumber(10, 100)
        ];

        let wrongAnswersForMyCount = [
            getRandomNumber(10, 100),
            getRandomNumber(10, 100),
            getRandomNumber(10, 100)
        ];

        function shuffleArrayWithCorrectAnswer(answers, correctAnswer) {
            const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
            return {
                answers: shuffledAnswers,
                correct: correctAnswer
            };
        }

        const mostPlayedSongTitle = topSongs[0].title;

        // Finde alle Songs mit der höchsten Anzahl an Abspielungen
        const maxPlayCount = topSongs[0].playCount;
        const mostPlayedSongs = topSongs.filter(song => song.playCount === maxPlayCount).map(song => song.title);

        let dailyPlays = Array(7).fill(0);
        recentSongs.forEach(song => {
            if (song.title === mostPlayedSongTitle) {
                const songDate = new Date(song.playFrom);
                const dayIndex = (songDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24);
                if (dayIndex >= 0 && dayIndex < 7) {
                    dailyPlays[Math.floor(dayIndex)]++;
                }
            }
        });

        // Fragen definieren
        questions = [
            {
                question: `Wie oft wurde der <span class="highlighth2">meistgespielte Song</span> insgesamt abgespielt?`,
                ...shuffleArrayWithCorrectAnswer([topSongs[0].playCount, ...wrongAnswersForPlayCount], topSongs[0].playCount),
                chartData: dailyPlays
            },
            {
                question: `Wie oft kam <span class="highlighth2">das Wort «Love»</span> in den Titeln aller in der letzten Woche gespielten Songs vor?`,
                ...shuffleArrayWithCorrectAnswer([loveCount, ...wrongAnswersForLoveCount], loveCount)
            },
            {
                question: `Wie oft kam <span class="highlighth2">das Wort «Dance»</span> in den Titeln aller in der letzten Woche gespielten Songs vor?`,
                ...shuffleArrayWithCorrectAnswer([danceCount, ...wrongAnswersForDanceCount], danceCount)
            },
            {
                question: `Wie oft kam <span class="highlighth2">das Wort «My»</span> in den Titeln aller in der letzten Woche gespielten Songs vor?`,
                ...shuffleArrayWithCorrectAnswer([myCount, ...wrongAnswersForMyCount], myCount)
            },
            {
                question: `<span class="highlighth2">Welcher Künstler</span> wurde in dieser Woche insgesamt am meisten im Radio gespielt?`,
                ...shuffleArrayWithCorrectAnswer(topArtists, topArtists[0])
            },
            {
                question: `Welcher dieser Songs wurde in dieser Woche <span class="highlighth2">am meisten gespielt?</span>`,
                ...shuffleArrayWithCorrectAnswer(topSongs.map(song => song.title), mostPlayedSongs) // Liste der korrekten Antworten mit mehreren richtigen
            }
        ];

        window.topSongs = topSongs;
    }

    let questions = [];
    let currentQuestionIndex = 0;
    let selectedAnswerIndex = null;

    function shuffleQuestions() {
        questions = [...questions];
        questions.sort(() => Math.random() - 0.5);
    }

    function showQuestion() {
        selectedAnswerIndex = null;
        const currentQuestion = questions[currentQuestionIndex];
        const contentDiv = document.getElementById('content');
        const extraContentDiv = document.getElementById('extra-content');

        let html = `<h2>${currentQuestion.question}</h2><div class="answer-boxes">`;

        currentQuestion.answers.forEach((answer, index) => {
            html += `<div class="answer-box" data-index="${index}">
                        <p>${answer}</p>
                    </div>`;
        });

        html += `</div><div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;
        html += `<button class="button" id="nextButton" disabled>Weiter</button></div>`;

        contentDiv.innerHTML = html;
        extraContentDiv.innerHTML = '';

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

        document.getElementById('nextButton').addEventListener('click', function () {
            showAnswer();
        });

        saveAnswerBoxDimensions();
    }

   function showAnswer() {
    const currentQuestion = questions[currentQuestionIndex];
    const contentDiv = document.getElementById('content');
    const extraContentDiv = document.getElementById('extra-content');

    // Überprüfung für die Frage nach dem meistgespielten Song: Es gibt mehrere richtige Antworten
    let isCorrect;
    if (Array.isArray(currentQuestion.correct)) {
        isCorrect = currentQuestion.correct.includes(currentQuestion.answers[selectedAnswerIndex]);
    } else {
        isCorrect = currentQuestion.answers[selectedAnswerIndex] === currentQuestion.correct;
    }

    if (isCorrect) {
        score++;  // Erhöhe den Punktestand, wenn die Antwort richtig ist
    }

    let html = `<h2>${isCorrect ? 'Yey, <span class="highlighth2">richtig!</span>' : 'Das war leider <span class="highlighth2">falsch.</span>'}</h2>`;
    html += `<h3 style="color: white;">${currentQuestion.question}</h3><div class="answer-boxes">`;

    currentQuestion.answers.forEach((answer, index) => {
        let backgroundColor = '';
        let textColor = '';
        let symbol = '';

        if (Array.isArray(currentQuestion.correct) && currentQuestion.correct.includes(answer)) {
            backgroundColor = 'white';
            textColor = '#0055ff';
            symbol = `<span style="color: #0055ff;">&#10003;</span>`;
        } else if (answer === currentQuestion.correct) {
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

    // Statistik und Diagramm anzeigen
    let extraHtml = '';
    if (currentQuestion.question.includes('Wie oft wurde der <span class="highlighth2">meistgespielte Song</span> insgesamt abgespielt?')) {
        extraHtml += `<div id="chart-container">
                        <h3>So oft lief der meistgespielte Song in der <span class="highlighth2">letzten Woche</span> auf Radio Energy:</h3>
                        <canvas id="barChart"></canvas>
                     </div>`;
    }

    if (currentQuestion.question.includes('Welcher dieser Songs wurde in dieser Woche <span class="highlighth2">am meisten gespielt?</span>')) {
        extraHtml += `<div class='statistics'> <h3>Diese Songs wurden in der <span class="highlighth2">letzten Woche</span> am meisten gespielt:</h3> 
        <div id="top-songs-container" class="top-songs">`;

        window.topSongs.forEach(song => {
            extraHtml += `
                <div class="song-box">
                    <p class="bold">${song.title}</p>
                    <p>${song.artist}</p>
                    <img src="${song.imageUrl}" alt="Album Cover">
                    <div class="play-count">${song.playCount}x</div>
                </div>
            `;
        });

        extraHtml += `</div> </div>`;
    }

    extraContentDiv.innerHTML = extraHtml;

    // Diagramm erstellen, wenn relevant
    if (currentQuestion.question.includes('Wie oft wurde der <span class="highlighth2">meistgespielte Song</span> insgesamt abgespielt?')) {
        createBarChart(currentQuestion.chartData);
    }

    document.getElementById('nextButton').addEventListener('click', function () {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            // Vor dem Anzeigen des Punktestands, extraContentDiv leeren
            extraContentDiv.innerHTML = '';
            showResult();
        }
    });

    applySavedDimensionsToAnswerBoxes();
}

    function showResult() {
        const contentDiv = document.getElementById('content');
        let resultMessage = '';
    
        // Je nach Punktzahl wird eine unterschiedliche Nachricht angezeigt
        if (score <= 3) {
            resultMessage = 'Es sieht so aus, als müsstest du die aktuellen Hits noch etwas besser kennenlernen. Versuche es noch einmal!';
        } else if (score <= 5) {
            resultMessage = 'Du scheinst die aktuellen Hits ziemlich gut zu kennen und bist auf jeden Fall am Puls der Zeit. Nur noch ein kleines Stückchen bis zur Perfektion!';
        } else {
            resultMessage = 'Wow, du bist ein wahrer Musikexperte und kennst die aktuellen Hits in- und auswendig! Großartig gemacht!';
        }
    
        contentDiv.innerHTML = `
            <h1>Du hast <span class="highlighth2">${score} von 7 Punkten</span> erreicht!</h1>
            <p>${resultMessage}</p>
            <button class="button" id="restartQuiz">Quiz wiederholen</button>
        `;

        document.getElementById('restartQuiz').addEventListener('click', function () {
            currentQuestionIndex = 0;
            score = 0;  // Punktestand zurücksetzen
            shuffleQuestions();
            showQuestion();
        });
    }

    function createBarChart(data) {
        const ctx = document.getElementById('barChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tag1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7'],
                datasets: [{
                    label: 'Anzahl der Plays',
                    data: data,
                    backgroundColor: '#0022ee',
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function saveAnswerBoxDimensions() {
        questionBoxHeights = [];
        questionBoxWidths = [];
        const answerBoxes = document.querySelectorAll('.answer-box');
        answerBoxes.forEach(box => {
            questionBoxHeights.push(box.offsetHeight); 
            questionBoxWidths.push(box.offsetWidth);   
        });
    }

    function applySavedDimensionsToAnswerBoxes() {
        const answerBoxes = document.querySelectorAll('.answer-box');
        answerBoxes.forEach((box, index) => {
            if (questionBoxHeights[index] && questionBoxWidths[index]) {
                box.style.height = `${questionBoxHeights[index]}px`; 
                box.style.width = `${questionBoxWidths[index]}px`;   
            }
        });
    }

    // Füge ein Click-Event zum Logo hinzu, um die Startseite anzuzeigen
    document.querySelector('.logo-img').addEventListener('click', function() {
        const contentDiv = document.getElementById('content');
        const extraContentDiv = document.getElementById('extra-content');

        // Setze den Inhalt auf die Startseite zurück
        contentDiv.innerHTML = `
            <h1>Bist du bereit, dein Wissen über die <span class="highlighth2">aktuellen Hits der Woche</span> zu testen?</h1>
            <div>
                <button type="button" class="button" id="startQuiz">Quiz starten</button>
            </div>
        `;

        // Leere auch den zusätzlichen Inhalt
        extraContentDiv.innerHTML = '';

        // Füge den Eventlistener für den Start-Button wieder hinzu
        document.getElementById('startQuiz').addEventListener('click', startQuiz);
    });

    document.getElementById('startQuiz').addEventListener('click', startQuiz);
});
