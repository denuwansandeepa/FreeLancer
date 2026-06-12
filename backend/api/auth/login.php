<?php
// php-backend/api/auth/login.php

if ($requestMethod !== 'POST') {
    throw new Exception("Method not allowed", 405);
}

$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    throw new Exception("Email and password are required.", 400);
}

$stmt = $db->prepare("SELECT * FROM User WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    throw new Exception("Invalid email or password.", 401);
}

checkAndUpdateAdminRole($db, $user['email'], $user['id']);

// Re-fetch user in case the role was updated
$stmt = $db->prepare("SELECT * FROM User WHERE id = ?");
$stmt->execute([$user['id']]);
$user = $stmt->fetch();

$token = createToken([
    "id" => $user['id'],
    "name" => $user['name'],
    "email" => $user['email'],
    "role" => $user['role']
]);

// Set Cookie
setcookie("skilllanka_token", $token, [
    'expires' => time() + 10800,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax'
]);

echo json_encode([
    "success" => true,
    "message" => "Login successful.",
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "role" => $user['role'],
        "phone" => $user['phone'],
        "location" => $user['location']
    ]
]);
exit;
