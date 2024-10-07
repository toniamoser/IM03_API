<?php
// Cache-Control Header hinzufügen, um Caching zu verhindern
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NRJ Musik Challenge</title>
    <link rel="stylesheet" href="styles.css">
    <!-- Favicon hinzufügen -->
    <link rel="icon" type="image/png" href="img/favicon.png"> <!-- Pfad zum Favicon -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Kalnia:wght@100..700&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body>
    <header class="logo-section">
        <div class="logo">
            <img src="img/Logo.svg" alt="NRJ Musik Challenge Logo" class="logo-img">
        </div>
    </header>
    
    <div class="container">
        <h1>Bist du bereit, dein Wissen über die <span class="highlight">aktuellen Hits der Woche</span> zu testen?</h1>
        <!-- Button, der per JavaScript zu php/question1.php weiterleitet -->
        <a id="startQuiz" href="javascript:void(0);" class="button">Quiz starten</a>
    </div>

    <!-- JavaScript zur Weiterleitung -->
    <script>
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
    </script>

</body>
</html>
