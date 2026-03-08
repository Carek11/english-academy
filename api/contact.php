<?php
/**
 * API: Modulo di contatto.
 * POST /api/contact
 */
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonResponse(['success' => false, 'message' => 'Metodo non consentito'], 405); }

verificaToken();

$body   = json_decode(file_get_contents('php://input'), true) ?? [];
$nome   = trim($body['name']    ?? '');
$email  = trim($body['email']   ?? '');
$msg    = trim($body['message'] ?? '');

if (!$nome || !$email || !$msg) {
    jsonResponse(['success' => false, 'message' => 'Compila tutti i campi.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Email non valida.'], 400);
}

$dest  = getenv('CONTACT_EMAIL') ?: 'info@englishacademy.it';
$corpo = "Da: {$nome}\nEmail: {$email}\n\n{$msg}";
$ok    = mail($dest, "Nuovo messaggio da {$nome}", $corpo, "From: {$email}");

jsonResponse(['success' => true, 'message' => 'Messaggio ricevuto!']);
