-- CreateTable
CREATE TABLE `User` (
    `userPK` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `totpSecret` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_userID_key`(`userID`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`userPK`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `attendancePK` INTEGER NOT NULL AUTO_INCREMENT,
    `attendanceID` VARCHAR(191) NOT NULL,
    `timeEnter` DATETIME(3) NOT NULL,
    `ipAddressEnter` VARCHAR(191) NOT NULL,
    `deviceEnter` VARCHAR(191) NOT NULL,
    `remarksEnter` VARCHAR(191) NOT NULL,
    `timeLeave` DATETIME(3) NULL,
    `ipAddressLeave` VARCHAR(191) NULL,
    `deviceLeave` VARCHAR(191) NULL,
    `remarksLeave` VARCHAR(191) NULL,
    `userPK` INTEGER NOT NULL,

    UNIQUE INDEX `Attendance_attendanceID_key`(`attendanceID`),
    PRIMARY KEY (`attendancePK`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_userPK_fkey` FOREIGN KEY (`userPK`) REFERENCES `User`(`userPK`) ON DELETE RESTRICT ON UPDATE CASCADE;
