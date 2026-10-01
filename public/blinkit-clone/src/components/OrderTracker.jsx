import React, { useState, useEffect } from 'react';

// Synthesize retro sounds using Web Audio API
const playSound = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioCtx) return;

    if (type === 'success') {
      // Confetti chime: happy ascending notes
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.15);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.15 + 0.3);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.15);
        osc.stop(audioCtx.currentTime + idx * 0.15 + 0.35);
      });
    } else if (type === 'beep') {
      // Simple notification beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (err) {
    console.warn('Web Audio Context not supported or blocked by browser policies.', err);
  }
};

export default function OrderTracker({ orderTotal, discountAmount, deliveryAddress, onResetCart }) {
  const [step, setStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(480); // 8 minutes = 480 seconds
  const [confetti, setConfetti] = useState([]);

  // Timer countdown
  useEffect(() => {
    if (step === 4) return; // Stop countdown when delivered
    
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStep(4);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Delivery step simulation
  useEffect(() => {
    if (step >= 4) return;

    // Transition steps: 0 -> 1 -> 2 -> 3 -> 4
    // Make each step happen faster (e.g. 5-7 seconds) for demo purposes
    const delays = [4000, 5000, 6000, 8000];
    
    const timer = setTimeout(() => {
      const nextStep = step + 1;
      setStep(nextStep);
      
      if (nextStep === 4) {
        playSound('success');
        triggerConfetti();
      } else {
        playSound('beep');
      }
    }, delays[step]);

    return () => clearTimeout(timer);
  }, [step]);

  // Initial order sound
  useEffect(() => {
    playSound('beep');
  }, []);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate confetti items
  const triggerConfetti = () => {
    const arr = [];
    const colors = ['#FFDE21', '#0C831F', '#5383e7', '#FF416C', '#FF9F43', '#1dd1a1'];
    for (let i = 0; i < 60; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100, // percentage left
        y: Math.random() * 100, // percentage top
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 2
      });
    }
    setConfetti(arr);
  };

  // Steps configuration
  const stepsList = [
    { title: 'Order Confirmed', desc: 'Sourced from local Lucknow distribution center' },
    { title: 'Packing groceries', desc: 'Our store partner is carefully sanitizing and bagging your items' },
    { title: 'Biker assigned', desc: 'Rider is arriving at warehouse to collect your bag' },
    { title: 'Out for delivery', desc: 'Rider is driving through Lucknow traffic towards your address' },
    { title: 'Delivered', desc: 'Enjoy your fresh items! Thanks for ordering with Blinkit' }
  ];

  return (
    <div className="container order-tracker-page">
      {/* Confetti Elements */}
      {step === 4 && confetti.map((c) => (
        <div
          key={c.id}
          style={{
            position: 'fixed',
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${c.rotation}deg)`,
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 999,
            animation: `fadeIn 1s ease-out both`,
            animationDelay: `${c.delay}s`
          }}
        />
      ))}

      {step < 4 ? (
        <div className="tracker-card">
          <div className="tracker-header">
            <h2>Arriving in Lucknow</h2>
            <div className="tracker-eta">{formatTime(secondsLeft)}</div>
            <div className="tracker-status-text">
              Delivery to: <strong>{deliveryAddress}</strong>
            </div>
          </div>

          {/* Road Biker Simulation */}
          <div className="road-simulation">
            <span className="store-landmark">🏪</span>
            <div className="road-dashed-line"></div>
            <span className="delivery-biker" style={{ 
              animation: 'bikeRide 12s infinite linear',
              // accelerate bike visual progress according to step
              animationPlayState: step === 3 ? 'running' : 'paused',
              left: step === 0 ? '10%' : step === 1 ? '30%' : step === 2 ? '50%' : '70%'
            }}>
              🚴
            </span>
            <span className="home-landmark">🏠</span>
          </div>

          {/* Steps Progress Check List */}
          <div className="tracker-steps">
            {stepsList.map((item, idx) => {
              let statusClass = 'pending';
              let numIcon = idx + 1;
              if (step > idx) {
                statusClass = 'completed';
                numIcon = '✓';
              } else if (step === idx) {
                statusClass = 'active';
              }

              return (
                <div key={idx} className={`tracker-step-row ${statusClass}`}>
                  <div className="step-indicator">{numIcon}</div>
                  <div className="step-details">
                    <span className="step-title">{item.title}</span>
                    <span className="step-desc">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: 'var(--text-grey)',
            paddingTop: '16px',
            borderTop: '1px dashed var(--border-color)',
            marginBottom: '20px'
          }}>
            <span>Order Value: ₹{orderTotal}</span>
            {discountAmount > 0 && <span style={{ color: 'var(--blinkit-green)' }}>Saved: ₹{discountAmount}</span>}
          </div>

          <div className="tracker-actions">
            <button 
              className="cancel-order-btn" 
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel your order?')) {
                  onResetCart();
                }
              }}
            >
              Cancel Order
            </button>
          </div>
        </div>
      ) : (
        <div className="tracker-card success-card">
          <div className="success-icon-badge">🏆</div>
          <h3>Order Delivered!</h3>
          <p>Your order amounting to <strong>₹{orderTotal}</strong> was delivered to <strong>{deliveryAddress}</strong> in record time.</p>
          
          <button className="back-shopping-btn" style={{ width: '100%' }} onClick={onResetCart}>
            Order Something Else
          </button>
        </div>
      )}
    </div>
  );
}
