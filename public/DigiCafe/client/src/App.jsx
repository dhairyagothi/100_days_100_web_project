import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import RoomLayout from './pages/RoomLayout'
import NameModal from './components/NameModal'

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [roomCode, setRoomCode] = useState(null)
  const [isCreator, setIsCreator] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [userName, setUserName] = useState('')
  const [pendingRoomCode, setPendingRoomCode] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const roomFromUrl = params.get('room')
    if (roomFromUrl) {
      setPendingRoomCode(roomFromUrl)
      setIsCreator(false)
      setShowNameModal(true)
    }
  }, [])

  const handleCreateRoom = () => {
    // Show name modal first
    setPendingRoomCode(null)
    setIsCreator(true)
    setShowNameModal(true)
  }

  const handleJoinRoom = (code) => {
    // Show name modal first
    setPendingRoomCode(code)
    setIsCreator(false)
    setShowNameModal(true)
  }

  const handleNameSubmit = (name) => {
    setUserName(name)
    setShowNameModal(false)
    
    // Now navigate to room
    if (pendingRoomCode) {
      setRoomCode(pendingRoomCode)
    } else {
      setRoomCode(null)
    }
    setCurrentPage('room')
  }

  const handleLeaveRoom = () => {
    setRoomCode(null)
    setIsCreator(false)
    setUserName('')
    setCurrentPage('landing')
  }

  if (showNameModal) {
    const title = isCreator ? 'Create a Room' : 'Join the Room'
    const subtitle = isCreator ? 'What should we call you?' : 'What is your name?'
    return <NameModal onSubmit={handleNameSubmit} title={title} />
  }

  if (currentPage === 'landing') {
    return <LandingPage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
  }

  if (currentPage === 'room') {
    return <RoomLayout roomCode={roomCode} isCreator={isCreator} userName={userName} setRoomCode={setRoomCode} onLeaveRoom={handleLeaveRoom} />
  }

  return <LandingPage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />
}
