<?php
// php-backend/api/dashboard.php

if ($requestMethod !== 'GET') {
    throw new Exception("Method not allowed", 405);
}

$session = getUserSession();
$userId = $session['id'];

$stmt = $db->prepare("SELECT role FROM User WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch();

if (!$user) {
    throw new Exception("User not found", 404);
}

if ($user['role'] === 'FREELANCER') {
    // Profile & Services
    $stmt = $db->prepare("SELECT * FROM FreelancerProfile WHERE userId = ?");
    $stmt->execute([$userId]);
    $profile = $stmt->fetch();

    $services = [];
    if ($profile) {
        $stmt = $db->prepare("SELECT * FROM Service WHERE freelancerProfileId = ?");
        $stmt->execute([$profile['id']]);
        $services = $stmt->fetchAll();
    }

    // Received Hire Requests
    $stmt = $db->prepare("
        SELECT hr.*, u.name as clientName, u.email as clientEmail,
               s.title as serviceTitle, jr.title as jobRequestTitle
        FROM HireRequest hr
        JOIN User u ON hr.clientId = u.id
        LEFT JOIN Service s ON hr.serviceId = s.id
        LEFT JOIN JobRequest jr ON hr.jobRequestId = jr.id
        WHERE hr.freelancerId = ?
        ORDER BY hr.createdAt DESC
    ");
    $stmt->execute([$userId]);
    $hireRequests = $stmt->fetchAll();

    $directHiresCount = 0;
    $jobApplicationsCount = 0;
    $formattedHires = [];

    foreach ($hireRequests as $r) {
        if (!$r['jobRequestId']) {
            $directHiresCount++;
        } else {
            $jobApplicationsCount++;
        }

        $serviceName = "Custom Hire Request";
        if ($r['jobRequestTitle']) {
            $serviceName = $r['jobRequestTitle'];
        } elseif ($r['serviceTitle']) {
            $serviceName = $r['serviceTitle'];
        }

        $formattedHires[] = [
            "id" => $r['id'],
            "client" => $r['clientName'],
            "service" => $serviceName,
            "budget" => $r['budget'] ?: "Negotiable",
            "status" => $r['status'],
            "jobRequestId" => $r['jobRequestId']
        ];
    }

    $formattedServices = [];
    foreach ($services as $s) {
        $formattedServices[] = [
            "title" => $s['title'],
            "price" => $s['price'],
            "orders" => 0,
            "status" => $s['isActive'] ? "Active" : "Draft"
        ];
    }

    echo json_encode([
        "success" => true,
        "hasProfile" => (bool)$profile,
        "stats" => [
            ["title" => "Profile Views", "value" => "248", "change" => "+0 this week", "icon" => "👀"],
            ["title" => "Hire Requests", "value" => (string)$directHiresCount, "change" => "Direct hires", "icon" => "📩"],
            ["title" => "Job Applications", "value" => (string)$jobApplicationsCount, "change" => "Applied jobs", "icon" => "📋"],
            ["title" => "Active Services", "value" => (string)count($formattedServices), "change" => "Featured", "icon" => "💼"]
        ],
        "hireRequests" => $formattedHires,
        "services" => $formattedServices
    ]);
    exit;
} else {
    // Client dashboard
    $stmt = $db->prepare("
        SELECT jr.*, 
               (SELECT COUNT(*) FROM HireRequest WHERE jobRequestId = jr.id) as proposalsCount
        FROM JobRequest jr
        WHERE jr.clientId = ?
        ORDER BY jr.createdAt DESC
    ");
    $stmt->execute([$userId]);
    $jobRequests = $stmt->fetchAll();

    $stmt = $db->prepare("
        SELECT hr.*, u.name as freelancerName,
               s.title as serviceTitle, jr.title as jobRequestTitle
        FROM HireRequest hr
        JOIN User u ON hr.freelancerId = u.id
        LEFT JOIN Service s ON hr.serviceId = s.id
        LEFT JOIN JobRequest jr ON hr.jobRequestId = jr.id
        WHERE hr.clientId = ?
        ORDER BY hr.createdAt DESC
    ");
    $stmt->execute([$userId]);
    $sentHireRequests = $stmt->fetchAll();

    $activeHiresCount = 0;
    $formattedSent = [];

    foreach ($sentHireRequests as $r) {
        if ($r['status'] === 'ACCEPTED' || $r['status'] === 'PENDING') {
            $activeHiresCount++;
        }

        $serviceName = "Direct Hire Request";
        if ($r['jobRequestTitle']) {
            $serviceName = "Application: " . $r['jobRequestTitle'];
        } elseif ($r['serviceTitle']) {
            $serviceName = $r['serviceTitle'];
        }

        $formattedSent[] = [
            "id" => $r['id'],
            "freelancer" => $r['freelancerName'],
            "service" => $serviceName,
            "budget" => $r['budget'] ?: "Negotiable",
            "status" => $r['status']
        ];
    }

    $formattedPosted = [];
    foreach ($jobRequests as $j) {
        $formattedPosted[] = [
            "title" => $j['title'],
            "budget" => $j['budget'],
            "proposals" => (int)$j['proposalsCount'],
            "status" => $j['status']
        ];
    }

    echo json_encode([
        "success" => true,
        "stats" => [
            ["title" => "Jobs Posted", "value" => (string)count($jobRequests), "change" => "Active requests", "icon" => "📋"],
            ["title" => "Direct Hires Sent", "value" => (string)count($sentHireRequests), "change" => "Sent requests", "icon" => "✉️"],
            ["title" => "Spent Amount", "value" => "Rs. 0", "change" => "This month", "icon" => "💳"],
            ["title" => "Active Hires", "value" => (string)$activeHiresCount, "change" => "Ongoing", "icon" => "🤝"]
        ],
        "postedJobs" => $formattedPosted,
        "sentHireRequests" => $formattedSent
    ]);
    exit;
}
