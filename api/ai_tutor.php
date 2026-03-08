<?php
/**
 * API: AI Tutor — spiega grammatica senza dare la soluzione.
 * POST /api/ai-tutor
 * Body JSON: { esercizio, domanda, cronologia[] }
 *
 * Usa OpenAI gpt-4o-mini via Replit AI Integrations
 */
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { jsonResponse(['errore' => 'Metodo non consentito'], 405); }

verificaToken();

$body     = json_decode(file_get_contents('php://input'), true) ?? [];
$esercizio= trim($body['esercizio'] ?? '');
$domanda  = trim($body['domanda']   ?? '');
$cronologia = array_slice($body['cronologia'] ?? [], -6);

if (!$domanda) {
    jsonResponse(['errore' => 'Domanda mancante'], 400);
}

$apiKey  = getenv('AI_INTEGRATIONS_OPENAI_API_KEY') ?: '';
$baseUrl = rtrim(getenv('AI_INTEGRATIONS_OPENAI_BASE_URL') ?: 'https://api.openai.com', '/');

if (!$apiKey) {
    jsonResponse(['errore' => 'Chiave API OpenAI non configurata (Replit AI Integrations).'], 500);
}

// Costruisci la lista messaggi
$systemPrompt = "Sei un tutor di inglese esperto e paziente. "
    . "Il tuo compito è spiegare le regole grammaticali, il vocabolario e i concetti "
    . "legati all'esercizio fornito dallo studente, senza mai dare direttamente la soluzione. "
    . "Usa esempi chiari, spiega il 'perché' dietro la regola e incoraggia lo studente a ragionare. "
    . "Rispondi sempre in italiano, a meno che lo studente non scriva in inglese. "
    . "Sii conciso: massimo 3-4 frasi per risposta.";

$messages = [
    ['role' => 'system', 'content' => $systemPrompt],
];

if ($esercizio) {
    $messages[] = ['role' => 'user',      'content' => "Sto lavorando su questo esercizio:\n\n«{$esercizio}»"];
    $messages[] = ['role' => 'assistant', 'content' => "Perfetto! Sono qui per aiutarti. Cosa vorresti sapere?"];
}

foreach ($cronologia as $msg) {
    if (in_array($msg['role'] ?? '', ['user', 'assistant']) && !empty($msg['content'])) {
        $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
    }
}
$messages[] = ['role' => 'user', 'content' => $domanda];

$payload = json_encode([
    'model'      => 'gpt-4o-mini',
    'messages'   => $messages,
    'max_tokens' => 300,
    'temperature'=> 0.7,
]);

$ch = curl_init("{$baseUrl}/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        "Authorization: Bearer {$apiKey}",
    ],
    CURLOPT_TIMEOUT        => 30,
]);

$raw  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err  = curl_error($ch);
curl_close($ch);

if ($err) {
    jsonResponse(['errore' => "Errore curl: {$err}"], 500);
}

$resp = json_decode($raw, true);
if (!isset($resp['choices'][0]['message']['content'])) {
    jsonResponse(['errore' => 'Risposta AI non valida.', 'raw' => $resp], 500);
}

jsonResponse(['risposta' => trim($resp['choices'][0]['message']['content'])]);
