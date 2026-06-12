<?php
// php-backend/api/auth/logout.php

if ($requestMethod !== 'POST') {
    throw new Exception("Method not allowed", 405);
}

setcookie("skilllanka_token", "", [
    'expires' => time() - 3600,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax'
]);

echo json_encode([
    "success" => true,
    "message" => "Logged out successfully."
]);
exit;
