// Warte, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Das Element mit der ID 'startQuiz' holen
    var startQuizButton = document.getElementById('startQuiz');
    if (startQuizButton) {
        // Eventlistener für den Klick auf den Button hinzufügen
        startQuizButton.addEventListener('click', function(event) {
            event.preventDefault();  // Verhindert das Standard-Link-Verhalten
            window.location.href = 'php/question1.php';  // Weiterleitung zu php/question1.php
        });
    } else {
        console.log('Das Element mit der ID "startQuiz" wurde nicht gefunden.');
    }
});
