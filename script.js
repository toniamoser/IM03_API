document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM vollständig geladen');

    const url = 'https://projektim03.mariareichmuth.ch/etl/unload.php';

    let questionBoxHeights = [];  // Um die Höhe der Antwortboxen zu speichern
    let questionBoxWidths = [];   // Um die Breite der Antwortboxen zu speichern
    let data = null;  // Um die Quizdaten zu speichern

    // Die Funktion lädt die Fragen von der API
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

    // Starte das Quiz und zeige die erste Frage
    async function startQuiz() {
        if (!data) {
            console.log('Lade Daten...');
            data = await loadQuestions();  // Daten nur einmal laden

            if (!data || data.length === 0) {
                console.error('Fehler beim Abrufen der Daten.');
                return;
            }
        }

        initializeQuiz(data);  // Initialisiere das Quiz
        shuffleQuestions();
        showQuestion();
    }

    // Initialisiere das Quiz und bereite die Fragen vor
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
                let song = recentSongs.find(song => song.title === title && song.artist === artist); // Find song details
                return {
                    artist: artist,
                    title: title,
                    playCount: count,
                    imageUrl: song ? song.imageUrl : ''  // Safeguard for missing imageUrl
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

        function shuffleArrayWithCorrectAnswer(answers, correctAnswer) {
            const shuffledAnswers = [...answers].sort(() => Math.random() - 0.5);
            return {
                answers: shuffledAnswers,
                correct: correctAnswer
            };
        }

        const mostPlayedSongTitle = topSongs[0].title;

        questions = [
            {
                question: `Wie oft wurde der meistgespielte Song insgesamt abgespielt?`,
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
                ...shuffleArrayWithCorrectAnswer(topArtists, topArtists[0])
            },
            {
                question: "Welcher dieser Songs wurde in dieser Woche am meisten gespielt?",
                ...shuffleArrayWithCorrectAnswer(topSongs.map(song => song.title), topSongs[0].title)
            }
        ];

        // Speichere die topSongs für spätere Verwendung
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

        let html = `<h2>${currentQuestion.question}</h2><div class="answer-boxes">`;

        currentQuestion.answers.forEach((answer, index) => {
            html += `<div class="answer-box" data-index="${index}">
                        <p>${answer}</p>
                    </div>`;
        });

        html += `</div><div class="button-container" style="display: flex; justify-content: space-between; margin-top: 20px;">`;
        html += `<button class="button" id="nextButton" disabled>Weiter</button></div>`;

        contentDiv.innerHTML = html;

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

        // Füge den weißen Balken und die Songs nur bei der Songfrage hinzu
        if (currentQuestion.question.includes('am meisten gespielt')) {
            console.log('Most played song question detected! Adding top songs to the page.');

            // Fügen Sie den weißen Hintergrund für die Seite hinzu
            document.body.classList.add('white-bg');  // White background below the current content

            // Den weißen Balken mit den Song-Boxen unterhalb der Antwortboxen hinzufügen
            html += `<div id="top-songs-container" class="top-songs">`;

            window.topSongs.forEach(song => {
                console.log('Adding song:', song); // Logging each song being added
                html += `
                    <div class="song-box">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                        <img src="${song.imageUrl}" alt="Album Cover">
                        <div class="play-count">${song.playCount}x</div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        contentDiv.innerHTML = html;

        document.getElementById('nextButton').addEventListener('click', function () {
            // Entferne den weißen Hintergrund, wenn zur nächsten Frage gewechselt wird
            document.body.classList.remove('white-bg');

            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResult();
            }
        });

        applySavedDimensionsToAnswerBoxes();
    }

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

    // Das Quiz startet erst, wenn auf den Button geklickt wird
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
});
