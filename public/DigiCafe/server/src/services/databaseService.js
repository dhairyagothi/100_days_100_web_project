import { query } from '../config/database.js'

class DatabaseService {
  // ===== ROOMS =====
  
  async createRoom(roomCode, createdBy = null) {
    try {
      const result = await query(
        'INSERT INTO rooms (room_code, created_by) VALUES ($1, $2) RETURNING room_id, room_code, created_at',
        [roomCode, createdBy]
      )
      console.log('✓ Room created in database:', result.rows[0].room_code)
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error creating room:', error.message)
      throw error
    }
  }

  async getRoomByCode(roomCode) {
    try {
      const result = await query(
        'SELECT * FROM rooms WHERE room_code = $1',
        [roomCode]
      )
      return result.rows[0] || null
    } catch (error) {
      console.error('✗ Error getting room:', error.message)
      throw error
    }
  }

  async closeRoom(roomCode) {
    try {
      const result = await query(
        'UPDATE rooms SET closed_at = CURRENT_TIMESTAMP WHERE room_code = $1 RETURNING *',
        [roomCode]
      )
      console.log('✓ Room closed:', roomCode)
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error closing room:', error.message)
      throw error
    }
  }

  // ===== SESSIONS =====

  async createSession(roomCode, peerId, isInitiator = false) {
    try {
      // Get room ID
      const room = await this.getRoomByCode(roomCode)
      if (!room) {
        throw new Error('Room not found')
      }

      const result = await query(
        'INSERT INTO room_sessions (room_id, peer_id, is_initiator) VALUES ($1, $2, $3) RETURNING session_id',
        [room.room_id, peerId, isInitiator]
      )
      console.log('✓ Session created for peer:', peerId)
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error creating session:', error.message)
      throw error
    }
  }

  async endSession(peerId, roomCode) {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return null

      const result = await query(
        'UPDATE room_sessions SET left_at = CURRENT_TIMESTAMP WHERE peer_id = $1 AND room_id = $2 AND left_at IS NULL RETURNING session_id',
        [peerId, room.room_id]
      )
      console.log('✓ Session ended for peer:', peerId)
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error ending session:', error.message)
      throw error
    }
  }

  async getActiveSessions(roomCode) {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return []

      const result = await query(
        'SELECT * FROM room_sessions WHERE room_id = $1 AND left_at IS NULL',
        [room.room_id]
      )
      return result.rows
    } catch (error) {
      console.error('✗ Error getting sessions:', error.message)
      return []
    }
  }

  // ===== LOGS =====

  async logEvent(roomCode, eventType, eventData = null) {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return null

      const result = await query(
        'INSERT INTO room_logs (room_id, event_type, event_data) VALUES ($1, $2, $3) RETURNING log_id',
        [room.room_id, eventType, eventData ? JSON.stringify(eventData) : null]
      )
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error logging event:', error.message)
      throw error
    }
  }

  async getRoomLogs(roomCode) {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return []

      const result = await query(
        'SELECT * FROM room_logs WHERE room_id = $1 ORDER BY created_at DESC LIMIT 100',
        [room.room_id]
      )
      return result.rows
    } catch (error) {
      console.error('✗ Error getting logs:', error.message)
      return []
    }
  }

  // ===== MESSAGES =====

  async saveMessage(roomCode, senderPeerId, messageText, messageType = 'text') {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return null

      const result = await query(
        'INSERT INTO messages (room_id, sender_peer_id, message_text, message_type) VALUES ($1, $2, $3, $4) RETURNING message_id, created_at',
        [room.room_id, senderPeerId, messageText, messageType]
      )
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error saving message:', error.message)
      throw error
    }
  }

  async getMessages(roomCode, limit = 50) {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return []

      const result = await query(
        'SELECT * FROM messages WHERE room_id = $1 ORDER BY created_at DESC LIMIT $2',
        [room.room_id, limit]
      )
      return result.rows.reverse() // Return in chronological order
    } catch (error) {
      console.error('✗ Error getting messages:', error.message)
      return []
    }
  }

  // ===== FILE TRANSFERS =====

  async logFileTransfer(roomCode, senderPeerId, fileName, fileSize, fileType = 'application/octet-stream') {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return null

      const result = await query(
        'INSERT INTO file_transfers (room_id, sender_peer_id, file_name, file_size, file_type) VALUES ($1, $2, $3, $4, $5) RETURNING transfer_id',
        [room.room_id, senderPeerId, fileName, fileSize, fileType]
      )
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error logging file transfer:', error.message)
      throw error
    }
  }

  async completeFileTransfer(transferId) {
    try {
      const result = await query(
        'UPDATE file_transfers SET transfer_status = $1, completed_at = CURRENT_TIMESTAMP WHERE transfer_id = $2 RETURNING *',
        ['completed', transferId]
      )
      return result.rows[0]
    } catch (error) {
      console.error('✗ Error completing file transfer:', error.message)
      throw error
    }
  }

  // ===== STATISTICS =====

  async getRoomStats(roomCode) {
    try {
      const room = await this.getRoomByCode(roomCode)
      if (!room) return null

      const sessionsResult = await query(
        'SELECT COUNT(*) as total_sessions, COUNT(CASE WHEN left_at IS NULL THEN 1 END) as active_sessions FROM room_sessions WHERE room_id = $1',
        [room.room_id]
      )

      const messagesResult = await query(
        'SELECT COUNT(*) as total_messages FROM messages WHERE room_id = $1',
        [room.room_id]
      )

      const filesResult = await query(
        'SELECT COUNT(*) as total_transfers, SUM(file_size) as total_data_transferred FROM file_transfers WHERE room_id = $1 AND transfer_status = $2',
        [room.room_id, 'completed']
      )

      return {
        roomCode,
        totalSessions: parseInt(sessionsResult.rows[0].total_sessions),
        activeSessions: parseInt(sessionsResult.rows[0].active_sessions),
        totalMessages: parseInt(messagesResult.rows[0].total_messages),
        totalFileTransfers: parseInt(filesResult.rows[0].total_transfers),
        totalDataTransferred: filesResult.rows[0].total_data_transferred || 0,
        createdAt: room.created_at,
        closedAt: room.closed_at
      }
    } catch (error) {
      console.error('✗ Error getting room stats:', error.message)
      return null
    }
  }

  // ===== CLEANUP =====

  async cleanupOldRooms(hoursOld = 24) {
    try {
      const result = await query(
        'UPDATE rooms SET closed_at = CURRENT_TIMESTAMP WHERE closed_at IS NULL AND created_at < NOW() - INTERVAL \'1 hour\' * $1 RETURNING room_code',
        [hoursOld]
      )
      console.log(`✓ Cleaned up ${result.rowCount} old rooms`)
      return result.rowCount
    } catch (error) {
      console.error('✗ Error cleaning up rooms:', error.message)
      throw error
    }
  }
}

export default new DatabaseService()
