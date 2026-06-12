<?php
// php-backend/index.php

// Set headers for CORS and JSON content
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/auth.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Normalize the path relative to /api/
if (strpos($path, '/api/') !== false) {
    $path = substr($path, strpos($path, '/api/'));
}
$path = rtrim($path, '/');

// Read JSON input body
$input = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    $db = getDatabaseConnection();

    // Dynamically sync admin role status on any request with an active session
    $token = getTokenFromRequest();
    if ($token) {
        $payload = verifyToken($token);
        if ($payload && isset($payload['email']) && isset($payload['id'])) {
            checkAndUpdateAdminRole($db, $payload['email'], $payload['id']);
        }
    }

    // Map routes to separate files
    if ($path === '/api/auth/register') {
        require __DIR__ . '/api/auth/register.php';
    } 
    
    elseif ($path === '/api/auth/login') {
        require __DIR__ . '/api/auth/login.php';
    } 
    
    elseif ($path === '/api/auth/logout') {
        require __DIR__ . '/api/auth/logout.php';
    } 
    
    elseif ($path === '/api/auth/me') {
        require __DIR__ . '/api/auth/me.php';
    } 
    
    elseif ($path === '/api/dashboard') {
        require __DIR__ . '/api/dashboard.php';
    } 
    
    elseif ($path === '/api/profile') {
        require __DIR__ . '/api/profile.php';
    } 
    
    elseif ($path === '/api/freelancers') {
        require __DIR__ . '/api/freelancers.php';
    } 
    
    elseif ($path === '/api/services') {
        require __DIR__ . '/api/services.php';
    } 
    
    elseif ($path === '/api/job-requests') {
        require __DIR__ . '/api/job-requests.php';
    } 
    
    elseif ($path === '/api/job-requests/apply') {
        require __DIR__ . '/api/job-requests/apply.php';
    } 
    
    elseif ($path === '/api/hire') {
        require __DIR__ . '/api/hire.php';
    } 
    
    elseif (preg_match('#^/api/hire-requests/([^/]+)/messages$#', $path, $matches)) {
        $hireRequestId = $matches[1];
        require __DIR__ . '/api/hire-requests/messages.php';
    } 
    
    elseif (preg_match('#^/api/hire-requests/([^/]+)$#', $path, $matches)) {
        $hireRequestId = $matches[1];
        require __DIR__ . '/api/hire-requests/detail.php';
    } 
    
    elseif ($path === '/api/notifications') {
        require __DIR__ . '/api/notifications.php';
    } 
    
    elseif ($path === '/api/admin/stats') {
        require __DIR__ . '/api/admin/stats.php';
    } 
    
    elseif ($path === '/api/admin/users') {
        require __DIR__ . '/api/admin/users.php';
    } 
    
    elseif ($path === '/api/admin/services') {
        require __DIR__ . '/api/admin/services.php';
    } 
    
    elseif ($path === '/api/admin/jobs') {
        require __DIR__ . '/api/admin/jobs.php';
    } 
    
    elseif ($path === '/api/admin/hires') {
        require __DIR__ . '/api/admin/hires.php';
    } 
    
    elseif ($path === '/api/test-db') {
        require __DIR__ . '/api/test-db.php';
    } 
    
    else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Route not found: " . $requestMethod . " " . $path
        ]);
        exit;
    }

} catch (Exception $e) {
    $code = $e->getCode();
    if ($code < 400 || $code > 599) {
        $code = 500;
    }
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
