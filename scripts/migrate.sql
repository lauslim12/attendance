-- Drop previously existing database.
DROP DATABASE IF EXISTS attendance;
CREATE DATABASE IF NOT EXISTS attendance;
USE attendance;

-- Create 'Users' table.
CREATE TABLE users (
  user_pk SERIAL,
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  totp_secret VARCHAR(255) NOT NULL,
  full_name TEXT NOT NULL,
  modified_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (user_pk)
) ENGINE=InnoDB CHARACTER SET utf8;

-- Create 'Attendance' table.
CREATE TABLE attendance (
  attendance_pk SERIAL,
  attendance_id VARCHAR(255) NOT NULL,
  time_enter DATETIME NOT NULL,
  ip_address_enter VARCHAR(255) NOT NULL,
  device_enter VARCHAR(255) NOT NULL,
  remarks_enter TEXT,
  time_leave DATETIME,
  ip_address_leave VARCHAR(255),
  device_leave VARCHAR(255),
  remarks_leave TEXT,
  user_pk BIGINT UNSIGNED,
  PRIMARY KEY (attendance_pk),
  FOREIGN KEY (user_pk) REFERENCES users (user_pk)
) ENGINE=InnoDB CHARACTER SET utf8;