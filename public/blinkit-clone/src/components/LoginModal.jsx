import React, { useState, useEffect } from 'react';

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');

  // Handle countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpMode && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpMode, timer]);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setOtpMode(true);
    setTimer(30);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Auto-focus next input box
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }
    
    // In our mock system, we accept any OTP, but let's notify the user of "1234"
    setError('');
    // Trigger successful login
    onLoginSuccess(phoneNumber);
  };

  const handleResend = () => {
    setTimer(30);
    setOtpValues(['', '', '', '']);
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close flex-center" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="login-modal">
          {/* Logo Illustration */}
          <div className="login-brand-logo flex-center">
            <svg width="36" height="36" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#0C831F" />
              <path d="M30 65 L45 35 L55 35 L70 65 Z" fill="#FFDE21" />
            </svg>
          </div>

          <h3>India's Last Minute App</h3>
          <p>Log in to order groceries, fresh foods, and electronics instantly.</p>

          {error && <div style={{ color: '#f44336', fontSize: '13px', marginBottom: '14px', fontWeight: '500' }}>{error}</div>}

          {!otpMode ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="phone-input-wrapper">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!isNaN(val) && val.length <= 10) {
                      setPhoneNumber(val);
                      setError('');
                    }
                  }}
                  className="phone-number-input"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={phoneNumber.length !== 10}
              >
                Send Verification Code
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div style={{ fontSize: '14px', color: 'var(--text-grey)', marginBottom: '16px' }}>
                We sent a 4-digit code to <strong>+91 {phoneNumber}</strong>
              </div>

              <div className="otp-grid">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength="1"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="otp-box"
                    autoFocus={idx === 0}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpValues[idx] && idx > 0) {
                        const prevInput = document.getElementById(`otp-${idx - 1}`);
                        if (prevInput) {
                          prevInput.focus();
                        }
                      }
                    }}
                    required
                  />
                ))}
              </div>

              <button
                type="submit"
                className="login-submit-btn"
                disabled={otpValues.join('').length !== 4}
              >
                Verify & Proceed
              </button>

              <div className="otp-timer">
                {timer > 0 ? (
                  `Resend code in ${timer}s`
                ) : (
                  <span>
                    Didn't receive? <strong onClick={handleResend} style={{ color: 'var(--blinkit-green)', cursor: 'pointer' }}>Resend OTP</strong>
                  </span>
                )}
              </div>
            </form>
          )}

          <div style={{ marginTop: '24px', fontSize: '11px', color: 'var(--text-light)' }}>
            By continuing, you agree to our Terms of Service & Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
