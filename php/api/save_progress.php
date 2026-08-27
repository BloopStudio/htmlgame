<?php
/**
 * Sauvegarde la progression d'un joueur dans un fichier JSON.
 * Appelé automatiquement par js/app.js après chaque défi réussi.
 * Requête attendue : POST { token: string, progress: { completed: object, xp: number } }
 */

declare(strict_types=1);

require __DIR__ . '/_storage.php';

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    codequest_json_response(['error' => 'Méthode non autorisée, utilise POST.'], 405);
}

$raw = file_get_contents('php://input');
$body = json_decode($raw ?: '', true);

if (!is_array($body) || !isset($body['token'], $body['progress'])) {
    codequest_json_response(['error' => 'Requête invalide.'], 400);
}

$path = codequest_progress_path((string) $body['token']);
if ($path === null) {
    codequest_json_response(['error' => 'Token invalide.'], 400);
}

$progress = $body['progress'];
if (!is_array($progress) || !isset($progress['completed'], $progress['xp'])) {
    codequest_json_response(['error' => 'Progression invalide.'], 400);
}

$dir = codequest_progress_dir();
if (!is_dir($dir)) {
    mkdir($dir, 0775, true);
}

$saved = file_put_contents($path, json_encode($progress));
if ($saved === false) {
    codequest_json_response(['error' => "Impossible d'écrire la progression."], 500);
}

codequest_json_response(['ok' => true]);
