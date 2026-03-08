<?php
/**
 * PHP Built-in Server Router
 * Blocca accesso a /data/, gestisce tutte le route API e serve i file statici.
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Blocca accesso diretto ai database e alla cartella data/
if (preg_match('#^/data/#', $uri)) {
    http_response_code(403);
    echo json_encode(['error' => 'Accesso negato']);
    exit;
}

// Route API
$apiRoutes = [
    '/api/english'    => __DIR__ . '/api/english.php',
    '/api/courses'    => __DIR__ . '/api/courses.php',
    '/api/exercises'  => __DIR__ . '/api/exercises.php',
    '/api/ai-tutor'   => __DIR__ . '/api/ai_tutor.php',
    '/api/contact'    => __DIR__ . '/api/contact.php',
    '/api/token'      => __DIR__ . '/api/token.php',
];

foreach ($apiRoutes as $route => $file) {
    if (strpos($uri, $route) === 0) {
        require $file;
        exit;
    }
}

// File statici (CSS, JS, immagini, font)
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; // serve il file direttamente
}

// Tutto il resto → index.php (SPA)
require __DIR__ . '/index.php';
