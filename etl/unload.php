<?php

require_once 'config.php'; // Stellen Sie sicher, dass dies auf Ihre tatsächliche Konfigurationsdatei verweist

header('Content-Type: application/json');

try {
    // Verbindet sich mit der Datenbank
    $pdo = new PDO($dsn, $username, $password, $options);

    // SQL-Abfrage, um alle relevanten Informationen zu jedem Song zu holen, sortiert nach playFrom
    $stmt = $pdo->prepare("SELECT * FROM MusicPlayouts");

    // Führt die Abfrage aus
    $stmt->execute();

    // Holt alle Ergebnisse und speichert sie im Array $results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gibt die Daten im JSON-Format aus
    echo json_encode($results);

} catch (PDOException $e) {
    // Gibt einen Fehler im JSON-Format aus, falls eine Ausnahme auftritt
    echo json_encode(['error' => $e->getMessage()]);
}
?>
