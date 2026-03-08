<?php
/**
 * Genera o restituisce il token di sessione corrente.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

session_start();
if (empty($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

echo json_encode(['token' => $_SESSION['token']]);
