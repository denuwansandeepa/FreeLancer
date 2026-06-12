<?php
// php-backend/api/admin/stats.php

if ($requestMethod !== 'GET') {
    throw new Exception("Method not allowed", 405);
}

$session = getUserSession();
authorizeAdmin($session['email'], $session['role']);

// Fetch stats counts
$totalUsers = (int)$db->query("SELECT COUNT(*) FROM User")->fetchColumn();
$totalClients = (int)$db->query("SELECT COUNT(*) FROM User WHERE role = 'CLIENT'")->fetchColumn();
$totalFreelancers = (int)$db->query("SELECT COUNT(*) FROM User WHERE role = 'FREELANCER'")->fetchColumn();
$totalJobs = (int)$db->query("SELECT COUNT(*) FROM JobRequest")->fetchColumn();
$totalServices = (int)$db->query("SELECT COUNT(*) FROM Service")->fetchColumn();
$totalHires = (int)$db->query("SELECT COUNT(*) FROM HireRequest")->fetchColumn();
$openJobs = (int)$db->query("SELECT COUNT(*) FROM JobRequest WHERE status = 'OPEN'")->fetchColumn();
$completedHires = (int)$db->query("SELECT COUNT(*) FROM HireRequest WHERE status = 'COMPLETED'")->fetchColumn();

echo json_encode([
    "success" => true,
    "stats" => [
        "totalUsers" => $totalUsers,
        "totalClients" => $totalClients,
        "totalFreelancers" => $totalFreelancers,
        "totalJobs" => $totalJobs,
        "totalServices" => $totalServices,
        "totalHires" => $totalHires,
        "openJobs" => $openJobs,
        "completedHires" => $completedHires
    ]
]);
exit;
