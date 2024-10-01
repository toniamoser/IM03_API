<?php

// Include the config file
require_once 'config.php';

function fetchMusicData() {
    $url = "https://energy.ch/api/channels/bern/playouts";

    // Initialize a cURL session
    $ch = curl_init($url);

    // Set options
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute the cURL session and get the content
    $response = curl_exec($ch);

    // Close the cURL session
    curl_close($ch);

    // Decode the JSON response and return data
    return json_decode($response, true);
}

$data = fetchMusicData();

// Connect to the database
try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Prepare the SQL statement (without the id field if it's auto-increment)
$sql = "INSERT INTO MusicPlayouts (playFrom, imageUrl, audioUrl, title, artist) 
        VALUES (:playFrom, :imageUrl, :audioUrl, :title, :artist)";
$stmt = $pdo->prepare($sql);

// Iterate through the music data array
foreach ($data as $song) {
    // Ensure required fields are set
    if (isset($song['playFrom'], $song['imageUrl'], $song['audioUrl'], $song['title'])) {
        // Use NULL if 'artist' is missing since it's optional
        $stmt->execute([
            ':playFrom' => $song['playFrom'],
            ':imageUrl' => $song['imageUrl'],
            ':audioUrl' => $song['audioUrl'],
            ':title' => $song['title'],
            ':artist' => $song['artist'] ?? null // Default to NULL if artist is not set
        ]);
    } else {
        // Log or echo if song is skipped due to missing mandatory data
        echo "Skipping song due to missing data. Required fields: playFrom, imageUrl, audioUrl, title.\n";
    }
}

echo "Data successfully inserted into the database.";
?>
