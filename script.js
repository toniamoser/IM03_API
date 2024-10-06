document.getElementById('startQuiz').addEventListener('click', function(event) {
    event.preventDefault();  // Verhindert das Standard-Link-Verhalten

    // Debugging: Überprüfen, ob das JavaScript ausgeführt wird
    console.log('Button wurde geklickt');
    
    // Leite zu question1.php weiter
    window.location.href = 'question1.php';
});
