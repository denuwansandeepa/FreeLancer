<?php
// php-backend/api/auth/register.php

if ($requestMethod !== 'POST') {
    throw new Exception("Method not allowed", 405);
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';
$confirmPassword = $input['confirmPassword'] ?? '';
$role = trim($input['role'] ?? 'CLIENT');
$phone = trim($input['phone'] ?? '');
$location = trim($input['location'] ?? '');
$title = trim($input['title'] ?? '');
$skills = trim($input['skills'] ?? '');
$category = trim($input['category'] ?? '');
$startingPrice = trim($input['startingPrice'] ?? '');

$adminEmailsStr = getEnvVar('ADMIN_EMAILS', '');
$adminEmails = array_map('trim', explode(',', strtolower($adminEmailsStr)));
if (in_array(strtolower($email), $adminEmails)) {
    $role = 'ADMIN';
}

if (!$name || !$email || !$password) {
    throw new Exception("Name, email, and password are required.", 400);
}

if (strlen($password) < 6) {
    throw new Exception("Password must be at least 6 characters.", 400);
}

if ($password !== $confirmPassword) {
    throw new Exception("Passwords do not match.", 400);
}

// Check if user already exists
$stmt = $db->prepare("SELECT id FROM User WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    throw new Exception("Email already registered.", 409);
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
$userId = generateCuid();

$db->beginTransaction();

$stmt = $db->prepare("INSERT INTO User (id, name, email, password, role, phone, location, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
$stmt->execute([
    $userId,
    $name,
    $email,
    $hashedPassword,
    $role,
    $phone ?: null,
    $location ?: null
]);

if ($role === 'FREELANCER') {
    $profileId = generateCuid();
    $stmtProfile = $db->prepare("INSERT INTO FreelancerProfile (id, userId, title, bio, category, location, skills, startingPrice, experience, responseTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'N/A', NOW(), NOW())");
    $stmtProfile->execute([
        $profileId,
        $userId,
        $title ?: "New Freelancer",
        "Hi, I am " . $name . ". I am ready to work.",
        $category ?: "Other",
        $location ?: "Sri Lanka",
        $skills ?: "Not specified",
        $startingPrice ?: "Negotiable",
        "New"
    ]);
}

$db->commit();

// Get details of user to return
$stmt = $db->prepare("SELECT id, name, email, role, phone, location, createdAt FROM User WHERE id = ?");
$stmt->execute([$userId]);
$newUser = $stmt->fetch();

http_response_code(201);
echo json_encode([
    "success" => true,
    "message" => "Account created successfully.",
    "user" => $newUser
]);
exit;
