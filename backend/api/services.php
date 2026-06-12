<?php
// php-backend/api/services.php

if ($requestMethod === 'GET') {
    $stmt = $db->query("
        SELECT s.*, u.name as sellerName
        FROM Service s
        JOIN FreelancerProfile fp ON s.freelancerProfileId = fp.id
        JOIN User u ON fp.userId = u.id
        WHERE s.isActive = 1
        ORDER BY s.createdAt DESC
    ");
    $services = $stmt->fetchAll();

    $formatted = [];
    foreach ($services as $s) {
        $formatted[] = [
            "id" => $s['id'],
            "title" => $s['title'],
            "description" => $s['description'],
            "category" => $s['category'],
            "price" => $s['price'],
            "delivery" => $s['delivery'],
            "revision" => $s['revision'],
            "seller" => $s['sellerName'],
            "image" => $s['image']
        ];
    }

    echo json_encode([
        "success" => true,
        "services" => $formatted
    ]);
    exit;
}

elseif ($requestMethod === 'POST') {
    $session = getUserSession();
    $userId = $session['id'];

    $stmt = $db->prepare("SELECT * FROM User WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception("User not found", 404);
    }

    $stmtProfile = $db->prepare("SELECT * FROM FreelancerProfile WHERE userId = ?");
    $stmtProfile->execute([$userId]);
    $profile = $stmtProfile->fetch();

    if ($user['role'] !== 'FREELANCER' || !$profile) {
        throw new Exception("Only freelancers with active profiles can create services.", 403);
    }

    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $category = trim($input['category'] ?? '');
    $price = trim($input['price'] ?? '');
    $delivery = trim($input['delivery'] ?? '');
    $revision = trim($input['revision'] ?? 'No revisions specified');
    $tags = trim($input['tags'] ?? '');

    if (!$title || !$description || !$category || !$price || !$delivery) {
        throw new Exception("Missing required service details (title, description, category, price, delivery).", 400);
    }

    $serviceId = generateCuid();
    $stmtInsert = $db->prepare("
        INSERT INTO Service (id, freelancerProfileId, title, description, category, price, delivery, revision, tags, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    ");
    $stmtInsert->execute([
        $serviceId,
        $profile['id'],
        $title,
        $description,
        $category,
        $price,
        $delivery,
        $revision,
        $tags
    ]);

    // Fetch created service
    $stmt = $db->prepare("SELECT * FROM Service WHERE id = ?");
    $stmt->execute([$serviceId]);
    $newService = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "message" => "Service created successfully!",
        "service" => $newService
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
