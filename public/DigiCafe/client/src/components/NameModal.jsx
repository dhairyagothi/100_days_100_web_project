import { useState } from 'react'
import { Check } from 'lucide-react'
import '../styles/nameModal.css'

export default function NameModal({ onSubmit, title = 'Enter Your Name' }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters')
      return
    }

    if (name.trim().length > 30) {
      setError('Name must be less than 30 characters')
      return
    }

    onSubmit(name.trim())
  }

  return (
    <div className="name-modal-overlay">
      <div className="name-modal">
        <div className="name-modal-content">
          <h1 className="name-modal-title">{title}</h1>
          <p className="name-modal-subtitle">This name will be visible to other users</p>

          <form onSubmit={handleSubmit} className="name-form">
            <div className="name-input-wrapper">
              <input
                type="text"
                className="name-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                maxLength="30"
                autoFocus
                aria-label="User name input"
              />
              <span className="name-input-length">{name.length}/30</span>
            </div>

            {error && <div className="name-error">{error}</div>}

            <button type="submit" className="name-submit-btn" aria-label="Submit name">
              <Check size={20} />
              <span>Continue</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
