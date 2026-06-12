<?php
// php-backend/api/auth/me.php

if ($requestMethod !== 'GET') {
    throw new Exception("Method not allowed", 405);
}

$session = getUserSession();
$stmt = $db->prepare("SELECT id, name, email, role, phone, location, image, createdAt FROM User WHERE id = ?");
$stmt->execute([$session['id']]);
$user = $stmt->fetch();

if (!$user) {
    throw new Exception("User not found.", 404);
}

checkAndUpdateAdminRole($db, $user['email'], $user['id']);

// Re-fetch user in case the role was updated
$stmt = $db->prepare("SELECT id, name, email, role, phone, location, image, createdAt FROM User WHERE id = ?");
$stmt->execute([$session['id']]);
$user = $stmt->fetch();

echo json_encode([
    "success" => true,
    "user" => $user
]);
exit;
