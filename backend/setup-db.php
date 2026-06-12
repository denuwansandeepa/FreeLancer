<?php
// php-backend/setup-db.php

header("Content-Type: text/plain; charset=UTF-8");

require_once __DIR__ . '/lib/auth.php';

$host = getEnvVar('DB_HOST', 'localhost');
$username = getEnvVar('DB_USER', 'root');
$password = getEnvVar('DB_PASS', '');
$port = getEnvVar('DB_PORT', '3306');
$dbname = getEnvVar('DB_NAME', 'freelancer_db');

echo "=== SkillLanka MySQL Database Setup ===\n\n";

try {
    // 1. Connect to MySQL Server (without specifying a database)
    echo "Connecting to MySQL server at {$host}:{$port}...\n";
    $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully!\n\n";

    // 2. Create the database if it doesn't exist
    echo "Creating database '{$dbname}' if it doesn't exist...\n";
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "Database '{$dbname}' created/verified!\n\n";

    // 3. Connect to the created database
    $pdo->exec("USE `{$dbname}`;");

    // 4. Create Tables
    echo "Creating tables...\n";

    // Table: User
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `User` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `name` VARCHAR(191) NOT NULL,
          `email` VARCHAR(191) NOT NULL UNIQUE,
          `password` VARCHAR(191) NOT NULL,
          `role` VARCHAR(191) NOT NULL DEFAULT 'CLIENT',
          `phone` VARCHAR(191) NULL,
          `location` VARCHAR(191) NULL,
          `image` VARCHAR(191) NULL,
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'User' created.\n";

    // Table: FreelancerProfile
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `FreelancerProfile` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `userId` VARCHAR(191) NOT NULL UNIQUE,
          `title` VARCHAR(191) NOT NULL,
          `bio` TEXT NOT NULL,
          `category` VARCHAR(191) NOT NULL,
          `location` VARCHAR(191) NOT NULL,
          `skills` TEXT NOT NULL,
          `experience` VARCHAR(191) NULL,
          `startingPrice` VARCHAR(191) NULL,
          `responseTime` VARCHAR(191) NULL,
          `profileImage` VARCHAR(191) NULL,
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'FreelancerProfile' created.\n";

    // Table: Service
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `Service` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `freelancerProfileId` VARCHAR(191) NOT NULL,
          `title` VARCHAR(191) NOT NULL,
          `description` TEXT NOT NULL,
          `category` VARCHAR(191) NOT NULL,
          `price` VARCHAR(191) NOT NULL,
          `delivery` VARCHAR(191) NOT NULL,
          `revision` VARCHAR(191) NULL,
          `tags` VARCHAR(191) NULL,
          `image` VARCHAR(191) NULL,
          `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`freelancerProfileId`) REFERENCES `FreelancerProfile` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'Service' created.\n";

    // Table: JobRequest
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `JobRequest` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `clientId` VARCHAR(191) NOT NULL,
          `title` VARCHAR(191) NOT NULL,
          `description` TEXT NOT NULL,
          `category` VARCHAR(191) NOT NULL,
          `budget` VARCHAR(191) NOT NULL,
          `deadline` VARCHAR(191) NULL,
          `location` VARCHAR(191) NULL,
          `skills` TEXT NULL,
          `status` VARCHAR(191) NOT NULL DEFAULT 'OPEN',
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'JobRequest' created.\n";

    // Table: HireRequest
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `HireRequest` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `clientId` VARCHAR(191) NOT NULL,
          `freelancerId` VARCHAR(191) NOT NULL,
          `serviceId` VARCHAR(191) NULL,
          `jobRequestId` VARCHAR(191) NULL,
          `message` TEXT NOT NULL,
          `budget` VARCHAR(191) NULL,
          `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
          FOREIGN KEY (`freelancerId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
          FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE SET NULL,
          FOREIGN KEY (`jobRequestId`) REFERENCES `JobRequest` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'HireRequest' created.\n";

    // Table: Review
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `Review` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `clientId` VARCHAR(191) NOT NULL,
          `freelancerId` VARCHAR(191) NOT NULL,
          `serviceId` VARCHAR(191) NULL,
          `rating` INT NOT NULL,
          `comment` TEXT NULL,
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
          FOREIGN KEY (`freelancerId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
          FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'Review' created.\n";

    // Table: ChatMessage
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `ChatMessage` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `isRead` BOOLEAN NOT NULL DEFAULT FALSE,
          `hireRequestId` VARCHAR(191) NOT NULL,
          `senderId` VARCHAR(191) NOT NULL,
          `message` TEXT NOT NULL,
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`hireRequestId`) REFERENCES `HireRequest` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'ChatMessage' created.\n";

    // Table: Notification
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `Notification` (
          `id` VARCHAR(191) NOT NULL PRIMARY KEY,
          `userId` VARCHAR(191) NOT NULL,
          `text` VARCHAR(191) NOT NULL,
          `link` VARCHAR(191) NOT NULL,
          `read` BOOLEAN NOT NULL DEFAULT FALSE,
          `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
          FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  - Table 'Notification' created.\n";

    echo "\nAll tables created successfully!\n\n";

    // 5. Seed default admin account
    echo "Checking for default admin account...\n";
    $adminEmail = 'admin@skilllanka.com';
    $stmt = $pdo->prepare("SELECT id FROM User WHERE email = ?");
    $stmt->execute([$adminEmail]);
    $exists = $stmt->fetch();

    if (!$exists) {
        echo "Creating default admin user...\n";
        $adminId = generateCuid();
        $adminPass = password_hash('admin123', PASSWORD_BCRYPT, ['cost' => 10]);
        $stmtInsert = $pdo->prepare("
            INSERT INTO User (id, name, email, password, role, phone, location, createdAt, updatedAt)
            VALUES (?, 'Administrator', ?, ?, 'ADMIN', '0112345678', 'Colombo, Sri Lanka', CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3))
        ");
        $stmtInsert->execute([$adminId, $adminEmail, $adminPass]);
        echo "Default admin user successfully seeded!\n";
        echo "  - Email: admin@skilllanka.com\n";
        echo "  - Password: admin123\n\n";
    } else {
        echo "Admin user 'admin@skilllanka.com' already exists. Skipping seeding.\n\n";
    }

    echo "=== DATABASE SETUP COMPLETE ===\n";

} catch (PDOException $e) {
    echo "\n[ERROR] Setup failed: " . $e->getMessage() . "\n";
}
