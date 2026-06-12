<?php
// php-backend/api/hire-requests/detail.php

$session = getUserSession();
$userId = $session['id'];

if ($requestMethod === 'GET') {
    $stmt = $db->prepare("
        SELECT hr.*, 
               c.id as cId, c.name as clientName, c.image as clientImage,
               f.id as fId, f.name as freelancerName, f.image as freelancerImage,
               s.title as serviceTitle,
               jr.title as jobRequestTitle
        FROM HireRequest hr
        JOIN User c ON hr.clientId = c.id
        JOIN User f ON hr.freelancerId = f.id
        LEFT JOIN Service s ON hr.serviceId = s.id
        LEFT JOIN JobRequest jr ON hr.jobRequestId = jr.id
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

    // Fetch chat messages
    $stmtMsg = $db->prepare("
        SELECT id, message, senderId, createdAt 
        FROM ChatMessage 
        WHERE hireRequestId = ? 
        ORDER BY createdAt ASC
    ");
    $stmtMsg->execute([$hireRequestId]);
    $chatMessages = $stmtMsg->fetchAll();

    $formatted = [
        "id" => $hireRequest['id'],
        "clientId" => $hireRequest['clientId'],
        "freelancerId" => $hireRequest['freelancerId'],
        "serviceId" => $hireRequest['serviceId'],
        "jobRequestId" => $hireRequest['jobRequestId'],
        "message" => $hireRequest['message'],
        "budget" => $hireRequest['budget'],
        "status" => $hireRequest['status'],
        "createdAt" => $hireRequest['createdAt'],
        "updatedAt" => $hireRequest['updatedAt'],
        "client" => [
            "id" => $hireRequest['cId'],
            "name" => $hireRequest['clientName'],
            "image" => $hireRequest['clientImage']
        ],
        "freelancer" => [
            "id" => $hireRequest['fId'],
            "name" => $hireRequest['freelancerName'],
            "image" => $hireRequest['freelancerImage']
        ],
        "service" => $hireRequest['serviceId'] ? ["title" => $hireRequest['serviceTitle']] : null,
        "jobRequest" => $hireRequest['jobRequestId'] ? ["title" => $hireRequest['jobRequestTitle']] : null,
        "chatMessages" => $chatMessages
    ];

    echo json_encode([
        "success" => true,
        "hireRequest" => $formatted
    ]);
    exit;
}

elseif ($requestMethod === 'PATCH') {
    $status = $input['status'] ?? '';

    if (!in_array($status, ["ACCEPTED", "REJECTED", "COMPLETED"])) {
        throw new Exception("Invalid status", 400);
    }

    $stmt = $db->prepare("
        SELECT hr.*, 
               c.name as clientName, f.name as freelancerName,
               jr.title as jobRequestTitle
        FROM HireRequest hr
        JOIN User c ON hr.clientId = c.id
        JOIN User f ON hr.freelancerId = f.id
        LEFT JOIN JobRequest jr ON hr.jobRequestId = jr.id
        WHERE hr.id = ?
    ");
    $stmt->execute([$hireRequestId]);
    $hireRequest = $stmt->fetch();

    if (!$hireRequest) {
        throw new Exception("Hire request not found", 404);
    }

    $isJobApplication = ($hireRequest['jobRequestId'] !== null);
    $isAuthorized = false;

    if ($status === 'ACCEPTED' || $status === 'REJECTED') {
        if ($isJobApplication) {
            $isAuthorized = ($hireRequest['clientId'] === $userId);
        } else {
            $isAuthorized = ($hireRequest['freelancerId'] === $userId);
        }
    } elseif ($status === 'COMPLETED') {
        $isAuthorized = ($hireRequest['clientId'] === $userId || $hireRequest['freelancerId'] === $userId) && ($hireRequest['status'] === 'ACCEPTED');
    }

    if (!$isAuthorized) {
        throw new Exception("You are not authorized to update status for this request.", 403);
    }

    $db->beginTransaction();

    // Update status
    $stmtUpdate = $db->prepare("UPDATE HireRequest SET status = ?, updatedAt = NOW() WHERE id = ?");
    $stmtUpdate->execute([$status, $hireRequestId]);

    // If job application accepted, mark parent job request status as ACCEPTED
    if ($status === 'ACCEPTED' && $isJobApplication && $hireRequest['jobRequestId']) {
        $stmtJob = $db->prepare("UPDATE JobRequest SET status = 'ACCEPTED', updatedAt = NOW() WHERE id = ?");
        $stmtJob->execute([$hireRequest['jobRequestId']]);
    }

    // Notifications
    $recipientId = "";
    $text = "";

    if ($isJobApplication) {
        // Client updated status -> notify freelancer
        $recipientId = $hireRequest['freelancerId'];
        $jobTitle = $hireRequest['jobRequestTitle'] ?: "job request";
        if ($status === 'ACCEPTED') {
            $text = $hireRequest['clientName'] . " accepted your application for the job: \"" . $jobTitle . "\".";
        } elseif ($status === 'REJECTED') {
            $text = $hireRequest['clientName'] . " declined your application for the job: \"" . $jobTitle . "\".";
        } elseif ($status === 'COMPLETED') {
            $text = $hireRequest['clientName'] . " marked the job \"" . $jobTitle . "\" as completed.";
        }
    } else {
        // Freelancer updated status -> notify client
        $recipientId = $hireRequest['clientId'];
        if ($status === 'ACCEPTED') {
            $text = $hireRequest['freelancerName'] . " accepted your custom service offer.";
        } elseif ($status === 'REJECTED') {
            $text = $hireRequest['freelancerName'] . " declined your hire request.";
        } elseif ($status === 'COMPLETED') {
            $text = $hireRequest['freelancerName'] . " marked the request as completed.";
        }
    }

    if ($recipientId && $text) {
        $notifId = generateCuid();
        $stmtNotif = $db->prepare("
            INSERT INTO Notification (id, userId, text, link, read, createdAt)
            VALUES (?, ?, ?, ?, 0, NOW())
        ");
        $stmtNotif->execute([
            $notifId,
            $recipientId,
            $text,
            "/dashboard?requestId=" . $hireRequestId
        ]);
    }

    $db->commit();

    // Fetch updated request
    $stmt = $db->prepare("SELECT * FROM HireRequest WHERE id = ?");
    $stmt->execute([$hireRequestId]);
    $updatedRequest = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Request marked as " . $status,
        "hireRequest" => $updatedRequest
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
