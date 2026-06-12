<?php
// php-backend/api/job-requests/apply.php

if ($requestMethod !== 'POST') {
    throw new Exception("Method not allowed", 405);
}

$session = getUserSession();
$freelancerId = $session['id'];

if ($session['role'] !== 'FREELANCER') {
    throw new Exception("Only freelancers can apply to jobs.", 403);
}

$jobRequestId = $input['jobRequestId'] ?? '';
$message = trim($input['message'] ?? '');
$budget = trim($input['budget'] ?? '');

if (!$jobRequestId || !$message) {
    throw new Exception("Missing required fields.", 400);
}

$stmt = $db->prepare("SELECT * FROM JobRequest WHERE id = ?");
$stmt->execute([$jobRequestId]);
$jobRequest = $stmt->fetch();

if (!$jobRequest) {
    throw new Exception("Job request not found.", 404);
}

// Check if already applied
$stmtCheck = $db->prepare("SELECT id FROM HireRequest WHERE freelancerId = ? AND jobRequestId = ?");
$stmtCheck->execute([$freelancerId, $jobRequestId]);
if ($stmtCheck->fetch()) {
    throw new Exception("You have already applied for this job.", 400);
}

$hireId = generateCuid();
$stmtInsert = $db->prepare("
    INSERT INTO HireRequest (id, clientId, freelancerId, serviceId, jobRequestId, message, budget, status, createdAt, updatedAt)
    VALUES (?, ?, ?, NULL, ?, ?, ?, 'PENDING', NOW(), NOW())
");
$stmtInsert->execute([
    $hireId,
    $jobRequest['clientId'],
    $freelancerId,
    $jobRequestId,
    $message,
    $budget ?: null
]);

// Fetch created application
$stmt = $db->prepare("SELECT * FROM HireRequest WHERE id = ?");
$stmt->execute([$hireId]);
$hireRequest = $stmt->fetch();

echo json_encode([
    "success" => true,
    "message" => "Application sent successfully!",
    "hireRequest" => $hireRequest
]);
exit;
