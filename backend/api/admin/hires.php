<?php
// php-backend/api/admin/hires.php

$session = getUserSession();
authorizeAdmin($session['email'], $session['role']);

if ($requestMethod === 'GET') {
    $stmt = $db->query("
        SELECT hr.*, 
               c.name as clientName, c.email as clientEmail,
               f.name as freelancerName, f.email as freelancerEmail,
               s.title as serviceTitle
        FROM HireRequest hr
        JOIN User c ON hr.clientId = c.id
        JOIN User f ON hr.freelancerId = f.id
        LEFT JOIN Service s ON hr.serviceId = s.id
        ORDER BY hr.createdAt DESC
    ");
    $hires = $stmt->fetchAll();

    $formatted = [];
    foreach ($hires as $h) {
        $formatted[] = [
            "id" => $h['id'],
            "clientId" => $h['clientId'],
            "freelancerId" => $h['freelancerId'],
            "serviceId" => $h['serviceId'],
            "jobRequestId" => $h['jobRequestId'],
            "message" => $h['message'],
            "budget" => $h['budget'],
            "status" => $h['status'],
            "createdAt" => $h['createdAt'],
            "updatedAt" => $h['updatedAt'],
            "client" => [
                "name" => $h['clientName'],
                "email" => $h['clientEmail']
            ],
            "freelancer" => [
                "name" => $h['freelancerName'],
                "email" => $h['freelancerEmail']
            ],
            "service" => $h['serviceId'] ? ["title" => $h['serviceTitle']] : null
        ];
    }

    echo json_encode([
        "success" => true,
        "hires" => $formatted
    ]);
    exit;
}

elseif ($requestMethod === 'DELETE') {
    $hireId = $_GET['id'] ?? null;

    if (!$hireId) {
        throw new Exception("Hire request ID is required", 400);
    }

    $stmt = $db->prepare("DELETE FROM HireRequest WHERE id = ?");
    $stmt->execute([$hireId]);

    echo json_encode([
        "success" => true,
        "message" => "Hire request deleted successfully"
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
