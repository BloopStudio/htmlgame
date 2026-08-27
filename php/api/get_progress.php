<?php
/**
 * Récupère la progression sauvegardée d'un joueur.
 * Requête attendue : GET ?token=xxxx
 */

declare(strict_types=1);

require __DIR__ . '/_storage.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    codequest_json_response(['error' => 'Méthode non autorisée, utilise GET.'], 405);
}

$token = isset($_GET['token']) ? (string) $_GET['token'] : '';
$path = codequest_progress_path($token);
if ($path === null) {
    codequest_json_response(['error' => 'Token invalide.'], 400);
}

if (!is_file($path)) {
    codequest_json_response(['completed' => new stdClass(), 'xp' => 0]);
}

$content = file_get_contents($path);
$progress = json_decode($content ?: '', true);
if (!is_array($progress)) {
    codequest_json_response(['completed' => new stdClass(), 'xp' => 0]);
}

codequest_json_response($progress);
