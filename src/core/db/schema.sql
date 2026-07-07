-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    retention_days INTEGER DEFAULT 90,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index for users
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Table 2: job_scans
CREATE TABLE IF NOT EXISTS job_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    content TEXT,
    content_hash VARCHAR(64) NOT NULL,
    scan_type VARCHAR(20) NOT NULL,
    trust_score INTEGER,
    risk_level VARCHAR(20),
    pattern_name VARCHAR(100),
    pattern_confidence INTEGER,
    poster_url TEXT,
    poster_text TEXT,
    red_flags JSONB,
    positive_signals JSONB,
    analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_job_scans_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for job_scans
CREATE INDEX IF NOT EXISTS idx_job_scans_user_content_hash ON job_scans(user_id, content_hash);
CREATE INDEX IF NOT EXISTS idx_job_scans_user_id ON job_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_job_scans_created_at_desc ON job_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_scans_user_created_at ON job_scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_scans_risk_level ON job_scans(risk_level);
CREATE INDEX IF NOT EXISTS idx_job_scans_pattern_name ON job_scans(pattern_name);

-- Table 3: scam_reports
CREATE TABLE IF NOT EXISTS scam_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID NOT NULL,
    reported_by UUID NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_scam_reports_scan FOREIGN KEY(scan_id) REFERENCES job_scans(id) ON DELETE CASCADE,
    CONSTRAINT fk_scam_reports_user FOREIGN KEY(reported_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for scam_reports
CREATE INDEX IF NOT EXISTS idx_scam_reports_scan_id ON scam_reports(scan_id);
CREATE INDEX IF NOT EXISTS idx_scam_reports_reported_by ON scam_reports(reported_by);

-- Table 4: chat_messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    scan_id UUID,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_chat_messages_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_messages_scan FOREIGN KEY(scan_id) REFERENCES job_scans(id) ON DELETE CASCADE
);

-- Indexes for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created_at ON chat_messages(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_scan_id ON chat_messages(scan_id);
