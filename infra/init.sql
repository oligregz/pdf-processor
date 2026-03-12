CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE process_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    correlation_id VARCHAR(255) UNIQUE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED

    processing_start TIMESTAMPTZ,
    processing_end TIMESTAMPTZ,

    txt_conversion_start TIMESTAMPTZ,
    txt_conversion_end TIMESTAMPTZ,

    email_sent_at TIMESTAMPTZ,
    file_deletion_time TIMESTAMPTZ,

    error_log VARCHAR(255),

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queue_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    process_id UUID REFERENCES process_history(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL, -- WAITING, IN_PROGRESS
    position_in_queue INT,
    entered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_process_correlation 
ON process_history (correlation_id);

CREATE INDEX idx_queue_status 
ON queue_state (status);