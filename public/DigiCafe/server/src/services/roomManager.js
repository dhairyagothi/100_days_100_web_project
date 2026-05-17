// Room Manager - Handles room creation, joining, and client tracking for multi-user WebRTC
class RoomManager {
  constructor() {
    // Two separate stores: active rooms (with users) and preserved rooms (without users)
    this.activeRooms = new Map() // roomId -> { users: Map<wsClient, {name, clientId}>, createdAt, userCount }
    this.preservedRooms = new Map() // roomId -> { createdAt, initialCreatorName } - rooms without active users
    this.userRooms = new Map() // wsClient -> roomId
    this.clientIds = new Map() // wsClient -> clientId (unique identifier for each connection)
    
    console.log('🚀 RoomManager initialized with in-memory persistence')
  }

  // Generate unique room ID
  generateRoomId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  // Generate unique client ID
  generateClientId() {
    return 'user_' + Math.random().toString(36).substr(2, 9)
  }

  // Create a new room
  createRoom(creatorName = 'Creator') {
    const roomId = this.generateRoomId()
    
    // Create room in active store
    this.activeRooms.set(roomId, {
      users: new Map(), // wsClient -> {name, clientId, joinedAt}
      createdAt: Date.now(),
      userCount: 0,
      creatorName: creatorName
    })
    
    // Also add to preserved rooms so it survives if all users leave
    this.preservedRooms.set(roomId, {
      createdAt: Date.now(),
      initialCreatorName: creatorName
    })
    
    console.log(`🏠 Room created: ${roomId} by ${creatorName} (Active: ${this.activeRooms.size}, Preserved: ${this.preservedRooms.size})`)
    return roomId
  }

  // Join a room
  joinRoom(roomId, ws, userName) {
    // List available rooms for debugging
    const activeList = Array.from(this.activeRooms.keys()).join(', ') || 'NONE'
    const preservedList = Array.from(this.preservedRooms.keys()).join(', ') || 'NONE'
    console.log(`📋 Looking for room: ${roomId}`)
    console.log(`📋 Active rooms: ${activeList} | Preserved rooms: ${preservedList}`)
    
    // Check active rooms first
    let room = this.activeRooms.get(roomId)
    if (!room) {
      // Check if it's a preserved room - reactivate it
      if (this.preservedRooms.has(roomId)) {
        console.log(`🔄 Reactivating preserved room: ${roomId}`)
        room = {
          users: new Map(),
          createdAt: this.preservedRooms.get(roomId).createdAt,
          userCount: 0,
          reactivated: true
        }
        this.activeRooms.set(roomId, room)
      } else {
        console.error(`❌ Room not found: ${roomId}. Available Active: ${activeList}, Preserved: ${preservedList}`)
        return { success: false, error: 'Room not found' }
      }
    }

    // Check if room is full (max 6 users)
    if (room.users.size >= 6) {
      console.warn(`❌ Room full: ${roomId} (${room.users.size}/6)`)
      return { success: false, error: 'Room is full' }
    }

    const clientId = this.generateClientId()
    room.users.set(ws, {
      name: userName || `User${room.users.size + 1}`,
      clientId,
      joinedAt: Date.now()
    })
    room.userCount = room.users.size
    
    this.userRooms.set(ws, roomId)
    this.clientIds.set(ws, clientId)
    
    console.log(`👥 Client "${userName}" joined room ${roomId} (${room.users.size}/6 users, Active: ${this.activeRooms.size})`)
    
    return { success: true, clientId, userCount: room.users.size, users: this.getRoomUsers(roomId) }
  }

  // Leave a room
  leaveRoom(ws) {
    const roomId = this.userRooms.get(ws)
    if (!roomId) return null

    const room = this.activeRooms.get(roomId)
    if (room) {
      const userName = room.users.get(ws)?.name
      room.users.delete(ws)
      room.userCount = room.users.size
      console.log(`👤 Client "${userName}" left room ${roomId} (${room.users.size}/6 remaining, Active: ${this.activeRooms.size})`)

      // Keep room in preserved store even if empty, so others can rejoin within TTL
      if (room.users.size === 0) {
        console.log(`✅ Room ${roomId} kept in preserved store (will auto-cleanup after 24h)`)
        // Don't delete from activeRooms yet - it will be cleaned up by maintenance
      }
    }

    this.userRooms.delete(ws)
    this.clientIds.delete(ws)
    return roomId
  }

