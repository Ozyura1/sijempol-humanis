-- Add revision request fields to perkawinan_requests table
-- JEBOL Mobile Government System

ALTER TABLE perkawinan_requests ADD COLUMN IF NOT EXISTS request_revision_notes LONGTEXT NULL COMMENT 'Admin notes requesting revision/completion' AFTER catatan_admin;

ALTER TABLE perkawinan_requests ADD COLUMN IF NOT EXISTS revision_requested_at TIMESTAMP NULL COMMENT 'When admin requested revision' AFTER request_revision_notes;

ALTER TABLE perkawinan_requests ADD COLUMN IF NOT EXISTS revision_requested_by_user_id BIGINT UNSIGNED NULL COMMENT 'Admin who requested revision' AFTER revision_requested_at;

-- Add foreign key constraint
ALTER TABLE perkawinan_requests
ADD CONSTRAINT pr_revision_requested_by_fk 
FOREIGN KEY (revision_requested_by_user_id) 
REFERENCES users(id) ON DELETE SET NULL;
