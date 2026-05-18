import { useState } from 'react'
import { Plus, ArrowRight } from 'lucide-react'

export default function ActionPanel({ onCreateRoom, onJoinRoom }) {
  const [roomCode, setRoomCode] = useState('')

  const handleCreateRoom = () => {
    if (onCreateRoom) {
      onCreateRoom()
    }
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (roomCode.trim() && onJoinRoom) {
      onJoinRoom(roomCode.trim().toUpperCase())
    }
  }

  return (
    <div className="action-panel">
      {/* Create Room Button */}
      <button 
        className="btn-primary"
        onClick={handleCreateRoom}
        type="button"
        aria-label="Create a new room for file sharing"
      >
        <Plus size={20} /> Create Room
      </button>

      {/* Join Room Input Group */}
      <form onSubmit={handleJoinRoom} className="input-group">
        <input
          type="text"
          className="input-field"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          aria-label="Room code to join"
        />
        <button 
          type="submit"
          className="btn-join"
          aria-label="Join room with code"
        >
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  )
}
