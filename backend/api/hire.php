<?php
// php-backend/api/hire.php

if ($requestMethod !== 'POST') {
    throw new Exception("Method not allowed", 405);
}

$session = getUserSession();
$clientId = $session['id'];

if ($session['role'] !== 'CLIENT') {
    throw new Exception("Only clients can hire freelancers.", 403);
}

$serviceId = $input['serviceId'] ?? null;
$freelancerProfileId = $input['freelancerProfileId'] ?? null;
$message = trim($input['message'] ?? '');
$budget = trim($input['budget'] ?? '');

$freelancerId = "";
$finalServiceId = $serviceId ?: null;

if ($serviceId) {
    $stmt = $db->prepare("
        SELECT s.*, fp.userId
        FROM Service s
        JOIN FreelancerProfile fp ON s.freelancerProfileId = fp.id
        WHERE s.id = ?
    ");
    $stmt->execute([$serviceId]);
    $service = $stmt->fetch();

    if (!$service) {
        throw new Exception("Service not found", 404);
    }
    $freelancerId = $service['userId'];
} elseif ($freelancerProfileId) {
    $stmt = $db->prepare("SELECT userId FROM FreelancerProfile WHERE id = ?");
    $stmt->execute([$freelancerProfileId]);
    $profile = $stmt->fetch();

    if (!$profile) {
        throw new Exception("Freelancer profile not found", 404);
    }
    $freelancerId = $profile['userId'];
} else {
    throw new Exception("Missing serviceId or freelancerProfileId", 400);
}

if ($clientId === $freelancerId) {
    throw new Exception("You cannot hire yourself", 400);
}

$db->beginTransaction();

$hireId = generateCuid();
$stmtInsert = $db->prepare("
    INSERT INTO HireRequest (id, clientId, freelancerId, serviceId, jobRequestId, message, budget, status, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, NULL, ?, ?, 'PENDING', NOW(), NOW())
");
$stmtInsert->execute([
    $hireId,
    $clientId,
    $freelancerId,
    $finalServiceId,
    $message ?: "I would like to hire you for your services.",
    $budget ?: null
]);

// Create notification for freelancer
$notifId = generateCuid();
$stmtNotif = $db->prepare("
    INSERT INTO Notification (id, userId, text, link, read, createdAt)
    VALUES (?, ?, ?, ?, 0, NOW())
");
$stmtNotif->execute([
    $notifId,
    $freelancerId,
    "New hire request received from " . $session['name'] . ".",
    "/dashboard?requestId=" . $hireId
]);

$db->commit();

// Fetch hire request
$stmt = $db->prepare("SELECT * FROM HireRequest WHERE id = ?");
$stmt->execute([$hireId]);
$hireRequest = $stmt->fetch();

echo json_encode([
    "success" => true,
    "message" => "Hire request sent successfully!",
    "hireRequest" => $hireRequest
]);
exit;
