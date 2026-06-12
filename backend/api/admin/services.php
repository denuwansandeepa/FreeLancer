<?php
// php-backend/api/admin/services.php

$session = getUserSession();
authorizeAdmin($session['email'], $session['role']);

if ($requestMethod === 'GET') {
    $stmt = $db->query("
        SELECT s.*, u.name as sellerName, u.email as sellerEmail
        FROM Service s
        JOIN FreelancerProfile fp ON s.freelancerProfileId = fp.id
        JOIN User u ON fp.userId = u.id
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
            "tags" => $s['tags'],
            "isActive" => (bool)$s['isActive'],
            "createdAt" => $s['createdAt'],
            "updatedAt" => $s['updatedAt'],
            "freelancerProfile" => [
                "user" => [
                    "name" => $s['sellerName'],
                    "email" => $s['sellerEmail']
                ]
            ]
        ];
    }

    echo json_encode([
        "success" => true,
        "services" => $formatted
    ]);
    exit;
}

elseif ($requestMethod === 'PATCH') {
    $id = $input['id'] ?? '';
    $title = $input['title'] ?? null;
    $description = $input['description'] ?? null;
    $category = $input['category'] ?? null;
    $price = $input['price'] ?? null;
    $delivery = $input['delivery'] ?? null;
    $revision = $input['revision'] ?? null;
    $tags = $input['tags'] ?? null;

    if (!$id) {
        throw new Exception("Service ID is required", 400);
    }

    $updates = [];
    $params = [];

    if ($title !== null) { $updates[] = "title = ?"; $params[] = $title; }
    if ($description !== null) { $updates[] = "description = ?"; $params[] = $description; }
    if ($category !== null) { $updates[] = "category = ?"; $params[] = $category; }
    if ($price !== null) { $updates[] = "price = ?"; $params[] = $price; }
    if ($delivery !== null) { $updates[] = "delivery = ?"; $params[] = $delivery; }
    if ($revision !== null) { $updates[] = "revision = ?"; $params[] = $revision; }
    if ($tags !== null) { $updates[] = "tags = ?"; $params[] = $tags; }

    $updates[] = "updatedAt = NOW()";
    $params[] = $id;

    $sql = "UPDATE Service SET " . implode(", ", $updates) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $stmt = $db->prepare("SELECT * FROM Service WHERE id = ?");
    $stmt->execute([$id]);
    $updated = $stmt->fetch();

    echo json_encode([
        "success" => true,
        "service" => $updated
    ]);
    exit;
}

elseif ($requestMethod === 'DELETE') {
    $serviceId = $_GET['id'] ?? null;

    if (!$serviceId) {
        throw new Exception("Service ID is required", 400);
    }

    $stmt = $db->prepare("DELETE FROM Service WHERE id = ?");
    $stmt->execute([$serviceId]);

    echo json_encode([
        "success" => true,
        "message" => "Service deleted successfully"
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
