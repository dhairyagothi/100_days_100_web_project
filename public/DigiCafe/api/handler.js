import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { config } from '../config/index.js'
import { query as dbQuery } from '../config/database.js'
import apiRoutes from '../routes/index.js'
import roomManager from '../services/roomManager.js'
import databaseService from '../services/databaseService.js'
import jwtService from '../services/jwtService.js'
import { createSecureServer } from '../config/ssl.js'

export default function handler(req, res) {
  // API route handler for Vercel
  const app = express()
  
  // Middleware
  app.use(cors())
  app.use(express.json())

  // Routes
  app.use('/api', apiRoutes)

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  // Room stats endpoint
  app.get('/api/rooms/:roomCode/stats', async (req, res) => {
    try {
      const { roomCode } = req.params
      const room = roomManager.getRoom(roomCode)
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' })
      }

      const stats = {
        roomCode: room.code,
        createdAt: room.createdAt,
        createdBy: room.createdBy,
        peers: room.peers.length,
        peersInfo: room.peers.map(p => ({
          id: p.id,
          joinedAt: p.joinedAt,
          isInitiator: p.isInitiator
        }))
      }

      res.json(stats)
    } catch (error) {
      console.error('Error fetching room stats:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return handler(req, res)
}
