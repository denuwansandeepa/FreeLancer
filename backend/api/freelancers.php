<?php
// php-backend/api/freelancers.php

if ($requestMethod !== 'GET') {
    throw new Exception("Method not allowed", 405);
}

$stmt = $db->query("
    SELECT fp.*, u.name, u.email, u.image, u.location as userLocation
    FROM FreelancerProfile fp
    JOIN User u ON fp.userId = u.id
");
$profiles = $stmt->fetchAll();

$formattedFreelancers = [];
foreach ($profiles as $profile) {
    // Ratings
    $stmtReview = $db->prepare("SELECT rating FROM Review WHERE freelancerId = ?");
    $stmtReview->execute([$profile['userId']]);
    $ratings = $stmtReview->fetchAll();

    $avgRating = "5.0";
    if (count($ratings) > 0) {
        $sum = 0;
        foreach ($ratings as $r) {
            $sum += $r['rating'];
        }
        $avgRating = number_format($sum / count($ratings), 1);
    }

    // Completed jobs count
    $stmtCount = $db->prepare("SELECT COUNT(*) as completedCount FROM HireRequest WHERE freelancerId = ? AND status = 'COMPLETED'");
    $stmtCount->execute([$profile['userId']]);
    $completedCount = $stmtCount->fetch()['completedCount'];

    $skillsArray = $profile['skills'] ? array_map('trim', explode(',', $profile['skills'])) : [];

    $formattedFreelancers[] = [
        "id" => $profile['id'],
        "name" => $profile['name'],
        "image" => $profile['image'] ?: $profile['profileImage'],
        "title" => $profile['title'],
        "location" => $profile['location'] ?: ($profile['userLocation'] ?: "Sri Lanka"),
        "category" => $profile['category'],
        "skills" => $skillsArray,
        "price" => $profile['startingPrice'] ?: "Negotiable",
        "rating" => $avgRating,
        "completedJobs" => (int)$completedCount,
        "experience" => $profile['experience'] ?: "Not specified",
        "responseTime" => $profile['responseTime'] ?: "N/A",
        "description" => $profile['bio']
    ];
}

echo json_encode([
    "success" => true,
    "freelancers" => $formattedFreelancers
]);
exit;
