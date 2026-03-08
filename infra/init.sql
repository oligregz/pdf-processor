-- Habilita a extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP
	WITH
		TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP
	WITH
		TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE process_history (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
	user_id UUID REFERENCES users (id) ON DELETE CASCADE,
	correlation_id VARCHAR(255) UNIQUE NOT NULL,
	file_name VARCHAR(255) NOT NULL,
	status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
	processing_start TIMESTAMP
	WITH
		TIME ZONE,
		processing_end TIMESTAMP
	WITH
		TIME ZONE,
		txt_conversion_start TIMESTAMP
	WITH
		TIME ZONE,
		txt_conversion_end TIMESTAMP
	WITH
		TIME ZONE,
		email_sent_at TIMESTAMP
	WITH
		TIME ZONE,
		file_deletion_time TIMESTAMP
	WITH
		TIME ZONE,
		created_at TIMESTAMP
	WITH
		TIME ZONE DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP
	WITH
		TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queue_state (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
	user_id UUID REFERENCES users (id) ON DELETE CASCADE,
	process_id UUID REFERENCES process_history (id) ON DELETE CASCADE,
	status VARCHAR(50) NOT NULL, -- WAITING, IN_PROGRESS
	position_in_queue INT,
	entered_at TIMESTAMP
	WITH
		TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_process_correlation ON process_history (correlation_id);

CREATE INDEX idx_queue_status ON queue_state (status);