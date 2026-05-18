// WebRTC Peer Connection Manager
import ws from './websocket'

class RTCPeerManager {
  constructor() {
    this.peerConnection = null
    this.isInitiator = false // true if we create the offer, false if we answer
    this.listeners = {}
    this.dataChannel = null
    this.localStream = null
    this.remoteStream = null
    this.iceCandidateQueue = [] // Queue for candidates before peer connection ready
    
    // STUN/TURN servers for NAT traversal - Multiple servers for reliability
    this.iceServers = [
      // Primary STUN servers (Google)
      { urls: ['stun:stun.l.google.com:19302'] },
      { urls: ['stun:stun1.l.google.com:19302'] },
      { urls: ['stun:stun2.l.google.com:19302'] },
      { urls: ['stun:stun3.l.google.com:19302'] },
      { urls: ['stun:stun4.l.google.com:19302'] },
      
      // Fallback STUN servers
      { urls: ['stun:stunserver.org:3478'] },
      { urls: ['stun:stun.l.google.com:5349'] },
      
      // Primary TURN servers with UDP/TCP/TLS options
      {
        urls: ['turn:openrelay.metered.ca:80'],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: ['turn:openrelay.metered.ca:443'],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      {
        urls: ['turn:openrelay.metered.ca:443?transport=tcp'],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      },
      // Additional TURN server
      {
        urls: ['turn:turnserver.example.com:3478', 'turn:turnserver.example.com:5349'],
        username: 'guest',
        credential: 'somepassword'
      }
    ]
  }

  // Initialize peer connection
  initializePeerConnection(isInitiator = false) {
    console.log('🔌 Initializing peer connection...')
    this.isInitiator = isInitiator

    // Detect browser for specific configuration
    const userAgent = navigator.userAgent
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
    const isBrave = /Brave/.test(userAgent)

    const config = {
      iceServers: this.iceServers,
      // For Safari/Brave compatibility and long-distance connections
      iceTransportPolicy: 'all', // Use both host and relay candidates
      bundlePolicy: 'max-bundle', // Bundle all media on single transport
      rtcpMuxPolicy: 'require',  // Required for most browsers
      iceCandidatePoolSize: 0    // Let app handle ICE candidates
    }

    // Safari specific settings
    if (isSafari) {
      console.log('🧏 Safari detected - applying Safari-specific settings')
      config.offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      }
    }

    this.peerConnection = new RTCPeerConnection(config)

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate
        console.log(`❄️ ICE candidate: ${candidate.candidate.split(' ')[7] || 'N/A'} (${candidate.type})`)
        this.emit('ice_candidate', event.candidate)
        
        // Send ALL ICE candidates including relay candidates to peer
        // Important for long-distance connections and restricted networks
        ws.send('ice_candidate', {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          usernameFragment: event.candidate.usernameFragment
        })
      } else {
        console.log('❄️ All ICE candidates gathered complete')
        this.emit('ice_gathering_complete')
      }
    }

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState
      console.log(`📊 Connection state: ${state}`)
      this.emit('connection_state_change', state)

      if (state === 'failed') {
        console.error('✗ Connection failed - attempting restart')
        this.emit('connection_failed')
        // Schedule retry for connection restart
        setTimeout(() => this.attemptConnectionRestart(), 5000)
      } else if (state === 'connected' || state === 'completed') {
        console.log('✓ Connection established successfully')
        this.emit('connected')
      } else if (state === 'disconnected') {
        console.warn('⚠️ Connection disconnected, will retry in 10s')
        setTimeout(() => this.attemptConnectionRestart(), 10000)
      }
    }

    // Handle ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection.iceConnectionState
      console.log(`❄️ ICE connection state: ${state}`)
      this.emit('ice_connection_state_change', state)
    }

    // Handle signaling state
    this.peerConnection.onsignalingstatechange = () => {
      const state = this.peerConnection.signalingState
      console.log(`📡 Signaling state: ${state}`)
      this.emit('signaling_state_change', state)
    }

    // Handle remote tracks
    this.peerConnection.ontrack = (event) => {
      console.log('🎥 Received remote track:', event.track.kind)
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream()
        this.emit('remote_stream', this.remoteStream)
      }
      this.remoteStream.addTrack(event.track)
    }

    // Setup data channel if we're the initiator
    if (isInitiator) {
      this.createDataChannel()
      // Create and send offer after setup
      setTimeout(() => this.createAndSendOffer(), 100)
    } else {
      // If we're the responder, wait for data channel from initiator
      this.peerConnection.ondatachannel = (event) => {
        console.log('📤 Data channel received from peer')
        this.setupDataChannel(event.channel)
      }
    }
  }

  // Create offer (initiated by the first peer)
  async createAndSendOffer() {
    try {
      console.log('📤 Creating offer...')
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })

      await this.peerConnection.setLocalDescription(offer)
      console.log('✓ Local description set')

      // Send offer to peer through WebSocket
      ws.send('offer', {
        sdp: this.peerConnection.localDescription.sdp
      })
      console.log('📤 Offer sent to peer')
      this.emit('offer_sent')
    } catch (error) {
      console.error('✗ Error creating offer:', error)
      this.emit('error', error)
    }
  }

  // Handle incoming offer
  async handleOffer(offerSdp) {
    try {
      console.log('📥 Received offer from peer')

      // Only initialize if not already initialized
      if (!this.peerConnection) {
        console.log('🔌 Peer connection not initialized, initializing as responder now')
        this.initializePeerConnection(false) // Initialize as responder
        // Give it a moment for setup
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      // Use modern approach without RTCSessionDescription
      await this.peerConnection.setRemoteDescription({ type: 'offer', sdp: offerSdp })
      console.log('✓ Remote description (offer) set')
      
      // Flush any queued ICE candidates
      this.flushIceCandidateQueue()

      // Create and send answer
      await this.createAndSendAnswer()
    } catch (error) {
      console.error('✗ Error handling offer:', error)
      this.emit('error', error)
    }
  }

  // Create answer (responder to the offer)
  async createAndSendAnswer() {
    try {
      console.log('📥 Creating answer...')
      const answer = await this.peerConnection.createAnswer()

      await this.peerConnection.setLocalDescription(answer)
      console.log('✓ Local description set')

      // Send answer to peer through WebSocket
      ws.send('answer', {
        sdp: this.peerConnection.localDescription.sdp
      })
      console.log('📥 Answer sent to peer')
      this.emit('answer_sent')
    } catch (error) {
      console.error('✗ Error creating answer:', error)
      this.emit('error', error)
    }
  }

  // Handle incoming answer
  async handleAnswer(answerSdp) {
    try {
      console.log('📥 Received answer from peer')
      // Use modern approach without RTCSessionDescription
      await this.peerConnection.setRemoteDescription({ type: 'answer', sdp: answerSdp })
      console.log('✓ Remote description (answer) set')
      
      // Flush any queued ICE candidates
      this.flushIceCandidateQueue()
      
      this.emit('answer_received')
    } catch (error) {
      console.error('✗ Error handling answer:', error)
      this.emit('error', error)
    }
  }

  // Add local stream
  async addLocalStream(stream) {
    try {
      console.log('🎥 Adding local stream to peer connection')
      this.localStream = stream
      stream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, stream)
      })
      console.log('✓ Local stream added')
      this.emit('local_stream_added')
      
      // Trigger renegotiation to send video to peer
      await this.renegotiateConnection()
    } catch (error) {
      console.error('✗ Error adding local stream:', error)
      this.emit('error', error)
    }
  }

  // Renegotiate connection (for adding/removing tracks)
  async renegotiateConnection() {
    try {
      if (!this.peerConnection) {
        console.warn('⚠️ Peer connection not initialized')
        return
      }

      // Check if we're in a state where we can renegotiate
      if (this.peerConnection.signalingState !== 'stable') {
        console.warn('⚠️ Cannot renegotiate, signaling state:', this.peerConnection.signalingState)
        // Queue the renegotiation
        await new Promise(resolve => setTimeout(resolve, 1000))
        return this.renegotiateConnection()
      }

      console.log('🔄 Renegotiating connection...')
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      })

      await this.peerConnection.setLocalDescription(offer)
      console.log('🔄 New offer created and set as local description')

      // Send new offer to peer
      ws.send('offer', {
        sdp: this.peerConnection.localDescription.sdp
      })
      console.log('🔄 New offer sent for renegotiation')
    } catch (error) {
      console.error('✗ Error during renegotiation:', error)
      this.emit('error', error)
    }
  }

  // Get user media (camera/microphone)
  async getUserMedia(constraints = { audio: true, video: { width: 640, height: 480 } }) {
    try {
      console.log('📹 Requesting user media...')
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      console.log('✓ User media acquired')
      this.emit('user_media', stream)
      return stream
    } catch (error) {
      console.error('✗ Error getting user media:', error)
      this.emit('media_error', error)
      throw error
    }
  }

  // Stop local stream
  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop()
      })
      this.localStream = null
      console.log('🛑 Local stream stopped')
    }
  }

  // Create data channel (initiator)
  createDataChannel() {
    try {
      console.log('📢 Creating data channel...')
      this.dataChannel = this.peerConnection.createDataChannel('content', {
        ordered: true
      })
      this.setupDataChannel(this.dataChannel)
      console.log('✓ Data channel created')
    } catch (error) {
      console.error('✗ Error creating data channel:', error)
      this.emit('error', error)
    }
  }

  // Setup data channel event handlers
  setupDataChannel(channel) {
    this.dataChannel = channel

    this.dataChannel.onopen = () => {
      console.log('📢 Data channel opened')
      // Enable file transfer when data channel opens
      if (!this._receivingFiles) {
        this.enableFileTransfer()
      }
      this.emit('data_channel_open', this.dataChannel)
    }

    this.dataChannel.onclose = () => {
      console.log('📢 Data channel closed')
      this.emit('data_channel_close')
    }

    this.dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('📥 Data channel JSON message:', message.type)
        
        // Handle file-related messages
        if (this._fileMessageHandler && message.type && message.type.startsWith('file_')) {
          this._fileMessageHandler(message)
          return
        }
        
        this.emit('data_channel_message', message)
      } catch (error) {
        // Handle raw text messages (chat)
        console.log('📥 Data channel text message:', event.data.substring(0, 50))
        // Emit as object for consistency
        this.emit('data_channel_text', { text: event.data })
      }
    }

    this.dataChannel.onerror = (error) => {
      console.error('📢 Data channel error:', error)
      this.emit('data_channel_error', error)
    }
  }

  // Send message via data channel
  sendDataChannelMessage(message) {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('📢 Data channel not ready')
      return false
    }
    try {
      const payload = typeof message === 'string' ? message : JSON.stringify(message)
      this.dataChannel.send(payload)
      console.log('📤 Data channel message sent')
      return true
    } catch (error) {
      console.error('📢 Error sending via data channel:', error)
      return false
    }
  }

  // Get data channel status
  getDataChannelStatus() {
    if (!this.dataChannel) return 'not_created'
    return this.dataChannel.readyState
  }

  // Listen to remote stream
  onRemoteStream(callback) {
    if (this.peerConnection) {
      this.peerConnection.ontrack = (event) => {
        console.log('🎥 Received remote stream')
        if (!this.remoteStream) {
          this.remoteStream = new MediaStream()
        }
        this.remoteStream.addTrack(event.track)
        callback(this.remoteStream)
      }
    }
  }

  // Improve ICE candidate handling with queueing
  handleIceCandidate(candidateData) {
    // Queue candidates that arrive before answer is set
    if (this.peerConnection.remoteDescription === null) {
      console.log('⏳ Queueing ICE candidate (remote description not ready)')
      this.iceCandidateQueue.push(candidateData)
      return
    }
    
    this._addIceCandidate(candidateData)
  }

  // Actually add the ICE candidate
  async _addIceCandidate(candidateData) {
    try {
      if (!this.peerConnection) {
        console.warn('⚠️ Peer connection not initialized yet')
        return
      }

      // Handle null candidate (end of candidates)
      if (!candidateData || !candidateData.candidate) {
        console.log('✓ End of ICE candidates')
        return
      }

      const candidate = new RTCIceCandidate({
        candidate: candidateData.candidate,
        sdpMLineIndex: candidateData.sdpMLineIndex,
        sdpMid: candidateData.sdpMid,
        usernameFragment: candidateData.usernameFragment
      })

      await this.peerConnection.addIceCandidate(candidate)
      console.log('✓ ICE candidate added successfully')
    } catch (error) {
      // Safari & Brave may fail to add relay candidates, but that's OK
      // Host and srflx candidates should work
      const isIgnorableError = 
        error.name === 'OperationError' || 
        error.message.includes('Cannot add remote ICE candidate')
      
      if (!isIgnorableError) {
        console.warn('⚠️ ICE candidate error:', error.message)
      } else {
        console.log('ℹ️ ICE candidate skipped (relay candidate or timeout)')
      }
    }
  }

  // Flush queued ICE candidates
  flushIceCandidateQueue() {
    console.log(`📬 Flushing ${this.iceCandidateQueue.length} queued ICE candidates`)
    while (this.iceCandidateQueue.length > 0) {
      const candidate = this.iceCandidateQueue.shift()
      this._addIceCandidate(candidate)
    }
  }

  // Get statistics
  async getStats() {
    if (!this.peerConnection) return null
    const stats = await this.peerConnection.getStats()
    return stats
  }

  // Close peer connection
  close() {
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
      console.log('✗ Peer connection closed')
      this.emit('closed')
    }
  }

  // Attempt to restart failed connection
  attemptConnectionRestart() {
    try {
      console.log('🔄 Attempting connection restart...')
      const wasInitiator = this.isInitiator
      
      // Close the old connection
      if (this.peerConnection) {
        this.peerConnection.close()
      }
      
      // Reinitialize
      this.peerConnection = null
      this.iceCandidateQueue = []
      this.initializePeerConnection(wasInitiator)
      
      // If we were initiator, send new offer
      if (wasInitiator) {
        setTimeout(() => this.createAndSendOffer(), 500)
      }
      
      console.log('✓ Connection restart initiated')
    } catch (error) {
      console.error('✗ Error restarting connection:', error)
      this.emit('restart_failed', error)
    }
  }

  // Event listener
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  off(event, callback) {
    if (!this.listeners[event]) return
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
  }

  emit(event, data) {
    if (!this.listeners[event]) return
    this.listeners[event].forEach(callback => {
      try {
        callback(data)
      } catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    })
  }

  // Get connection state
  getState() {
    if (!this.peerConnection) return 'closed'
    return {
      connectionState: this.peerConnection.connectionState,
      iceConnectionState: this.peerConnection.iceConnectionState,
      signalingState: this.peerConnection.signalingState,
      isInitiator: this.isInitiator
    }
  }

  // ===== FILE SHARING METHODS =====
  
  // Constants for file transfer
  static CHUNK_SIZE = 16 * 1024 // 16KB chunks (reduced from 64KB for reliability)
  static TRANSFER_TIMEOUT = 30000 // 30 seconds

  // Send file through data channel
  async sendFile(file) {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel not ready')
    }

    const fileId = Math.random().toString(36).substring(7)
    const totalChunks = Math.ceil(file.size / RTCPeerManager.CHUNK_SIZE)
    
    console.log(`📤 Sending file: ${file.name} (${file.size} bytes, ${totalChunks} chunks)`)

    // Send file metadata
    this.sendDataChannelMessage(JSON.stringify({
      type: 'file_start',
      fileId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      totalChunks
    }))

    // Send file chunks with better buffer management
    for (let i = 0; i < totalChunks; i++) {
      const start = i * RTCPeerManager.CHUNK_SIZE
      const end = Math.min(start + RTCPeerManager.CHUNK_SIZE, file.size)
      const chunk = file.slice(start, end)
      const arrayBuffer = await chunk.arrayBuffer()

      // Check buffer before sending
      if (this.dataChannel.bufferedAmount > 1024 * 1024) { // 1MB buffer threshold
        console.log('⏳ Buffer full, waiting...')
        await new Promise(resolve => setTimeout(resolve, 50))
      }

      this.dataChannel.send(JSON.stringify({
        type: 'file_chunk',
        fileId,
        chunkIndex: i,
        totalChunks,
        data: Array.from(new Uint8Array(arrayBuffer))
      }))

      // Emit progress
      this.emit('file_send_progress', {
        fileId,
        fileName: file.name,
        chunkIndex: i,
        totalChunks,
        progress: Math.round(((i + 1) / totalChunks) * 100)
      })

      console.log(`📤 Chunk ${i + 1}/${totalChunks} sent`)

      // Longer delay for larger files
      await new Promise(resolve => setTimeout(resolve, 25))
    }

    // Send completion signal
    this.sendDataChannelMessage(JSON.stringify({
      type: 'file_end',
      fileId,
      fileName: file.name
    }))

    console.log(`✓ File sent: ${file.name}`)
    this.emit('file_sent', { fileId, fileName: file.name })
  }

  // Initialize file receiving
  initializeFileReceiving() {
    this._receivingFiles = {}

    // Store handler reference for file receiving
    this._fileMessageHandler = (message) => {
      if (!message.type) return

      if (message.type === 'file_start') {
        console.log(`📥 Receiving file: ${message.fileName} (${message.fileSize} bytes)`)
        this._receivingFiles[message.fileId] = {
          name: message.fileName,
          size: message.fileSize,
          type: message.fileType,
          chunks: new Array(message.totalChunks).fill(null),
          received: 0,
          totalChunks: message.totalChunks
        }
        console.log(`📥 File metadata: ${message.totalChunks} chunks expected`)
      } else if (message.type === 'file_chunk') {
        const fileData = this._receivingFiles[message.fileId]
        if (fileData) {
          if (!fileData.chunks[message.chunkIndex]) {
            fileData.chunks[message.chunkIndex] = new Uint8Array(message.data)
            fileData.received++
            console.log(`📥 Chunk ${message.chunkIndex + 1}/${fileData.totalChunks} received`)
          }

          this.emit('file_receive_progress', {
            fileId: message.fileId,
            fileName: fileData.name,
            chunkIndex: message.chunkIndex,
            totalChunks: fileData.totalChunks,
            progress: Math.round((fileData.received / fileData.totalChunks) * 100)
          })
        }
      } else if (message.type === 'file_end') {
        const fileData = this._receivingFiles[message.fileId]
        if (fileData) {
          console.log(`📥 File end received. Chunks received: ${fileData.received}/${fileData.totalChunks}`)
          
          if (fileData.received === fileData.totalChunks) {
            // Reconstruct file
            const fullBuffer = new Uint8Array(fileData.size)
            let offset = 0
            
            for (let i = 0; i < fileData.chunks.length; i++) {
              if (fileData.chunks[i]) {
                fullBuffer.set(fileData.chunks[i], offset)
                offset += fileData.chunks[i].length
              } else {
                console.warn(`⚠️ Missing chunk ${i}`)
              }
            }

            const blob = new Blob([fullBuffer], { type: fileData.type })
            console.log(`✓ File received: ${fileData.name}`)
            
            this.emit('file_received', {
              fileId: message.fileId,
              fileName: fileData.name,
              blob
            })

            delete this._receivingFiles[message.fileId]
          } else {
            console.warn(`⚠️ File incomplete: received ${fileData.received}/${fileData.totalChunks} chunks`)
          }
        }
      }
    }
  }

  // Enable file transfer mode
  enableFileTransfer() {
    this.initializeFileReceiving()
  }
}

export default new RTCPeerManager()
