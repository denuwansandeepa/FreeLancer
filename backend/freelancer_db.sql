-- SkillLanka MySQL Database Dump
-- Compatible with XAMPP / phpMyAdmin

CREATE DATABASE IF NOT EXISTS `freelancer_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `freelancer_db`;

-- --------------------------------------------------------
-- Table structure for table `User`
-- --------------------------------------------------------
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

-- --------------------------------------------------------
-- Table structure for table `FreelancerProfile`
-- --------------------------------------------------------
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
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `Service`
-- --------------------------------------------------------
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
  CONSTRAINT `fk_service_profile` FOREIGN KEY (`freelancerProfileId`) REFERENCES `FreelancerProfile` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `JobRequest`
-- --------------------------------------------------------
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
  CONSTRAINT `fk_job_client` FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `HireRequest`
-- --------------------------------------------------------
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
  CONSTRAINT `fk_hire_client` FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hire_freelancer` FOREIGN KEY (`freelancerId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hire_service` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_hire_job` FOREIGN KEY (`jobRequestId`) REFERENCES `JobRequest` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `Review`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Review` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `clientId` VARCHAR(191) NOT NULL,
  `freelancerId` VARCHAR(191) NOT NULL,
  `serviceId` VARCHAR(191) NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_review_client` FOREIGN KEY (`clientId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_freelancer` FOREIGN KEY (`freelancerId`) REFERENCES `User` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_review_service` FOREIGN KEY (`serviceId`) REFERENCES `Service` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `ChatMessage`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ChatMessage` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `isRead` BOOLEAN NOT NULL DEFAULT FALSE,
  `hireRequestId` VARCHAR(191) NOT NULL,
  `senderId` VARCHAR(191) NOT NULL,
  `message` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_chat_hire` FOREIGN KEY (`hireRequestId`) REFERENCES `HireRequest` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `Notification`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notification` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `text` VARCHAR(191) NOT NULL,
  `link` VARCHAR(191) NOT NULL,
  `read` BOOLEAN NOT NULL DEFAULT FALSE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------