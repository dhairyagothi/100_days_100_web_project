-- Create database
CREATE DATABASE webrtc_app;

-- Connect to the database
\c webrtc_app;

-- Extension for UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rooms table
CREATE TABLE rooms (
  room_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code VARCHAR(20) UNIQUE NOT NULL,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

-- Create room sessions table
CREATE TABLE room_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  peer_id VARCHAR(100) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  is_initiator BOOLEAN DEFAULT false
);

-- Create room logs table
CREATE TABLE room_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table (for chat history)
CREATE TABLE messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  sender_peer_id VARCHAR(100) NOT NULL,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create file transfers table
CREATE TABLE file_transfers (
  transfer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
  sender_peer_id VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100),
  transfer_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_rooms_room_code ON rooms(room_code);
CREATE INDEX idx_rooms_created_at ON rooms(created_at);
CREATE INDEX idx_sessions_room_id ON room_sessions(room_id);
CREATE INDEX idx_sessions_joined_at ON room_sessions(joined_at);
CREATE INDEX idx_logs_room_id ON room_logs(room_id);
CREATE INDEX idx_logs_created_at ON room_logs(created_at);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_transfers_room_id ON file_transfers(room_id);
CREATE INDEX idx_transfers_status ON file_transfers(transfer_status);
