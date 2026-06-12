<?php
// php-backend/api/notifications.php

$session = getUserSession();
$userId = $session['id'];

if ($requestMethod === 'GET') {
    $stmt = $db->prepare("SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC");
    $stmt->execute([$userId]);
    $notifications = $stmt->fetchAll();

    // Format boolean fields properly from SQLite integers
    foreach ($notifications as &$n) {
        $n['read'] = (bool)$n['read'];
    }

    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);
    exit;
}

elseif ($requestMethod === 'PATCH') {
    $notificationId = $input['notificationId'] ?? null;

    if ($notificationId) {
        $stmt = $db->prepare("UPDATE Notification SET read = 1 WHERE id = ? AND userId = ?");
        $stmt->execute([$notificationId, $userId]);
    } else {
        $stmt = $db->prepare("UPDATE Notification SET read = 1 WHERE userId = ? AND read = 0");
        $stmt->execute([$userId]);
    }

    echo json_encode([
        "success" => true
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
