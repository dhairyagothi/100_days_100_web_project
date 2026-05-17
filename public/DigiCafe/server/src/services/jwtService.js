import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const TOKEN_EXPIRY = '24h' // Token valid for 24 hours

class JWTService {
  // Generate a token for a room session
  generateToken(roomCode, peerId) {
    try {
      const payload = {
        roomCode,
        peerId,
        sessionId: crypto.randomUUID(),
        iat: Math.floor(Date.now() / 1000)
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
      console.log(`🔐 Token generated for peer ${peerId} in room ${roomCode}`)
      return token
    } catch (error) {
      console.error('✗ Error generating token:', error.message)
      throw error
    }
  }

  // Verify a token
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log(`✓ Token verified for peer ${decoded.peerId}`)
      return decoded
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.warn('⚠️ Token expired')
        throw new Error('Token expired')
      } else if (error.name === 'JsonWebTokenError') {
        console.warn('⚠️ Invalid token')
        throw new Error('Invalid token')
      } else {
        console.error('✗ Error verifying token:', error.message)
        throw error
      }
    }
  }

  // Decode token without verification (for debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token)
    } catch (error) {
      console.error('✗ Error decoding token:', error.message)
      return null
    }
  }

  // Generate a refresh token (longer expiry for getting new access tokens)
  generateRefreshToken(peerId) {
    try {
      const payload = {
        peerId,
        tokenType: 'refresh',
        iat: Math.floor(Date.now() / 1000)
      }

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
      console.log(`🔄 Refresh token generated for peer ${peerId}`)
      return token
    } catch (error) {
      console.error('✗ Error generating refresh token:', error.message)
      throw error
    }
  }

  // Validate token format
  isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false
    const parts = token.split('.')
    return parts.length === 3 // JWT has 3 parts separated by dots
  }
}

export default new JWTService()
