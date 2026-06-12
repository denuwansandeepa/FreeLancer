<?php
// php-backend/api/admin/jobs.php

$session = getUserSession();
authorizeAdmin($session['email'], $session['role']);

if ($requestMethod === 'GET') {
    $stmt = $db->query("
        SELECT jr.*, u.name as clientName, u.email as clientEmail
        FROM JobRequest jr
        JOIN User u ON jr.clientId = u.id
        ORDER BY jr.createdAt DESC
    ");
    $jobs = $stmt->fetchAll();

    $formatted = [];
    foreach ($jobs as $j) {
        $formatted[] = [
            "id" => $j['id'],
            "clientId" => $j['clientId'],
            "title" => $j['title'],
            "description" => $j['description'],
            "category" => $j['category'],
            "budget" => $j['budget'],
            "deadline" => $j['deadline'],
            "location" => $j['location'],
            "skills" => $j['skills'],
            "status" => $j['status'],
            "createdAt" => $j['createdAt'],
            "updatedAt" => $j['updatedAt'],
            "client" => [
                "name" => $j['clientName'],
                "email" => $j['clientEmail']
            ]
        ];
    }

    echo json_encode([
        "success" => true,
        "jobs" => $formatted
    ]);
    exit;
}

elseif ($requestMethod === 'PATCH') {
    $id = $input['id'] ?? '';
    $title = $input['title'] ?? null;
    $description = $input['description'] ?? null;
    $category = $input['category'] ?? null;
    $budget = $input['budget'] ?? null;
    $deadline = $input['deadline'] ?? null;
    $location = $input['location'] ?? null;
    $skills = $input['skills'] ?? null;
    $status = $input['status'] ?? null;

    if (!$id) {
        throw new Exception("Job ID is required", 400);
    }

    $updates = [];
    $params = [];

    if ($title !== null) { $updates[] = "title = ?"; $params[] = $title; }
    if ($description !== null) { $updates[] = "description = ?"; $params[] = $description; }
    if ($category !== null) { $updates[] = "category = ?"; $params[] = $category; }
    if ($budget !== null) { $updates[] = "budget = ?"; $params[] = $budget; }
    if ($deadline !== null) { $updates[] = "deadline = ?"; $params[] = $deadline; }
    if ($location !== null) { $updates[] = "location = ?"; $params[] = $location; }
    if ($skills !== null) { $updates[] = "skills = ?"; $params[] = $skills; }
    if ($status !== null) { $updates[] = "status = ?"; $params[] = $status; }

    $updates[] = "updatedAt = NOW()";
    $params[] = $id;

    $sql = "UPDATE JobRequest SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $stmt = $db->prepare("SELECT * FROM JobRequest WHERE id = ?");
    $stmt->execute([$id]);
    $updated = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "job" => $updated
    ]);
    exit;
}

elseif ($requestMethod === 'DELETE') {
    $jobId = $_GET['id'] ?? null;

    if (!$jobId) {
        throw new Exception("Job ID is required", 400);
    }

    $stmt = $db->prepare("DELETE FROM JobRequest WHERE id = ?");
    $stmt->execute([$jobId]);

    echo json_encode([
        "success" => true,
        "message" => "Job request deleted"
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
