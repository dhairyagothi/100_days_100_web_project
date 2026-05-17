import BackgroundCanvas from '../components/BackgroundCanvas'
import LogoHeader from '../components/LogoHeader'
import HeroSection from '../components/HeroSection'
import ActionPanel from '../components/ActionPanel'
import FeaturesBar from '../components/FeaturesBar'

import '../styles/landing.css'

export default function LandingPage({ onCreateRoom, onJoinRoom }) {
  return (
    <main className="landing-container" role="main">
      <BackgroundCanvas />
      
      <div className="landing-content">
        <LogoHeader />
        <HeroSection />
        <ActionPanel onCreateRoom={onCreateRoom} onJoinRoom={onJoinRoom} />
        <FeaturesBar />
      </div>
    </main>
  )
}
