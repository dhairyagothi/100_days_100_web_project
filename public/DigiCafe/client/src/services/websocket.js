// WebSocket Service - Manages connection to signaling server
class WebSocketService {
  constructor() {
    this.ws = null
    
    // Get backend URL from environment or default
    // For production: VITE_BACKEND_URL env variable
    // For development: localhost:3000
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 
                       `${window.location.hostname}:3000`
    
    // Determine protocol (WSS for HTTPS, WS for HTTP)
    const isHttps = window.location.protocol === 'https:' || 
                    backendUrl.includes('https') ||
                    import.meta.env.VITE_BACKEND_URL?.includes('https')
    const protocol = isHttps ? 'wss' : 'ws'
    
    // Extract host from URL (remove protocol if present)
    const host = backendUrl
      .replace('https://', '')
      .replace('http://', '')
      .replace('wss://', '')
      .replace('ws://', '')
    
    this.url = `${protocol}://${host}`
    
    this.listeners = {}
    this.messageQueue = []
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
  }

  // Connect to WebSocket server
  connect() {
    return new Promise((resolve, reject) => {
      try {
        const protocol = this.url.startsWith('wss') ? '🔒 WSS (Encrypted)' : '⚠️  WS (Unencrypted)'
        console.log(`Connecting to ${protocol}: ${this.url}`)
        
        // Safari/Brave specific settings
        const userAgent = navigator.userAgent
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
        const isBrave = /Brave/.test(userAgent)
        
        if (isSafari) {
          console.log('🧏 Safari detected - using WSS with compatibility mode')
        }
        if (isBrave) {
          console.log('🦁 Brave detected - ensuring privacy-friendly connection')
        }
        
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('✓ WebSocket connected')
          if (this.url.startsWith('wss')) {
            console.log('🔒 Connection is encrypted (WSS)')
          }
          this.reconnectAttempts = 0
          this.flushMessageQueue()
          this.emit('connected')
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            console.log('📨 Message received:', message.type)
            this.emit(message.type, message.payload)
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }

        this.ws.onerror = (error) => {
          console.error('✗ WebSocket error:', error)
          
          // Safari/Brave specific troubleshooting
          if (this.url.startsWith('wss')) {
            const userAgent = navigator.userAgent
            if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
              console.log('💡 Safari: Try accepting the SSL certificate at https://' + this.url.split('://')[1].split(':')[0] + ':3000')
            }
            if (/Brave/.test(userAgent)) {
              console.log('💡 Brave: Check Settings > Privacy > WebRTC - ensure Fingerprinting protection is not blocking')
            }
            console.log('💡 Tip: Self-signed certificates may require browser acceptance')
            console.log('💡 Visit https://localhost:3000 in browser to accept the certificate')
          }
          
          this.emit('error', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('✗ WebSocket disconnected')
          this.emit('disconnected')
          this.attemptReconnect()
        }
      } catch (error) {
        console.error('Failed to create WebSocket:', error)
        reject(error)
      }
    })
  }

  // Send message to server
  send(type, payload = {}) {
    const message = JSON.stringify({ type, payload })

    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('📤 Sending:', type)
      this.ws.send(message)
    } else {
      console.warn('WebSocket not connected, queuing message:', type)
      this.messageQueue.push(message)
    }
  }

  // Flush queued messages
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()
      this.ws.send(message)
    }
  }

  // Subscribe to message types
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }

  // Unsubscribe from message types
  off(type, callback) {
    if (!this.listeners[type]) return
    this.listeners[type] = this.listeners[type].filter(cb => cb !== callback)
  }

  // Emit event to listeners
  emit(type, data) {
    if (!this.listeners[type]) return
    this.listeners[type].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in listener for ${type}:`, error)
      }
    })
  }

  // Attempt to reconnect
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      setTimeout(() => this.connect().catch(() => {}), this.reconnectDelay)
    } else {
      console.error('Max reconnection attempts reached')
      this.emit('reconnect_failed')
    }
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  // Check if connected
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }

  // Get connection status
  getStatus() {
    if (!this.ws) return 'disconnected'
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'disconnected'
      default:
        return 'unknown'
    }
  }
}

// Export singleton instance
export default new WebSocketService()
