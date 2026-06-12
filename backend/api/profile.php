<?php
// php-backend/api/profile.php

$session = getUserSession();
$userId = $session['id'];

if ($requestMethod === 'GET') {
    $stmt = $db->prepare("SELECT id, name, email, role, phone, location, image FROM User WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception("User not found", 404);
    }

    $profile = null;
    if ($user['role'] === 'FREELANCER') {
        $stmt = $db->prepare("SELECT * FROM FreelancerProfile WHERE userId = ?");
        $stmt->execute([$userId]);
        $profile = $stmt->fetch();
    }

    $user['freelancerProfile'] = $profile;

    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
    exit;
}

elseif ($requestMethod === 'POST') {
    $name = trim($input['name'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $location = trim($input['location'] ?? '');
    $image = trim($input['image'] ?? '');
    
    // Freelancer fields
    $title = $input['title'] ?? null;
    $bio = $input['bio'] ?? null;
    $category = $input['category'] ?? null;
    $skills = $input['skills'] ?? null;
    $startingPrice = $input['startingPrice'] ?? null;
    $experience = $input['experience'] ?? null;
    $responseTime = $input['responseTime'] ?? null;

    if (!$name) {
        throw new Exception("Name is required.", 400);
    }

    $db->beginTransaction();

    $stmt = $db->prepare("UPDATE User SET name = ?, phone = ?, location = ?, image = ?, updatedAt = NOW() WHERE id = ?");
    $stmt->execute([$name, $phone ?: null, $location ?: null, $image ?: null, $userId]);

    // Fetch updated user to check role
    $stmt = $db->prepare("SELECT * FROM User WHERE id = ?");
    $stmt->execute([$userId]);
    $updatedUser = $stmt->fetch();

    $updatedProfile = null;
    if ($updatedUser['role'] === 'FREELANCER') {
        // Upsert
        $stmtCheck = $db->prepare("SELECT id FROM FreelancerProfile WHERE userId = ?");
        $stmtCheck->execute([$userId]);
        $profileExists = $stmtCheck->fetch();

        if ($profileExists) {
            // Update
            $updateFields = [];
            $params = [];
            
            $updateFields[] = "location = ?";
            $params[] = $location ?: "Sri Lanka";
            
            $updateFields[] = "profileImage = ?";
            $params[] = $image ?: null;
            
            if ($title !== null) { $updateFields[] = "title = ?"; $params[] = $title; }
            if ($bio !== null) { $updateFields[] = "bio = ?"; $params[] = $bio; }
            if ($category !== null) { $updateFields[] = "category = ?"; $params[] = $category; }
            if ($skills !== null) { $updateFields[] = "skills = ?"; $params[] = $skills; }
            if ($experience !== null) { $updateFields[] = "experience = ?"; $params[] = $experience; }
            if ($startingPrice !== null) { $updateFields[] = "startingPrice = ?"; $params[] = $startingPrice; }
            if ($responseTime !== null) { $updateFields[] = "responseTime = ?"; $params[] = $responseTime; }
            
            $updateFields[] = "updatedAt = NOW()";
            
            $params[] = $userId;
            
            $sql = "UPDATE FreelancerProfile SET " . implode(", ", $updateFields) . " WHERE userId = ?";
            $stmtUpdate = $db->prepare($sql);
            $stmtUpdate->execute($params);
        } else {
            // Insert
            $profileId = generateCuid();
            $stmtInsert = $db->prepare("
                INSERT INTO FreelancerProfile (id, userId, title, bio, category, location, skills, startingPrice, experience, responseTime, profileImage, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");
            $stmtInsert->execute([
                $profileId,
                $userId,
                $title ?: "New Freelancer",
                $bio ?: "Hi, I am " . $name . ". I am ready to work.",
                $category ?: "Other",
                $location ?: "Sri Lanka",
                $skills ?: "Not specified",
                $startingPrice ?: "Negotiable",
                $experience ?: "New",
                $responseTime ?: "N/A",
                $image ?: null
            ]);
        }

        // Fetch profile
        $stmt = $db->prepare("SELECT * FROM FreelancerProfile WHERE userId = ?");
        $stmt->execute([$userId]);
        $updatedProfile = $stmt->fetch();
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => "Profile updated successfully!",
        "user" => [
            "id" => $updatedUser['id'],
            "name" => $updatedUser['name'],
            "email" => $updatedUser['email'],
            "role" => $updatedUser['role'],
            "phone" => $updatedUser['phone'],
            "location" => $updatedUser['location'],
            "image" => $updatedUser['image'],
            "freelancerProfile" => $updatedProfile
        ]
    ]);
    exit;
} else {
    throw new Exception("Method not allowed", 405);
}
