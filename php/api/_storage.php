<?php
/**
 * Petites fonctions partagées par les endpoints de l'API PHP.
 *
 * Ce backend est optionnel : il ne fonctionne que si le site est servi par
 * un vrai serveur PHP (ex: `php -S localhost:8000` ou un hébergeur avec PHP).
 * Sur GitHub Pages, ces fichiers ne sont jamais exécutés, et le jeu utilise
 * alors uniquement localStorage (voir js/app.js). Rien ici n'est requis pour
 * jouer : c'est une démonstration d'un vrai backend PHP pour celles et ceux
 * qui veulent aussi s'exercer côté serveur.
 */

declare(strict_types=1);

function codequest_progress_dir(): string
{
    return __DIR__ . '/../data/progress';
}

/**
 * Un token ne doit contenir que des caractères alphanumériques, tirets et
 * underscores, pour éviter toute tentative de path traversal (../).
 */
function codequest_sanitize_token(string $token): ?string
{
    if (preg_match('/^[a-zA-Z0-9_-]{4,64}$/', $token) === 1) {
        return $token;
    }
    return null;
}

function codequest_progress_path(string $token): ?string
{
    $safe = codequest_sanitize_token($token);
    if ($safe === null) {
        return null;
    }
    return codequest_progress_dir() . '/' . $safe . '.json';
}

function codequest_json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}
