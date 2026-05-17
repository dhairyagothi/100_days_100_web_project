import React, { useEffect, useRef } from 'react';
import { MonitorPlay, MonitorStop, Tv, Users } from 'lucide-react';
import '../styles/watchParty.css';

export default function WatchPartyView({ 
  isHosting, 
  hostId, 
  hostName,
  watchPartyStream, 
  onStartParty, 
  onStopParty 
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && watchPartyStream) {
      console.log('🎬 Setting watch party video srcObject, tracks:', watchPartyStream.getTracks().length);
      video.srcObject = watchPartyStream;
      // Mute for the host to prevent audio feedback; unmuted for viewers
      video.muted = isHosting;
      video.play().catch(err => console.warn('Watch party autoplay blocked:', err));
    }
    return () => {
      if (video) video.srcObject = null;
    };
  }, [watchPartyStream, isHosting]);

  return (
    <div className="watch-party-container">
      <div className="watch-party-header">
        <div className="watch-party-title">
          <Tv size={24} className="text-primary" />
          <h2>Watch Party</h2>
        </div>
        <div className="watch-party-controls">
          {isHosting ? (
            <button className="control-btn end-call" onClick={onStopParty}>
              <MonitorStop size={20} /> Stop Sharing
            </button>
          ) : !hostId ? (
            <button className="start-party-btn" onClick={onStartParty}>
              <MonitorPlay size={20} /> Start Watch Party
            </button>
          ) : (
            <div className="host-badge">
              <Users size={16} /> Watching {hostName}'s screen
            </div>
          )}
        </div>
      </div>

      <div className="watch-party-content">
        {watchPartyStream ? (
          <div className="watch-party-player">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="watch-party-video"
            />
          </div>
        ) : (
          <div className="watch-party-empty">
            <div className="empty-icon-wrapper">
              <Tv size={48} />
            </div>
            <h3>No Active Watch Party</h3>
            <p>Start a watch party to share a tab, window, or your entire screen with the room. Ensure you click "Share audio" when sharing a browser tab to include sound!</p>
            {!hostId && (
              <button className="start-party-btn large" onClick={onStartParty}>
                <MonitorPlay size={24} /> Start Sharing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
