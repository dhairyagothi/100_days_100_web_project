import { useState, useRef, useEffect } from 'react'
import { Menu, X, Copy, MessageSquare, FileUp, Video, ArrowLeft, Check, Upload, File, Download, Mic, Camera, Users, Smile, MonitorPlay } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import Logo from '../components/Logo'
import WatchPartyView from '../components/WatchPartyView'
import '../styles/room.css'
import ws from '../services/websocket'
import multiPeerManager from '../services/multiPeerManager'

export default function RoomLayout({ roomCode, isCreator, userName, setRoomCode, onLeaveRoom }) {
  const [activeTab, setActiveTab] = useState('chat')
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [localStream, setLocalStream] = useState(null)
  const [remotePeers, setRemotePeers] = useState(new Map()) // peerId -> { stream, userName }
  const [connectedPeers, setConnectedPeers] = useState(new Map()) // peerId -> { userName, connected: true }
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [roomUsers, setRoomUsers] = useState([]) // All users in the room
  const [myClientId, setMyClientId] = useState(null)
  const myClientIdRef = useRef(null)

  // Notification states
  const activeTabRef = useRef(activeTab)
  const [unreadChatCount, setUnreadChatCount] = useState(0)
  const [unreadFilesCount, setUnreadFilesCount] = useState(0)
  const [hasNewVideoUser, setHasNewVideoUser] = useState(false)

  // Watch Party states
  const [watchPartyHost, setWatchPartyHost] = useState(null)
  const [watchPartyHostName, setWatchPartyHostName] = useState('')
  const [watchPartyStream, setWatchPartyStream] = useState(null)
  const watchPartyStreamIdRef = useRef(null)

  // Sync activeTab ref and reset notifications on tab change
  useEffect(() => {
    activeTabRef.current = activeTab
    if (activeTab === 'chat') setUnreadChatCount(0)
    if (activeTab === 'files') setUnreadFilesCount(0)
    if (activeTab === 'video') setHasNewVideoUser(false)
  }, [activeTab])

  // Track if we've already sent the create/join message
  const hasInitialized = useRef(false)
  const joinRetryCount = useRef(0)
  const joinRetryTimeoutRef = useRef(null)
  const maxRetries = 3

  // Connect to WebSocket on mount
  useEffect(() => {
    // 1. Define handlers
    const handleConnected = () => {
      setConnectionStatus('Connected to server')
    }

    const handleJoinError = (data) => {
      console.error('❌ Server error:', JSON.stringify(data, null, 2))
      const errorMsg = data?.message || 'Server error'
      const roomId = data?.roomId || roomCode
      const availableRooms = data?.available_rooms || 'NONE'

      setConnectionStatus(`❌ ${errorMsg}`)

      console.log(`🔍 Debugging Info:`)
      console.log(`   Room attempted: ${roomId}`)
      console.log(`   Available rooms: ${availableRooms}`)
      console.log(`   Raw error data:`, data)

      if (availableRooms && availableRooms !== 'NONE') {
        console.log('✅ Rooms available:', availableRooms)
      } else {
        console.log('⚠️ No rooms on server. The room may have expired or server restarted.')

        // Auto-retry if join failed and we haven't exceeded max retries
        if (!isCreator && joinRetryCount.current < maxRetries) {
          const retryDelay = 2000 * (joinRetryCount.current + 1) // Exponential backoff: 2s, 4s, 6s
          joinRetryCount.current++

          console.log(`🔄 Retrying join in ${retryDelay / 1000}s (Attempt ${joinRetryCount.current}/${maxRetries})`)
          setConnectionStatus(`⏳ Retrying... (${joinRetryCount.current}/${maxRetries})`)

          joinRetryTimeoutRef.current = setTimeout(() => {
            console.log(`🔄 Retrying join for room: ${roomCode}`)
            ws.send('join', { roomId: roomCode, userName })
          }, retryDelay)
        } else if (!isCreator && joinRetryCount.current >= maxRetries) {
          console.log('❌ Max join retries exceeded')
          setConnectionStatus('❌ Room connection failed. Please create a new room.')
        } else {
          console.log('💡 Solution: Try creating a new room and joining immediately')
        }
      }
    }

    const handleRoomCreated = (data) => {
      console.log('🏠 Room created:', data.roomId, 'Client ID:', data.clientId)

      // Reset retry count on successful room creation
      joinRetryCount.current = 0
      if (joinRetryTimeoutRef.current) {
        clearTimeout(joinRetryTimeoutRef.current)
      }

      setRoomCode(data.roomId)
      setMyClientId(data.clientId)
      myClientIdRef.current = data.clientId
      setRoomUsers(data.users || [])
      setConnectionStatus('Room created, waiting for others...')
    }

    const handleJoinConfirmed = (data) => {
      console.log('✓ Joined room:', data.roomId, 'Client ID:', data.clientId)

      // Reset retry count on successful join
      joinRetryCount.current = 0
      if (joinRetryTimeoutRef.current) {
        clearTimeout(joinRetryTimeoutRef.current)
      }

      setRoomCode(data.roomId)
      setMyClientId(data.clientId)
      myClientIdRef.current = data.clientId
      setRoomUsers(data.users || [])
      setConnectionStatus('Joined room')

      // Initialize peer connections with existing users
      const otherUsers = data.users.filter(u => u.clientId !== data.clientId)
      otherUsers.forEach(user => {
        console.log(`👥 Initializing peer connection as responder for ${user.name}`)
        multiPeerManager.initializePeerConnection(user.clientId, false, user.name)
      })
    }

    const handleUserJoined = (data) => {
      console.log('👥 New user joined:', data.newUser.name)
      setRoomUsers(data.users || [])
      setConnectionStatus(`${data.newUser.name} joined the room`)

      // Initialize as initiator for the new user
      if (myClientIdRef.current && data.newUser.clientId !== myClientIdRef.current) {
        console.log(`👥 Initializing peer connection as initiator for ${data.newUser.name}`)
        multiPeerManager.initializePeerConnection(data.newUser.clientId, true, data.newUser.name)
      }
    }

    const handleUserLeft = (data) => {
      console.log('👋 User left:', data.leftUserName, `(${data.leftUserId})`)
      setRoomUsers(data.users || [])
      setConnectionStatus(`${data.leftUserName} left the room`)

      // Close peer connection and clean up all references
      console.log(`🧹 Cleaning up peer: ${data.leftUserId}`)
      multiPeerManager.closePeer(data.leftUserId)

      // Update both peer maps
      setRemotePeers(prev => {
        const updated = new Map(prev)
        updated.delete(data.leftUserId)
        console.log(`🗑️ Removed from remotePeers: ${data.leftUserId}, remaining: ${updated.size}`)
        return updated
      })
      setConnectedPeers(prev => {
        const updated = new Map(prev)
        updated.delete(data.leftUserId)
        console.log(`🗑️ Removed from connectedPeers: ${data.leftUserId}, remaining: ${updated.size}`)
        return updated
      })
    }

    const handleOffer = (data) => {
      console.log('📤 Received offer from', data.fromName)
      multiPeerManager.handleOffer(data.fromId, data.sdp, data.fromName)
    }

    const handleAnswer = (data) => {
      console.log('📥 Received answer from', data.fromName)
      multiPeerManager.handleAnswer(data.fromId, data.sdp)
    }

    const handleIceCandidate = (data) => {
      console.log('❄️ Received ICE candidate from', data.fromId)
      multiPeerManager.handleIceCandidate(
        data.fromId,
        data.candidate,
        data.sdpMLineIndex,
        data.sdpMid,
        data.usernameFragment
      )
    }

    const handlePeerInitialized = (data) => {
      console.log(`🔌 Peer initialized: ${data.userName} (${data.isInitiator ? 'initiator' : 'responder'})`)
      // Track peer immediately (before fully connected)
      setConnectedPeers(prev => new Map(prev).set(data.peerId, {
        userName: data.userName,
        connected: false
      }))
    }

    const handlePeerConnected = (data) => {
      console.log(`✓ Connected to ${data.userName}`)
      setConnectionStatus(`Connected to ${data.userName}`)
      // Update peer status to connected
      setConnectedPeers(prev => new Map(prev).set(data.peerId, {
        userName: data.userName,
        connected: true
      }))
    }

    const handlePeerDisconnected = (data) => {
      console.log(`✗ Disconnected from ${data.userName} (${data.peerId})`)
      // Remove from both video peers and connected peers immediately
      setRemotePeers(prev => {
        const updated = new Map(prev)
        updated.delete(data.peerId)
        console.log(`🗑️ Removed from remotePeers: ${data.peerId}, remaining: ${updated.size}`)
        return updated
      })
      setConnectedPeers(prev => {
        const updated = new Map(prev)
        updated.delete(data.peerId)
        console.log(`🗑️ Removed from connectedPeers: ${data.peerId}, remaining: ${updated.size}`)
        return updated
      })
    }

    const handleRemoteStream = (data) => {
      console.log(`🎥 Remote stream received from ${data.userName}`)

      // Since multiPeerManager bundles all tracks into peerData.remoteStream,
      // data.stream is ALWAYS the single stream for this peer.
      // If this peer is the host, it means this stream contains the watch party tracks!
      setRemotePeers(prev => {
        const newMap = new Map(prev)
        const existing = newMap.get(data.peerId) || { userName: data.userName }
        newMap.set(data.peerId, { ...existing, stream: data.stream })
        return newMap
      });

      // Use setTimeout to avoid React warnings when setting state during render/events
      setTimeout(() => {
        if (activeTabRef.current !== 'video') {
          setHasNewVideoUser(true)
        }
        
        setWatchPartyHost(currentHost => {
          if (currentHost === data.peerId) {
            setWatchPartyStream(data.stream);
          }
          return currentHost;
        });
      }, 0);
    }

    const handleConnectionStateChange = (data) => {
      console.log(`Connection state for ${data.peerId}: ${data.state}`)
    }

    const handleDisconnected = () => {
      setConnectionStatus('Disconnected')
      multiPeerManager.closeAll()
    }

    const handleGenericError = (error) => {
      console.error('WebSocket error:', error)
      setConnectionStatus('Connection error')
    }

    const handleReconnectFailed = () => {
      setConnectionStatus('Connection failed')
    }

    // 2. Register listeners
    ws.on('connected', handleConnected)
    ws.on('error', handleJoinError) // Handles join/create failures
    ws.on('error', handleGenericError) // Handles generic WebSocket errors
    ws.on('room_created', handleRoomCreated)
    ws.on('join_confirmed', handleJoinConfirmed)
    ws.on('user_joined', handleUserJoined)
    ws.on('user_left', handleUserLeft)
    ws.on('offer', handleOffer)
    ws.on('answer', handleAnswer)
    ws.on('ice_candidate', handleIceCandidate)
    ws.on('disconnected', handleDisconnected)
    ws.on('reconnect_failed', handleReconnectFailed)

    multiPeerManager.on('peer_initialized', handlePeerInitialized)
    multiPeerManager.on('peer_connected', handlePeerConnected)
    multiPeerManager.on('peer_disconnected', handlePeerDisconnected)
    multiPeerManager.on('remote_stream', handleRemoteStream)
    multiPeerManager.on('connection_state_change', handleConnectionStateChange)

    const handleTextMessageNotification = () => {
      if (activeTabRef.current !== 'chat') {
        setUnreadChatCount(prev => prev + 1)
      }
    }

    const handleFileNotification = () => {
      if (activeTabRef.current !== 'files') {
        setUnreadFilesCount(prev => prev + 1)
      }
    }

    const handleWatchPartyState = (data) => {
      if (data.isHosting) {
        setWatchPartyHost(data.peerId);
        watchPartyStreamIdRef.current = data.streamId;

        // Find name
        setConnectedPeers(peers => {
          const peer = peers.get(data.peerId);
          if (peer) setWatchPartyHostName(peer.userName);
          return peers;
        });

        // If stream arrived earlier, assign it now
        setRemotePeers(prev => {
          const peerData = prev.get(data.peerId);
          if (peerData && peerData.stream) {
            setTimeout(() => setWatchPartyStream(peerData.stream), 0);
          }
          return prev;
        });
      } else {
        setWatchPartyHost(null);
        setWatchPartyHostName('');
        setWatchPartyStream(null);
        watchPartyStreamIdRef.current = null;
      }
    }

    multiPeerManager.on('text_message', handleTextMessageNotification)
    multiPeerManager.on('file_received', handleFileNotification)
    multiPeerManager.on('watch_party_state', handleWatchPartyState)
    multiPeerManager.on('watch_party_stopped_local', () => {
      setWatchPartyHost(null);
      setWatchPartyHostName('');
      setWatchPartyStream(null);
      watchPartyStreamIdRef.current = null;
    })

    // 3. Connection logic
    const initWebSocket = async () => {
      try {
        setConnectionStatus('Connecting...')
        await ws.connect()

        // Create room if we're the creator, otherwise join (only once)
        if (!hasInitialized.current) {
          hasInitialized.current = true

          if (isCreator) {
            console.log('🏠 Creating room...')
            ws.send('create', { userName })
          } else if (roomCode) {
            console.log('👥 Joining room:', roomCode)
            ws.send('join', { roomId: roomCode, userName })
          }
        }
      } catch (error) {
        console.error('Failed to initialize:', error)
        setConnectionStatus('Connection failed')
      }
    }

    initWebSocket()

    // 4. Cleanup on unmount
    return () => {
      // Clear any pending join retries
      if (joinRetryTimeoutRef.current) {
        clearTimeout(joinRetryTimeoutRef.current)
      }

      // Remove all event listeners
      ws.off('connected', handleConnected)
      ws.off('error', handleJoinError)
      ws.off('error', handleGenericError)
      ws.off('room_created', handleRoomCreated)
      ws.off('join_confirmed', handleJoinConfirmed)
      ws.off('user_joined', handleUserJoined)
      ws.off('user_left', handleUserLeft)
      ws.off('offer', handleOffer)
      ws.off('answer', handleAnswer)
      ws.off('ice_candidate', handleIceCandidate)
      ws.off('disconnected', handleDisconnected)
      ws.off('reconnect_failed', handleReconnectFailed)

      multiPeerManager.off('peer_initialized', handlePeerInitialized)
      multiPeerManager.off('peer_connected', handlePeerConnected)
      multiPeerManager.off('peer_disconnected', handlePeerDisconnected)
      multiPeerManager.off('remote_stream', handleRemoteStream)
      multiPeerManager.off('connection_state_change', handleConnectionStateChange)

      multiPeerManager.off('text_message', handleTextMessageNotification)
      multiPeerManager.off('file_received', handleFileNotification)
      multiPeerManager.off('watch_party_state', handleWatchPartyState)

      multiPeerManager.closeAll()
      if (ws.isConnected()) {
        ws.disconnect()
      }
    }
  }, [])

  const handleCopyRoomCode = () => {
    const link = `${window.location.origin}${window.location.pathname}?room=${roomCode}`
    navigator.clipboard.writeText(link)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLeaveRoom = () => {
    multiPeerManager.closeAll()
    if (onLeaveRoom) {
      onLeaveRoom()
    }
  }

  // Start local media stream
  const startLocalMedia = async () => {
    try {
      const constraints = {
        audio: true,
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      }
      const stream = await multiPeerManager.getUserMedia(constraints)
      setLocalStream(stream)
      setIsAudioEnabled(true)
      setIsVideoEnabled(true)
    } catch (error) {
      console.error('Failed to get user media:', error)
      alert('Failed to access camera/microphone. Please check permissions.')
    }
  }

  // Stop local media stream
  const stopLocalMedia = () => {
    if (localStream) {
      multiPeerManager.stopLocalStream()
      setLocalStream(null)
      setIsAudioEnabled(false)
      setIsVideoEnabled(false)
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  // Send message to all peers
  const sendMessage = (message) => {
    // Use connectedPeers for messaging (includes peers without video)
    const peers = Array.from(connectedPeers.keys())
    const peersList = Array.from(connectedPeers.values()).map(p => p.userName)
    console.log(`📤 Sending message to ${peers.length} connected peers: ${peersList.join(', ') || 'NONE'}`)
    console.log(`   Connected peers: ${peers.join(', ') || 'NONE'}`)
    let sent = false

    if (peers.length === 0) {
      console.warn('⚠️ No connected peers to send message to (may still be connecting)')
      return false
    }

    peers.forEach(peerId => {
      const channelOpen = multiPeerManager.sendMessage(peerId, 'chat', { type: 'text', text: message })
      if (channelOpen) {
        console.log(`✓ Message sent to peer ${peerId}`)
        sent = true
      } else {
        console.warn(`⚠️ Data channel not open for peer ${peerId}`)
      }
    })

    return sent
  }

  return (
    <div className="room-container">
      {/* Mobile Sidebar Toggle */}
      <button
        className={`sidebar-toggle ${isSidebarOpen ? 'hidden-on-mobile' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`room-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <Logo variant="small" />
          <button
            className="close-sidebar"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Room Info */}
        <div className="room-info">
          <div className="room-label">ROOM</div>
          <div className="room-code-display">
            <span className="room-code">{roomCode}</span>
            <button
              className={`copy-btn ${isCopied ? 'copied' : ''}`}
              onClick={handleCopyRoomCode}
              aria-label="Copy room code"
              title="Copy room code"
            >
              {isCopied ? <Check size={20} style={{ color: 'green' }} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* User List */}
        <div className="user-list-section">
          <div className="user-list-header">
            <Users size={18} />
            <span className="user-count">{roomUsers.length}/6</span>
          </div>
          <div className="user-list">
            {roomUsers.map(user => (
              <div key={user.clientId} className={`user-item ${user.clientId === myClientId ? 'me' : ''}`}>
                <div className="user-avatar" style={{
                  background: `hsl(${user.clientId.charCodeAt(0) * 10}, 70%, 50%)`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-name">
                  {user.name}
                  {user.clientId === myClientId && <span className="me-badge">(You)</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Status */}
        <div className="connection-status">
          <span className="status-dot"></span>
          <span className="status-text">{connectionStatus}</span>
        </div>

        {/* Tab Navigation */}
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('chat')
              setIsSidebarOpen(false)
            }}
            aria-label="Chat tab"
          >
            <span className="tab-icon">
              <MessageSquare size={20} />
              {unreadChatCount > 0 && <span className="notification-badge">{unreadChatCount > 99 ? '99+' : unreadChatCount}</span>}
            </span>
            <span className="tab-label">Chat</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('files')
              setIsSidebarOpen(false)
            }}
            aria-label="Files tab"
          >
            <span className="tab-icon">
              <FileUp size={20} />
              {unreadFilesCount > 0 && <span className="notification-badge">{unreadFilesCount > 99 ? '99+' : unreadFilesCount}</span>}
            </span>
            <span className="tab-label">Files</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('video')
              setIsSidebarOpen(false)
            }}
            aria-label="Video tab"
          >
            <span className="tab-icon">
              <Video size={20} />
              {hasNewVideoUser && <span className="notification-badge dot"></span>}
            </span>
            <span className="tab-label">Video</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'watch-party' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('watch-party')
              setIsSidebarOpen(false)
            }}
            aria-label="Watch Party tab"
          >
            <span className="tab-icon">
              <MonitorPlay size={20} />
            </span>
            <span className="tab-label">Watch Party</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <button className="leave-btn" onClick={handleLeaveRoom} aria-label="Leave room">
            <ArrowLeft size={20} /> Leave
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="room-main">
        <div className="room-content" style={{ flexDirection: activeTab === 'watch-party' ? 'row' : 'column' }}>

          <div style={{ display: activeTab === 'watch-party' ? 'flex' : 'none', height: '100%', flex: 1 }}>
            <WatchPartyView
              isHosting={myClientId === watchPartyHost}
              hostId={watchPartyHost}
              hostName={watchPartyHostName}
              watchPartyStream={watchPartyStream}
              onStartParty={async () => {
                try {
                  const stream = await multiPeerManager.getDisplayMedia();
                  setWatchPartyStream(stream);
                  setWatchPartyHost(myClientId);
                  setWatchPartyHostName(userName);
                } catch (e) {
                  console.log("Screen share cancelled or failed", e);
                }
              }}
              onStopParty={() => {
                multiPeerManager.stopWatchPartyStream();
                setWatchPartyStream(null);
                setWatchPartyHost(null);
                setWatchPartyHostName('');
              }}
            />
          </div>

          <div style={{
            display: (activeTab === 'chat' || activeTab === 'watch-party') ? 'flex' : 'none',
            height: '100%',
            width: activeTab === 'watch-party' ? '350px' : '100%',
            borderLeft: activeTab === 'watch-party' ? '1px solid var(--border-color)' : 'none',
            flex: activeTab === 'watch-party' ? 'none' : 1
          }}>
            <ChatView onSendMessage={sendMessage} userName={userName} connectedPeers={connectedPeers} />
          </div>

          <div style={{ display: activeTab === 'files' ? 'flex' : 'none', height: '100%', width: '100%', flex: 1 }}>
            <FilesView />
          </div>
          <div style={{ display: activeTab === 'video' ? 'flex' : 'none', height: '100%', width: '100%', flex: 1 }}>
            <VideoView
              localStream={localStream}
              remotePeers={remotePeers}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              userName={userName}
              onStartMedia={startLocalMedia}
              onStopMedia={stopLocalMedia}
              onToggleAudio={toggleAudio}
              onToggleVideo={toggleVideo}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function ChatView({ onSendMessage, userName, connectedPeers }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef(null)
  const pickerRef = useRef(null)

  // Listen for clicks outside to close picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [pickerRef])

  const onEmojiClick = (emojiObject) => {
    setInput(prev => prev + emojiObject.emoji)
  }

  // Listen for incoming messages
  useEffect(() => {
    const handleMessage = (data) => {
      console.log('📥 ChatView received message:', data)
      const text = data.text || data
      const peerId = data.peerId || 'unknown'

      // Look up peer name from connectedPeers
      const peerName = connectedPeers?.get(peerId)?.userName || 'Unknown User'

      const newMessage = {
        id: Date.now(),
        text: text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'peer',
        peerId: peerId,
        peerName: peerName
      }

      console.log(`✓ Message from ${peerName}: ${text}`)
      setMessages(prev => [...prev, newMessage])
    }

    // Listen for text messages from peers
    multiPeerManager.on('text_message', handleMessage)

    return () => {
      multiPeerManager.off('text_message', handleMessage)
    }
  }, [connectedPeers])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (input.trim()) {
      // Add message to local UI
      const newMessage = {
        id: Date.now(),
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'you',
        senderName: userName
      }
      setMessages(prev => [...prev, newMessage])

      // Send through data channels
      if (onSendMessage) {
        onSendMessage(input)
      } else {
        // Fallback to WebSocket if data channels not available
        ws.send('chat_message', { text: input })
      }
      setInput('')
    }
  }

  const isOnlyEmojis = (text) => {
    if (!text) return false;
    const noSpace = text.replace(/[\s\n]/g, '');
    if (noSpace.length === 0) return false;
    return /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u.test(noSpace);
  };

  return (
    <div className="chat-view">
      <div className="chat-header">
        <h2>Group Chat</h2>
        <p className="chat-subtitle">Real-time messaging</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const emojiOnly = isOnlyEmojis(msg.text);
            return (
              <div key={msg.id} className={`message ${msg.sender} ${emojiOnly ? 'emoji-only' : ''}`}>
                {msg.sender === 'peer' && (
                  <div className="message-sender">{msg.peerName || 'Peer'}</div>
                )}
                <div className="message-bubble">{msg.text}</div>
                <div className="message-time">{msg.time}</div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <div className="emoji-container" ref={pickerRef}>
          <button
            type="button"
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            aria-label="Add emoji"
          >
            <Smile size={24} />
          </button>
          {showEmojiPicker && (
            <div className="emoji-picker-wrapper">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </div>
          )}
        </div>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Message input"
        />
        <button type="submit" className="send-btn" aria-label="Send message">
          <Check size={20} />
        </button>
      </form>
    </div>
  )
}

function FilesView() {
  const [sendingFiles, setSendingFiles] = useState({})
  const [receivedFiles, setReceivedFiles] = useState([])
  const fileInputRef = useRef(null)

  // Listen for file transfer events
  useEffect(() => {
    const handleFileSendProgress = (data) => {
      setSendingFiles(prev => ({
        ...prev,
        [data.fileId]: {
          name: data.fileName,
          progress: Math.round(data.progress),
          status: 'uploading',
          peerId: data.peerId
        }
      }))
    }

    const handleFileSent = (data) => {
      setSendingFiles(prev => ({
        ...prev,
        [data.fileId]: {
          ...prev[data.fileId],
          status: 'complete',
          progress: 100
        }
      }))
    }

    const handleFileReceiveProgress = (data) => {
      setReceivedFiles(prev => {
        const existing = prev.find(f => f.id === data.fileId)
        if (existing) {
          return prev.map(f => f.id === data.fileId ? { ...f, progress: data.progress } : f)
        }
        return [...prev, {
          id: data.fileId,
          name: data.fileName,
          progress: data.progress,
          status: 'downloading',
          senderName: data.peerId || 'Peer'
        }]
      })
    }

    const handleFileReceived = (data) => {
      const url = URL.createObjectURL(data.blob)
      setReceivedFiles(prev => {
        const existing = prev.find(f => f.id === data.fileId)
        if (existing) {
          return prev.map(f =>
            f.id === data.fileId ? { ...f, progress: 100, status: 'complete', downloadUrl: url } : f
          )
        }
        return [...prev, {
          id: data.fileId,
          name: data.fileName,
          progress: 100,
          status: 'complete',
          senderName: data.peerId || 'Peer',
          downloadUrl: url
        }]
      })
    }

    multiPeerManager.on('file_send_progress', handleFileSendProgress)
    multiPeerManager.on('file_sent', handleFileSent)
    multiPeerManager.on('file_receive_progress', handleFileReceiveProgress)
    multiPeerManager.on('file_received', handleFileReceived)

    return () => {
      multiPeerManager.off('file_send_progress', handleFileSendProgress)
      multiPeerManager.off('file_sent', handleFileSent)
      multiPeerManager.off('file_receive_progress', handleFileReceiveProgress)
      multiPeerManager.off('file_received', handleFileReceived)
    }
  }, [])

  const handleFileSelect = async (files) => {
    if (!files || files.length === 0) return

    for (let file of files) {
      try {
        await multiPeerManager.sendFile(file)
      } catch (error) {
        console.error('Error sending file:', error)
      }
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const allFiles = [
    ...Object.entries(sendingFiles).map(([fileId, data]) => ({
      id: fileId,
      ...data,
      type: 'sending'
    })),
    ...receivedFiles.map(data => ({
      ...data,
      type: 'received'
    }))
  ]

  return (
    <div className="files-view">
      <div className="files-header">
        <h2>Files</h2>
        <p className="files-subtitle">Share with group</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        style={{ display: 'none' }}
        aria-label="Select files"
      />

      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleBrowseClick}
      >
        <div className="drop-icon"><Upload size={32} /></div>
        <div className="drop-text">Drop files here</div>
        <div className="drop-subtext">or click to browse</div>
      </div>

      <div className="files-list">
        {allFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            No files yet
          </div>
        ) : (
          allFiles.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-icon"><File size={24} /></div>
              <div className="file-info">
                <div className="file-name">{file.name}</div>
                <div className="file-sender">
                  {file.type === 'sending' ? 'Sending...' : `from ${file.senderName || 'Unknown'}`}
                </div>
                <div className="file-size">
                  {file.progress}% · {file.status}
                </div>
                {file.progress < 100 && (
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                )}
                {file.status === 'complete' && file.downloadUrl && (
                  <a href={file.downloadUrl} download={file.name} className="download-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '10px', padding: '6px 14px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <Download size={14} /> Download
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function VideoView({
  localStream,
  remotePeers,
  isVideoEnabled,
  isAudioEnabled,
  userName,
  onStartMedia,
  onStopMedia,
  onToggleAudio,
  onToggleVideo
}) {
  const localVideoRef = useRef(null)
  const remoteVideoRefs = useRef(new Map())

  // Update video elements when streams change
  useEffect(() => {
    remotePeers.forEach((peerData, peerId) => {
      const ref = remoteVideoRefs.current.get(peerId)
      if (ref && peerData.stream) {
        ref.srcObject = peerData.stream
      }
    })
  }, [remotePeers])

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  const setRemoteVideoRef = (peerId, ref) => {
    if (ref) {
      remoteVideoRefs.current.set(peerId, ref)
    } else {
      remoteVideoRefs.current.delete(peerId)
    }
  }

  return (
    <div className="video-view">
      <div className="video-header">
        <h2>Video Call</h2>
        <p className="video-subtitle">Group video conference</p>
        {localStream && <p style={{ fontSize: '0.875rem', color: '#888' }}>📹 Camera: {isVideoEnabled ? 'ON' : 'OFF'} | 🎤 Mic: {isAudioEnabled ? 'ON' : 'OFF'}</p>}
      </div>

      <div className="video-grid">
        {/* Local Video */}
        {localStream ? (
          <div className="video-tile local">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="video-label">{userName} (You)</div>
          </div>
        ) : null}

        {/* Remote Videos */}
        {Array.from(remotePeers.entries()).map(([peerId, peerData]) => (
          <div key={peerId} className="video-tile remote">
            <video
              ref={(ref) => setRemoteVideoRef(peerId, ref)}
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#000' }}
            />
            <div className="video-label">{peerData.userName}</div>
          </div>
        ))}

        {/* Placeholder for empty slots */}
        {!localStream && remotePeers.size === 0 && (
          <div className="video-placeholder-grid">
            <div className="video-icon"><Video size={48} /></div>
            <div className="video-status">Start video to begin</div>
            <div className="video-info">Waiting for participants...</div>
          </div>
        )}
      </div>

      <div className="video-controls">
        {!localStream ? (
          <button className="start-call-btn" onClick={onStartMedia} aria-label="Start video">
            <Video size={20} /> Start Video
          </button>
        ) : (
          <>
            <button
              className={`control-btn ${isAudioEnabled ? 'microphone' : 'microphone-off'}`}
              onClick={onToggleAudio}
              aria-label="Toggle microphone"
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              <Mic size={20} />
            </button>
            <button
              className={`control-btn ${isVideoEnabled ? 'camera' : 'camera-off'}`}
              onClick={onToggleVideo}
              aria-label="Toggle camera"
              title={isVideoEnabled ? 'Stop video' : 'Start video'}
            >
              <Camera size={20} />
            </button>
            <button className="control-btn end-call" onClick={onStopMedia} aria-label="Stop call">
              <X size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
