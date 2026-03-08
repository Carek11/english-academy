<?php
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonResponse(['success' => false, 'message' => 'Metodo non consentito'], 405); }

verificaToken();

$body  = json_decode(file_get_contents('php://input'), true) ?? [];
$email = trim($body['email']    ?? '');
$pw    = $body['password']      ?? '';

if (!$email || !$pw) {
    jsonResponse(['success' => false, 'message' => 'Inserisci email e password.'], 400);
}

$dbPath = __DIR__ . '/../data/hub_inglese.db';
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare('SELECT id, nome, password_hash FROM utenti WHERE email = ?');
    $stmt->execute([$email]);
    $utente = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$utente || !password_verify($pw, $utente['password_hash'])) {
        jsonResponse(['success' => false, 'message' => 'Email o password non corretti.'], 401);
    }

    $_SESSION['utente'] = ['id' => $utente['id'], 'nome' => $utente['nome'], 'email' => $email];

    jsonResponse(['success' => true, 'message' => "Bentornato, {$utente['nome']}!", 'nome' => $utente['nome']]);
} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Errore database.'], 500);
}
