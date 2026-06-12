<?php
// php-backend/lib/db.php

// Disable direct access
if (basename($_SERVER['PHP_SELF']) == 'db.php') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access denied");
}

function getDatabaseConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dbUrl = getEnvVar('DATABASE_URL');
            if ($dbUrl && strpos($dbUrl, 'mysql://') === 0) {
                $parsed = parse_url($dbUrl);
                $host = $parsed['host'] ?? 'localhost';
                $port = $parsed['port'] ?? '3306';
                $username = $parsed['user'] ?? 'root';
                $password = $parsed['pass'] ?? '';
                $dbname = ltrim($parsed['path'] ?? '/freelancer_db', '/');
            } else {
                $host = getEnvVar('DB_HOST', 'localhost');
                $dbname = getEnvVar('DB_NAME', 'freelancer_db');
                $username = getEnvVar('DB_USER', 'root');
                $password = getEnvVar('DB_PASS', ''); 
                $port = getEnvVar('DB_PORT', '3306');
            }
            
            $dsn = "mysql:host=$host;dbname=$dbname;port=$port;charset=utf8mb4";
            $pdo = new PDO($dsn, $username, $password);
            
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Database connection failed",
                "error" => $e->getMessage()
            ]);
            exit;
        }
    }
    return $pdo;
}
