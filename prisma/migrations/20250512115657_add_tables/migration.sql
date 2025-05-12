-- CreateTable
CREATE TABLE `Hotel` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` TEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `locationDescription` LONGTEXT NOT NULL,
    `gym` BOOLEAN NOT NULL DEFAULT false,
    `spa` BOOLEAN NOT NULL DEFAULT false,
    `bar` BOOLEAN NOT NULL DEFAULT false,
    `laundry` BOOLEAN NOT NULL DEFAULT false,
    `restaurant` BOOLEAN NOT NULL DEFAULT false,
    `shopping` BOOLEAN NOT NULL DEFAULT false,
    `freeParking` BOOLEAN NOT NULL DEFAULT false,
    `bikeRental` BOOLEAN NOT NULL DEFAULT false,
    `freeWifi` BOOLEAN NOT NULL DEFAULT false,
    `movieNights` BOOLEAN NOT NULL DEFAULT false,
    `swimmingPool` BOOLEAN NOT NULL DEFAULT false,
    `coffeeShop` BOOLEAN NOT NULL DEFAULT false,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    FULLTEXT INDEX `Hotel_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `bedCount` INTEGER NOT NULL DEFAULT 0,
    `guestCount` INTEGER NOT NULL DEFAULT 0,
    `bathroomCount` INTEGER NOT NULL DEFAULT 0,
    `kingBed` INTEGER NOT NULL DEFAULT 0,
    `queenBed` INTEGER NOT NULL DEFAULT 0,
    `image` VARCHAR(191) NOT NULL,
    `breakFastPrice` INTEGER NOT NULL,
    `roomPrice` INTEGER NOT NULL,
    `roomService` BOOLEAN NOT NULL DEFAULT false,
    `TV` BOOLEAN NOT NULL DEFAULT false,
    `balcony` BOOLEAN NOT NULL DEFAULT false,
    `freeWifi` BOOLEAN NOT NULL DEFAULT false,
    `cityView` BOOLEAN NOT NULL DEFAULT false,
    `oceanView` BOOLEAN NOT NULL DEFAULT false,
    `forestView` BOOLEAN NOT NULL DEFAULT false,
    `mountainView` BOOLEAN NOT NULL DEFAULT false,
    `airCondition` BOOLEAN NOT NULL DEFAULT false,
    `soundProofed` BOOLEAN NOT NULL DEFAULT false,
    `hotelId` VARCHAR(191) NULL,

    INDEX `Room_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `hotelOwnerId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `breakFastIncluded` BOOLEAN NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `paymentStatus` BOOLEAN NOT NULL DEFAULT false,
    `paymentIntentId` VARCHAR(191) NOT NULL,
    `bookedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Booking_paymentIntentId_key`(`paymentIntentId`),
    INDEX `Booking_hotelId_idx`(`hotelId`),
    INDEX `Booking_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
