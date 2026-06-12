<?php
// php-backend/api/job-requests.php

if ($requestMethod === 'GET') {
    $stmt = $db->query("
        SELECT jr.*, u.id as clientId, u.name as clientName, u.email as clientEmail, u.location as clientLocation
        FROM JobRequest jr
        JOIN User u ON jr.clientId = u.id
        ORDER BY jr.createdAt DESC
    ");
    $jobs = $stmt->fetchAll();

    $formattedJobs = [];
    foreach ($jobs as $j) {
        $formattedJobs[] = [
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
                "id" => $j['clientId'],
                "name" => $j['clientName'],
                "email" => $j['clientEmail'],
                "location" => $j['clientLocation']
            ]
        ];
    }

    echo json_encode([
        "success" => true,
        "jobRequests" => $formattedJobs
    ]);
    exit;
}

elseif ($requestMethod === 'POST') {
    $session = getUserSession();
    $clientId = $session['id'];

    if ($session['role'] !== 'CLIENT') {
        throw new Exception("Forbidden: Only clients are allowed to post job requests.", 403);
    }

    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $category = trim($input['category'] ?? '');
    $budget = trim($input['budget'] ?? '');
    $deadline = trim($input['deadline'] ?? '');
    $location = trim($input['location'] ?? '');
    $skills = trim($input['skills'] ?? '');

    if (!$title || !$description || !$category || !$budget) {
        throw new Exception("Title, description, category, and budget are required.", 400);
    }

    $jobId = generateCuid();
    $stmt = $db->prepare("
        INSERT INTO JobRequest (id, clientId, title, description, category, budget, deadline, location, skills, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', NOW(), NOW())
    ");
    $stmt->execute([
        $jobId,
        $clientId,
        $title,
        $description,
        $category,
        $budget,
        $deadline ?: null,
        $location ?: null,
        $skills ?: null
    ]);

    // Fetch created job request
    $stmt = $db->prepare("
        SELECT jr.*, u.id as uId, u.name as clientName, u.email as clientEmail, u.location as clientLocation
        FROM JobRequest jr
        JOIN User u ON jr.clientId = u.id
        WHERE jr.id = ?
    ");
    $stmt->execute([$jobId]);
    $j = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Job request posted successfully.",
        "jobRequest" => [
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
            "client" => [
                "id" => $j['clientId'],
                "name" => $j['clientName'],
                "email" => $j['clientEmail'],
                "location" => $j['clientLocation']
            ]
        ]
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
