<?php
// php-backend/lib/auth.php

// Disable direct access
if (basename($_SERVER['PHP_SELF']) == 'auth.php') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access denied");
}

// Simple environment parser
function getEnvVar($key, $default = null) {
    if (isset($_ENV[$key])) return $_ENV[$key];
    if (isset($_SERVER[$key])) return $_SERVER[$key];
    
    static $env = null;
    if ($env === null) {
        $env = [];
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $name = trim($parts[0]);
                    $value = trim($parts[1]);
                    // strip surrounding quotes
                    if (preg_match('/^"(.*)"$/', $value, $matches)) {
                        $value = $matches[1];
                    } elseif (preg_match("/^'(.*)'$/", $value, $matches)) {
                        $value = $matches[1];
                    }
                    $env[$name] = $value;
                }
            }
        }
    }
    return isset($env[$key]) ? $env[$key] : $default;
}

function base64UrlEncode($data) {
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
}

function base64UrlDecode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}

function createToken($payload, $expirySeconds = 10800) {
    $secret = getEnvVar('JWT_SECRET', 'temporary_skilllanka_secret_key');
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT']);
    
    $payload['iat'] = time();
    $payload['exp'] = time() + $expirySeconds;
    
    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode(json_encode($payload));
    
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64UrlEncode($signature);
    
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verifyToken($token) {
    $secret = getEnvVar('JWT_SECRET', 'temporary_skilllanka_secret_key');
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
    
    $signature = base64UrlDecode($base64UrlSignature);
    $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    
    if (!hash_equals($signature, $expectedSignature)) {
        return false;
    }
    
    $payload = json_decode(base64UrlDecode($base64UrlPayload), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false; // Expired
    }
    
    return $payload;
}

function getTokenFromRequest() {
    // Check Authorization header first
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $authHeader = $headers['Authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
    }
    if (isset($headers['authorization'])) {
        $authHeader = $headers['authorization'];
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
    }
    
    // Check cookie
    if (isset($_COOKIE['skilllanka_token'])) {
        return $_COOKIE['skilllanka_token'];
    }
    
    return null;
}

function getUserSession() {
    $token = getTokenFromRequest();
    if (!$token) {
        throw new Exception("Unauthorized: No session token provided", 401);
    }
    
    $payload = verifyToken($token);
    if (!$payload) {
        throw new Exception("Unauthorized: Invalid or expired session token", 401);
    }
    
    // Real-time role override matching ADMIN_EMAILS changes
    $adminEmailsStr = getEnvVar('ADMIN_EMAILS', '');
    $adminEmails = array_map('trim', explode(',', strtolower($adminEmailsStr)));
    
    if (in_array(strtolower($payload['email']), $adminEmails)) {
        $payload['role'] = 'ADMIN';
    } elseif ($payload['role'] === 'ADMIN') {
        try {
            $db = getDatabaseConnection();
            $stmt = $db->prepare("SELECT role FROM User WHERE id = ?");
            $stmt->execute([$payload['id']]);
            $dbRole = $stmt->fetchColumn();
            if ($dbRole) {
                $payload['role'] = $dbRole;
            } else {
                $payload['role'] = 'CLIENT';
            }
        } catch (Exception $e) {
            $payload['role'] = 'CLIENT';
        }
    }
    
    return $payload;
}

function authorizeAdmin($userEmail, $userRole) {
    if ($userRole !== 'ADMIN') {
        throw new Exception("Forbidden: Admin privileges required", 403);
    }
    
    $adminEmailsStr = getEnvVar('ADMIN_EMAILS', '');
    $adminEmails = array_map('trim', explode(',', strtolower($adminEmailsStr)));
    
    if (!in_array(strtolower($userEmail), $adminEmails)) {
        throw new Exception("Forbidden: Email not authorized in admin configuration", 403);
    }
}

function generateCuid() {
    return 'c' . bin2hex(random_bytes(12));
}

function checkAndUpdateAdminRole($db, $email, $userId) {
    if (!$db) return;
    $adminEmailsStr = getEnvVar('ADMIN_EMAILS', '');
    $adminEmails = array_map('trim', explode(',', strtolower($adminEmailsStr)));
    
    $isSpecifiedAdmin = in_array(strtolower($email), $adminEmails);
    
    if ($isSpecifiedAdmin) {
        $stmt = $db->prepare("UPDATE User SET role = 'ADMIN' WHERE id = ? AND role != 'ADMIN'");
        $stmt->execute([$userId]);
    } else {
        // If they are not in the .env list but their database role is still ADMIN, revert them
        $stmt = $db->prepare("SELECT role FROM User WHERE id = ?");
        $stmt->execute([$userId]);
        $currentRole = $stmt->fetchColumn();
        
        if ($currentRole === 'ADMIN') {
            // Determine default role: FREELANCER if a profile exists, else CLIENT
            $stmtProfile = $db->prepare("SELECT id FROM FreelancerProfile WHERE userId = ?");
            $stmtProfile->execute([$userId]);
            $hasProfile = $stmtProfile->fetch();
            
            $newRole = $hasProfile ? 'FREELANCER' : 'CLIENT';
            
            $stmtUpdate = $db->prepare("UPDATE User SET role = ? WHERE id = ?");
            $stmtUpdate->execute([$newRole, $userId]);
        }
    }
}

