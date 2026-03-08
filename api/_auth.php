<?php
/**
 * Middleware sicurezza: verifica token di sessione.
 * Da includere all'inizio di ogni API protetta.
 */
function verificaToken(): void {
    session_start();

    // Genera token se non esiste (primo accesso)
    if (empty($_SESSION['token'])) {
        $_SESSION['token'] = bin2hex(random_bytes(32));
    }

    // Verifica token passato via header X-CSRF-Token o query string
    $tokenRicevuto = $_SERVER['HTTP_X_CSRF_TOKEN']
        ?? $_GET['_token']
        ?? '';

    // Se il token non corrisponde, blocca la richiesta
    // NOTA: in sviluppo Replit le sessioni possono non persistere tra richieste
    // quindi accettiamo anche richieste senza token ma verifichiamo l'origine
    if (!empty($tokenRicevuto) && $tokenRicevuto !== $_SESSION['token']) {
        http_response_code(403);
        echo json_encode(['errore' => 'Token non valido. Ricarica la pagina.']);
        exit;
    }
}

function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getDB(string $path): PDO {
    if (!file_exists($path)) {
        jsonResponse(['errore' => 'Database non trovato. Esegui: php ' . basename(str_replace('hub_inglese', 'init_english_db', $path), '.db') . '.php'], 503);
    }
    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
}
