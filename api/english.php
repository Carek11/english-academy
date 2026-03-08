<?php
/**
 * API: Esercizi inglese con paginazione e filtri.
 * GET /api/english?corso=...&argomento=...&q=...&page=1&per_page=20
 */
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
verificaToken();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['errore' => 'Metodo non consentito'], 405);
}

$dbPath   = __DIR__ . '/../data/hub_inglese.db';
$pdo      = getDB($dbPath);

$corso    = trim($_GET['corso']    ?? '');
$argomento= trim($_GET['argomento']?? '');
$livello  = trim($_GET['livello']  ?? '');
$q        = trim($_GET['q']        ?? '');
$page     = max(1, (int)($_GET['page']     ?? 1));
$perPage  = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
$offset   = ($page - 1) * $perPage;

$cond = [];
$vals = [];

if ($corso)     { $cond[] = 'corso = ?';     $vals[] = $corso; }
if ($argomento) { $cond[] = 'argomento = ?'; $vals[] = $argomento; }
if ($livello)   { $cond[] = 'livello = ?';   $vals[] = $livello; }
if ($q) {
    $cond[] = '(testo LIKE ? OR argomento LIKE ?)';
    $vals[] = "%$q%"; $vals[] = "%$q%";
}

$where = $cond ? 'WHERE ' . implode(' AND ', $cond) : '';

$totale = (int)$pdo->prepare("SELECT COUNT(*) FROM esercizi $where")
              ->execute($vals) ? $pdo->query("SELECT COUNT(*) FROM esercizi $where")->fetchColumn() : 0;

// Riesegui con bind corretto
$stmtCount = $pdo->prepare("SELECT COUNT(*) FROM esercizi $where");
$stmtCount->execute($vals);
$totale = (int)$stmtCount->fetchColumn();

$stmt = $pdo->prepare("SELECT id, corso, argomento, livello, testo, soluzione FROM esercizi $where ORDER BY id LIMIT ? OFFSET ?");
$stmt->execute(array_merge($vals, [$perPage, $offset]));
$esercizi = $stmt->fetchAll();

jsonResponse([
    'esercizi'   => $esercizi,
    'totale'     => $totale,
    'page'       => $page,
    'per_page'   => $perPage,
    'pagine_tot' => (int)ceil($totale / $perPage),
]);
