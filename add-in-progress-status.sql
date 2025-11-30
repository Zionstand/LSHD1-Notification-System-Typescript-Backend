-- Add 'in_progress' to the screening status enum
-- Run this SQL command in your MySQL database

ALTER TABLE screenings
MODIFY COLUMN status ENUM('completed', 'pending', 'in_progress', 'follow_up') DEFAULT 'pending';
