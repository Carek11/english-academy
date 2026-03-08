<?php
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonResponse(['success' => false, 'message' => 'Metodo non consentito'], 405); }

verificaToken();

$body    = json_decode(file_get_contents('php://input'), true) ?? [];
$nome    = trim($body['nome']    ?? '');
$cognome = trim($body['cognome'] ?? '');
$email   = trim($body['email']   ?? '');
$pw      = $body['password']     ?? '';
$corso   = trim($body['corso']   ?? '');

if (!$nome || !$cognome || !$email || !$pw) {
    jsonResponse(['success' => false, 'message' => 'Compila tutti i campi obbligatori.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Indirizzo email non valido.'], 400);
}
if (strlen($pw) < 6) {
    jsonResponse(['success' => false, 'message' => 'La password deve essere di almeno 6 caratteri.'], 400);
}

$dbPath = __DIR__ . '/../data/hub_inglese.db';
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $check = $pdo->prepare('SELECT id FROM utenti WHERE email = ?');
    $check->execute([$email]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email già registrata. Prova ad accedere.'], 409);
    }

    $hash = password_hash($pw, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO utenti (nome, cognome, email, password_hash, corso_interesse) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$nome, $cognome, $email, $hash, $corso]);

    $_SESSION['utente'] = ['id' => $pdo->lastInsertId(), 'nome' => $nome, 'email' => $email];

    jsonResponse(['success' => true, 'message' => "Benvenuto, {$nome}!", 'nome' => $nome]);
} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Errore database.'], 500);
}
