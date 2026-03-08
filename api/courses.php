<?php
/**
 * API: Lista corsi con conteggio esercizi.
 * GET /api/courses
 */
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
verificaToken();

$dbPath = __DIR__ . '/../data/hub_inglese.db';
$pdo    = getDB($dbPath);

$corsi = $pdo->query("SELECT corso, COUNT(*) as totale FROM esercizi GROUP BY corso ORDER BY corso")
             ->fetchAll();

$argomenti = $pdo->query("SELECT DISTINCT argomento FROM esercizi ORDER BY argomento")
                 ->fetchAll(PDO::FETCH_COLUMN);

$totale = (int)$pdo->query("SELECT COUNT(*) FROM esercizi")->fetchColumn();

jsonResponse([
    'corsi'     => $corsi,
    'argomenti' => $argomenti,
    'totale'    => $totale,
]);
