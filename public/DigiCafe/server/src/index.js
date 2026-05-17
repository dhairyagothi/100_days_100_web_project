import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { config } from './config/index.js'
import { query as dbQuery } from './config/database.js'
import apiRoutes from './routes/index.js'
import roomManager from './services/roomManager.js'
import databaseService from './services/databaseService.js'
import jwtService from './services/jwtService.js'
import { createSecureServer } from './config/ssl.js'

const app = express()
const server = createSecureServer(app)
const wss = new WebSocketServer({ server })

// CORS Configuration - Allow multiple origins for development & production
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.RENDER_EXTERNAL_URL || null
].filter(Boolean) // Remove null values

// Security and WebRTC compatibility headers
app.use((req, res, next) => {
  // CORS headers
  const origin = req.headers.origin
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*')
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Security headers - compatible with Safari/Brave and WebRTC
  res.header('X-Content-Type-Options', 'nosniff')
  res.header('X-Frame-Options', 'SAMEORIGIN')
  res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // Allow shared array buffers for WebRTC performance
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  res.header('Cross-Origin-Embedder-Policy', 'require-corp')
  
  // WebRTC specific headers
  res.header('X-Content-Type-Options', 'nosniff; mode=block')
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked for origin: ${origin}`)
      callback(null, true) // Allow anyway for development, remove in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Routes
app.use('/api', apiRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Debug endpoint - list active rooms
app.get('/api/debug/rooms', (req, res) => {
  const rooms = Array.from(roomManager.activeRooms.entries()).map(([roomId, room]) => ({
    roomId,
    userCount: room.userCount,
    users: Array.from(room.users.values()).map(u => ({ 
      name: u.name, 
      clientId: u.clientId,
      joinedAt: new Date(u.joinedAt).toISOString()
    })),
    createdAt: new Date(room.createdAt).toISOString(),
    ageSeconds: Math.round((Date.now() - room.createdAt) / 1000)
  }))
  res.json({ 
    activeRooms: rooms.length,
    preservedRooms: roomManager.preservedRooms.size,
    rooms,
    timestamp: new Date().toISOString()
  })
})

// Room stats endpoint
app.get('/api/rooms/:roomCode/stats', async (req, res) => {
  try {
    const stats = await databaseService.getRoomStats(req.params.roomCode)
    if (!stats) {
      return res.status(404).json({ error: 'Room not found' })
    }
    res.json(stats)
  } catch (error) {
    console.error('Error fetching room stats:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Get room messages endpoint
app.get('/api/rooms/:roomCode/messages', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const messages = await databaseService.getMessages(req.params.roomCode, limit)
    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('✓ WebSocket client connected')
  let clientRoomId = null
  let clientPeerId = null
  let clientToken = null

  // Send welcome message
  ws.send(JSON.stringify({ 
    type: 'connected', 
    payload: { message: 'Connected to signaling server' } 
  }))

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data)
      console.log(`📨 Received: ${message.type}`)

      switch (message.type) {
        case 'create':
          // Create new room and join it
          const newRoomId = roomManager.createRoom()
          const userName = message.payload?.userName || 'Creator'
          const createdJoin = roomManager.joinRoom(newRoomId, ws, userName)
          
          console.log(`📝 Room creation details: ID='${newRoomId}', User='${userName}', Success=${createdJoin.success}`)
          
          if (createdJoin && createdJoin.success) {
            clientRoomId = newRoomId
            clientPeerId = createdJoin.clientId
            clientToken = jwtService.generateToken(newRoomId, clientPeerId)
            
            // Log to database
            databaseService.createRoom(newRoomId, clientPeerId).catch(err => console.error('DB error:', err))
            databaseService.createSession(newRoomId, clientPeerId, true).catch(err => console.error('DB error:', err))
            databaseService.logEvent(newRoomId, 'room_created', { creator: clientPeerId, creatorName: userName }).catch(err => console.error('DB error:', err))
            
            ws.send(JSON.stringify({
              type: 'room_created',
              payload: { 
                roomId: newRoomId,
                clientId: clientPeerId,
                token: clientToken,
                userName: userName,
                message: 'Room created successfully',
                userCount: 1,
                users: createdJoin.users
              }
            }))
          } else {
            const errorMsg = createdJoin?.error || 'Failed to create room'
            console.error(`❌ Room creation failed: ${errorMsg}`)
            ws.send(JSON.stringify({
              type: 'error',
              payload: { 
                message: `Failed to create room: ${errorMsg}`,
                error: 'ROOM_CREATE_FAILED'
              }
            }))
          }
          break

        case 'join':
          const roomId = message.payload.roomId
          const joinerName = message.payload?.userName || 'Guest'
          const joined = roomManager.joinRoom(roomId, ws, joinerName)
          
          if (joined && joined.success) {
            clientRoomId = roomId
            clientPeerId = joined.clientId
            clientToken = jwtService.generateToken(roomId, clientPeerId)
            
            const room = roomManager.getRoom(roomId)
            const userCount = room.userCount
            
            // Log to database
            databaseService.createSession(roomId, clientPeerId, false).catch(err => console.error('DB error:', err))
            databaseService.logEvent(roomId, 'peer_joined', { peerId: clientPeerId, peerName: joinerName }).catch(err => console.error('DB error:', err))
            
            // Notify joiner with full user list
            ws.send(JSON.stringify({
              type: 'join_confirmed',
              payload: { 
                roomId: roomId,
                clientId: clientPeerId,
                token: clientToken,
                userName: joinerName,
                message: 'Successfully joined room',
                userCount: userCount,
                users: joined.users
              }
            }))

            // Notify other users in room about the new user
            if (userCount > 1) {
              const otherClients = roomManager.getClients(roomId).filter(c => c !== ws)
              console.log(`📢 BROADCAST: ${joinerName} joined room ${roomId}, notifying ${otherClients.length} existing users`)
              otherClients.forEach(other => {
                other.send(JSON.stringify({
                  type: 'user_joined',
                  payload: { 
                    roomId: roomId,
                    newUser: {
                      clientId: clientPeerId,
                      name: joinerName
                    },
                    userCount: userCount,
                    users: joined.users
                  }
                }))
              })
            }
          } else {
            const errorMsg = joined?.error || 'Failed to join room'
            console.error(`❌ Join failed for ${roomId}: ${errorMsg}`)
            const activeRooms = Array.from(roomManager.activeRooms.keys()).join(', ') || 'NONE'
            const preservedRooms = Array.from(roomManager.preservedRooms.keys()).join(', ') || 'NONE'
            ws.send(JSON.stringify({
              type: 'error',
              payload: { 
                message: `Failed to join room: ${errorMsg}`,
                roomId: roomId,
                available_rooms: activeRooms,
                preserved_rooms: preservedRooms
              }
            }))
          }
          break

        case 'chat_message':
          if (clientRoomId) {
            const senderInfo = roomManager.getUserInfo(ws)
            const messageData = {
              text: message.payload.text,
              senderId: clientPeerId,
              senderName: senderInfo?.name || 'Unknown',
              timestamp: Date.now()
            }
            
            // Log message to database
            databaseService.saveMessage(clientRoomId, clientPeerId, message.payload.text, 'text').catch(err => console.error('DB error:', err))
            
            // Broadcast to all users (including sender)
            roomManager.broadcastToAll(clientRoomId, {
              type: 'chat_message',
              payload: messageData
            })
          }
          break

        // WebRTC Signaling Messages - Support multi-user
        case 'offer':
          if (clientRoomId) {
            const targetId = message.payload?.targetId
            console.log(`📤 Offer relayed in room ${clientRoomId} to ${targetId}`)
            const otherClients = roomManager.getClients(clientRoomId).filter(c => c !== ws)
            
            if (targetId) {
              // Send to specific peer
              otherClients.forEach(other => {
                const otherInfo = roomManager.getUserInfo(other)
                if (otherInfo?.clientId === targetId) {
                  other.send(JSON.stringify({
                    type: 'offer',
                    payload: {
                      ...message.payload,
                      fromId: clientPeerId,
                      fromName: roomManager.getUserInfo(ws)?.name
                    }
                  }))
                }
              })
            } else {
              // Broadcast to all (for compatibility)
              otherClients.forEach(other => {
                other.send(JSON.stringify({
                  type: 'offer',
                  payload: {
                    ...message.payload,
                    fromId: clientPeerId,
                    fromName: roomManager.getUserInfo(ws)?.name
                  }
                }))
              })
            }
          }
          break

        case 'answer':
          if (clientRoomId) {
            const targetId = message.payload?.targetId
            console.log(`📥 Answer relayed in room ${clientRoomId} to ${targetId}`)
            const otherClients = roomManager.getClients(clientRoomId).filter(c => c !== ws)
            
            if (targetId) {
              // Send to specific peer
              otherClients.forEach(other => {
                const otherInfo = roomManager.getUserInfo(other)
                if (otherInfo?.clientId === targetId) {
                  other.send(JSON.stringify({
                    type: 'answer',
                    payload: {
                      ...message.payload,
                      fromId: clientPeerId,
                      fromName: roomManager.getUserInfo(ws)?.name
                    }
                  }))
                }
              })
            }
          }
          break

        case 'ice_candidate':
          if (clientRoomId) {
            const targetId = message.payload?.targetId
            console.log(`❄️ ICE candidate relayed in room ${clientRoomId} to ${targetId}`)
            const otherClients = roomManager.getClients(clientRoomId).filter(c => c !== ws)
            
            if (targetId) {
              // Send to specific peer
              otherClients.forEach(other => {
                const otherInfo = roomManager.getUserInfo(other)
                if (otherInfo?.clientId === targetId) {
                  other.send(JSON.stringify({
                    type: 'ice_candidate',
                    payload: {
                      ...message.payload,
                      fromId: clientPeerId,
                      fromName: roomManager.getUserInfo(ws)?.name
                    }
                  }))
                }
              })
            }
          }
          break

        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            payload: { timestamp: Date.now() }
          }))
          break

        default:
          console.log(`Unknown message type: ${message.type}`)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      ws.send(JSON.stringify({
        type: 'error',
        payload: { message: 'Server error processing message' }
      }))
    }
  })

  ws.on('close', () => {
    console.log('✗ WebSocket client disconnected')
    if (clientRoomId) {
      const leftUserName = roomManager.getUserInfo(ws)?.name
      roomManager.leaveRoom(ws)
      
      // Log disconnect to database
      if (clientPeerId) {
        databaseService.endSession(clientPeerId, clientRoomId).catch(err => console.error('DB error:', err))
        databaseService.logEvent(clientRoomId, 'peer_left', { peerId: clientPeerId, peerName: leftUserName }).catch(err => console.error('DB error:', err))
      }
      
      // Notify remaining users in room
      const room = roomManager.getRoom(clientRoomId)
      if (room && room.users.size > 0) {
        const remainingUsers = roomManager.getRoomUsers(clientRoomId)
        room.users.forEach((userData, client) => {
          client.send(JSON.stringify({
            type: 'user_left',
            payload: { 
              roomId: clientRoomId,
              leftUserId: clientPeerId,
              leftUserName: leftUserName,
              userCount: room.users.size,
              users: remainingUsers
            }
          }))
        })
      }
      
      // Close room if empty and log
      if (!room || room.users.size === 0) {
        databaseService.closeRoom(clientRoomId).catch(err => console.error('DB error:', err))
      }
    }
  })

  ws.on('error', (error) => {
    console.error('✗ WebSocket error:', error)
  })
})

// Periodic cleanup of old rooms (every hour)
setInterval(() => {
  databaseService.cleanupOldRooms(24).catch(err => console.error('Cleanup error:', err))
}, 60 * 60 * 1000)

// Start server with error handling
server.on('error', (error) => {
  console.error('❌ Server error:', error)
  process.exit(1)
})

server.listen(config.port, () => {
  console.log(`✓ Server running on http://localhost:${config.port}`)
  console.log(`✓ WebSocket server ready on ws://localhost:${config.port}`)
  console.log(`✓ Environment: ${config.nodeEnv}`)
  
  // Start room cleanup (every 1 hour)
  roomManager.startCleanupInterval(3600000)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close()
})

// Catch any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error)
  process.exit(1)
})
