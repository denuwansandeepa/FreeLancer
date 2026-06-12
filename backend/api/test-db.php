<?php
// php-backend/api/test-db.php

if ($requestMethod !== 'GET') {
    throw new Exception("Method not allowed", 405);
}

$userCount = $db->query("SELECT COUNT(*) FROM User")->fetchColumn();
echo json_encode([
    "success" => true,
    "message" => "PHP backend successfully connected to the XAMPP MySQL database!",
    "total_users_in_db" => (int)$userCount
]);
exit;
