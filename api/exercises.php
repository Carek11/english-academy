<?php
/**
 * API: Esercizi programmazione.
 * GET /api/exercises?categoria=...&difficolta=...&q=...&page=1&per_page=20
 */
require_once __DIR__ . '/_auth.php';

header('Content-Type: application/json; charset=utf-8');
verificaToken();

$dbPath    = __DIR__ . '/../data/exercises.db';

if (!file_exists($dbPath)) {
    // Prova percorso legacy
    $alt = __DIR__ . '/../exercises.db';
    if (file_exists($alt)) $dbPath = $alt;
    else jsonResponse(['errore' => 'DB programmazione non trovato.'], 503);
}

$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$categoria  = trim($_GET['categoria']  ?? '');
$difficolta = trim($_GET['difficolta'] ?? '');
$q          = trim($_GET['q']          ?? '');
$page       = max(1, (int)($_GET['page']     ?? 1));
$perPage    = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
$offset     = ($page - 1) * $perPage;

$cond = []; $vals = [];
if ($categoria)  { $cond[] = 'categoria = ?';  $vals[] = $categoria; }
if ($difficolta) { $cond[] = 'difficolta = ?'; $vals[] = $difficolta; }
if ($q) {
    $cond[] = '(titolo LIKE ? OR testo LIKE ?)';
    $vals[] = "%$q%"; $vals[] = "%$q%";
}
$where = $cond ? 'WHERE ' . implode(' AND ', $cond) : '';

$stmtCount = $pdo->prepare("SELECT COUNT(*) FROM esercizi $where");
$stmtCount->execute($vals);
$totale = (int)$stmtCount->fetchColumn();

$stmt = $pdo->prepare("SELECT id,categoria,sotto,difficolta,titolo,testo,soluzione FROM esercizi $where ORDER BY id LIMIT ? OFFSET ?");
$stmt->execute(array_merge($vals, [$perPage, $offset]));

jsonResponse([
    'esercizi'   => $stmt->fetchAll(),
    'totale'     => $totale,
    'page'       => $page,
    'per_page'   => $perPage,
    'pagine_tot' => (int)ceil($totale / $perPage),
]);
