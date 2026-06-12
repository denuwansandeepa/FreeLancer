<?php
// php-backend/api/hire-requests/messages.php

if ($requestMethod !== 'POST') {
    throw new Exception("Method not allowed", 405);
}

$session = getUserSession();
$userId = $session['id'];

$stmt = $db->prepare("
    SELECT hr.*, 
           c.name as clientName, f.name as freelancerName
    FROM HireRequest hr
    JOIN User c ON hr.clientId = c.id
    JOIN User f ON hr.freelancerId = f.id
    WHERE hr.id = ?
");
$stmt->execute([$hireRequestId]);
$hireRequest = $stmt->fetch();

if (!$hireRequest) {
    throw new Exception("Hire request not found", 404);
}

if ($hireRequest['clientId'] !== $userId && $hireRequest['freelancerId'] !== $userId) {
    throw new Exception("Forbidden", 403);
}

$message = trim($input['message'] ?? '');

if ($message === '') {
    throw new Exception("Message is required", 400);
}

$db->beginTransaction();

$msgId = generateCuid();
$stmtInsert = $db->prepare("
    INSERT INTO ChatMessage (id, isRead, hireRequestId, senderId, message, createdAt)
    VALUES (?, 0, ?, ?, ?, NOW())
");
$stmtInsert->execute([
    $msgId,
    $hireRequestId,
    $userId,
    $message
]);

$recipientId = $userId === $hireRequest['clientId'] ? $hireRequest['freelancerId'] : $hireRequest['clientId'];
$senderName = $userId === $hireRequest['clientId'] ? $hireRequest['clientName'] : $hireRequest['freelancerName'];
$previewText = strlen($message) > 40 ? trim(substr($message, 0, 40)) . "..." : $message;

// Create notification
$notifId = generateCuid();
$stmtNotif = $db->prepare("
    INSERT INTO Notification (id, userId, text, link, read, createdAt)
    VALUES (?, ?, ?, ?, 0, NOW())
");
$stmtNotif->execute([
    $notifId,
    $recipientId,
    "New message from " . $senderName . ": \"" . $previewText . "\"",
    "/dashboard?requestId=" . $hireRequestId
]);

$db->commit();

// Get created message
$stmt = $db->prepare("SELECT id, message, senderId, createdAt FROM ChatMessage WHERE id = ?");
$stmt->execute([$msgId]);
$chatMsg = $stmt->fetch();

echo json_encode([
    "success" => true,
    "message" => $chatMsg
]);
exit;