  // Get room info
  getRoom(roomId) {
    return this.activeRooms.get(roomId)
  }

  // Get all users in a room with their details
  getRoomUsers(roomId) {
    const room = this.activeRooms.get(roomId)
    if (!room) return []
    
    return Array.from(room.users.entries()).map(([ws, userData]) => ({
      clientId: userData.clientId,
      name: userData.name,
      joinedAt: userData.joinedAt
    }))
  }

  // Get clients (WebSocket connections) in a room
  getClients(roomId) {
    const room = this.activeRooms.get(roomId)
    return room ? Array.from(room.users.keys()) : []
  }

  // Get room ID for a client
  getRoomId(ws) {
    return this.userRooms.get(ws)
  }

  // Get client ID for a WebSocket connection
  getClientId(ws) {
    return this.clientIds.get(ws)
  }

  // Get user info for a client
  getUserInfo(ws) {
    const roomId = this.userRooms.get(ws)
    if (!roomId) return null
    
    const room = this.activeRooms.get(roomId)
    return room?.users.get(ws) || null
  }

  // Broadcast to all clients in a room except sender
  broadcast(roomId, message, excludeWs = null) {
    const room = this.activeRooms.get(roomId)
    if (!room) return

    const msgString = JSON.stringify(message)
    room.users.forEach((userData, client) => {
      if (excludeWs && client === excludeWs) return
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(msgString)
      }
    })
  }

  // Send to specific client in room
  send(roomId, message, targetWs) {
    const room = this.activeRooms.get(roomId)
    if (!room || !room.users.has(targetWs)) return

    if (targetWs.readyState === 1) {
      targetWs.send(JSON.stringify(message))
    }
  }

  // Send to all except sender (for when sender is included)
  broadcastToAll(roomId, message) {
    const room = this.activeRooms.get(roomId)
    if (!room) return

    const msgString = JSON.stringify(message)
    room.users.forEach((userData, client) => {
      if (client.readyState === 1) {
        client.send(msgString)
      }
    })
  }

  // Get room stats
  getStats() {
    return {
      activeRooms: this.activeRooms.size,
      preservedRooms: this.preservedRooms.size,
      totalClients: this.userRooms.size,
      rooms: Array.from(this.activeRooms.entries()).map(([id, room]) => ({
        id,
        users: room.users.size,
        maxUsers: 6,
        createdAt: new Date(room.createdAt).toISOString(),
        userDetails: Array.from(room.users.values()).map(u => ({ name: u.name, clientId: u.clientId }))
      }))
    }
  }

  // Check if room is full
  isRoomFull(roomId) {
    const room = this.activeRooms.get(roomId)
    return room && room.users.size >= 6
  }

  // Get room capacity info
  getRoomCapacity(roomId) {
    const room = this.activeRooms.get(roomId)
    if (!room) return null
    return {
      current: room.users.size,
      max: 6,
      available: 6 - room.users.size,
      isFull: room.users.size >= 6
    }
  }

  // Clean up old preserved rooms (older than 24 hours)
  cleanupOldRooms(maxAgeMs = 86400000) {
    const now = Date.now()
    let removedActive = 0
    let removedPreserved = 0

    // Clean up empty active rooms older than maxAge
    for (const [roomId, room] of this.activeRooms.entries()) {
      if (room.users.size === 0 && now - room.createdAt > maxAgeMs) {
        this.activeRooms.delete(roomId)
        removedActive++
      }
    }

    // Clean up preserved rooms older than maxAge
    for (const [roomId, room] of this.preservedRooms.entries()) {
      if (now - room.createdAt > maxAgeMs) {
        this.preservedRooms.delete(roomId)
        removedPreserved++
      }
    }

    if (removedActive > 0 || removedPreserved > 0) {
      console.log(`🧹 Cleaned up ${removedActive} old active rooms and ${removedPreserved} old preserved rooms`)
    }

    return removedActive + removedPreserved
  }

  // Periodic cleanup - call this from server setup
  startCleanupInterval(intervalMs = 3600000) {
    setInterval(() => {
      this.cleanupOldRooms()
    }, intervalMs)
    console.log(`🔄 Room cleanup scheduled every ${intervalMs / 1000} seconds`)
  }
}

export default new RoomManager()
