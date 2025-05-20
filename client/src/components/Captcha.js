import React, { useState, useEffect, useRef } from 'react';
import '../styles/Captcha.css';

const Captcha = ({ onVerify, resetTrigger }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  // Generate random CAPTCHA text
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(captcha);
    setUserInput('');
    setIsVerified(false);
    setError('');
    return captcha;
  };

  // Draw CAPTCHA on canvas
  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw text with random styling
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#333';
    
    // Add distortion
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 20, 30);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
    
    // Add some noise
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.2})`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        1
      );
    }
  };

  // Verify user input
  const verifyCaptcha = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setIsVerified(true);
      setError('');
      if (onVerify) onVerify(true);
    } else {
      setIsVerified(false);
      setError('CAPTCHA verification failed. Please try again.');
      if (onVerify) onVerify(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Initialize and regenerate when resetTrigger changes
  useEffect(() => {
    const newCaptcha = generateCaptcha();
    drawCaptcha(newCaptcha);
  }, [resetTrigger]);

  return (
    <div className="captcha-container">
      <div className="captcha-display">
        <canvas 
          ref={canvasRef} 
          width="150" 
          height="50"
          title="CAPTCHA"
        />
        <button 
          type="button" 
          onClick={() => drawCaptcha(generateCaptcha())}
          className="refresh-button"
          aria-label="Refresh CAPTCHA"
        >
          ↻
        </button>
      </div>
      
      <div className="captcha-input-group">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter CAPTCHA"
          className="captcha-input"
          aria-label="CAPTCHA input"
        />
        <button
          type="button"
          onClick={verifyCaptcha}
          className="verify-button"
        >
          Verify
        </button>
      </div>
      
      {error && <div className="captcha-error">{error}</div>}
      {isVerified && <div className="captcha-success">✓ Verified</div>}
      
      <input 
        type="hidden" 
        name="isCaptchaVerified" 
        value={isVerified ? "true" : "false"} 
      />
    </div>
  );
};

export default Captcha;