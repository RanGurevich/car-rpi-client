import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { TUNNEL_URL } from '../utils';

export const JoystickControl = () => {
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const ws = useRef(null);
  const joystickRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const lastSentCmd = useRef(null);
  const repeatIntervalRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      setWsStatus("Connecting...");
      ws.current = new WebSocket(TUNNEL_URL);
      ws.current.onopen = () => setWsStatus("Connected");
      ws.current.onclose = () => {
        setWsStatus("Disconnected");
        setTimeout(connect, 2000);
      };
    };
    connect();
    return () => {
      ws.current?.close();
      stopRepeatInterval();
    };
  }, []);

  const sendDriveCommand = (command, forceSend = false) => {
    // אם זו אותה פקודה ולא forceSend, לא נשלח מיד (אבל ה-interval ישלח אותה)
    if (!forceSend && command === lastSentCmd.current) return;
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(command);
      lastSentCmd.current = command;
      console.log("Sent:", command);
    }
  };

  const startRepeatInterval = (command) => {
    // מנקה interval קודם אם קיים
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
    }
    // שולח את הפקודה מיד
    sendDriveCommand(command, true);
    // מפעיל interval ששולח את אותה פקודה כל 0.5 שניות
    repeatIntervalRef.current = setInterval(() => {
      if (lastSentCmd.current && lastSentCmd.current !== 'stop') {
        sendDriveCommand(lastSentCmd.current, true);
      }
    }, 500);
  };

  const stopRepeatInterval = () => {
    if (repeatIntervalRef.current) {
      clearInterval(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  };

  const handleJoystickMove = (x, y) => {
    const dist = Math.sqrt(x * x + y * y);
    if (dist < 15) {
      stopRepeatInterval();
      // שולח stop אם המשתמש לא זז מספיק
      if (ws.current?.readyState === WebSocket.OPEN && lastSentCmd.current !== 'stop') {
        ws.current.send('stop');
        console.log("Sent: stop");
        lastSentCmd.current = 'stop';
      }
      return;
    }

    const angle = Math.atan2(y, x) * (180 / Math.PI);
    let command = 'stop';

    // מיפוי מדויק לפי carControls.py
    if (angle >= -22.5 && angle < 22.5) command = 'c';          // Strafe Right
    else if (angle >= 22.5 && angle < 67.5) command = 'k';     // Diag Back-Right
    else if (angle >= 67.5 && angle < 112.5) command = 'backward';
    else if (angle >= 112.5 && angle < 157.5) command = 'j';    // Diag Back-Left
    else if (angle >= 157.5 || angle < -157.5) command = 'z';   // Strafe Left
    else if (angle >= -157.5 && angle < -112.5) command = 'u';  // Diag Fwd-Left
    else if (angle >= -112.5 && angle < -67.5) command = 'forward';
    else if (angle >= -67.5 && angle < -22.5) command = 'i';    // Diag Fwd-Right

    startRepeatInterval(command);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    stopRepeatInterval();
    // שולח stop מיד כאשר המשתמש משחרר את הלחיצה
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send('stop');
      console.log("Sent: stop");
    }
    lastSentCmd.current = null;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, gap: 2 }}>
      <Typography sx={{ color: wsStatus === 'Connected' ? 'green' : 'red', fontWeight: 'bold' }}>
        {wsStatus}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <IconButton sx={{ border: '1px solid #1976d2' }} 
          onMouseDown={() => sendDriveCommand('left')} onMouseUp={handleEnd}
          onTouchStart={() => sendDriveCommand('left')} onTouchEnd={handleEnd}>
          <RotateLeftIcon />
        </IconButton>

        <Paper
          elevation={4}
          sx={{
            width: 160, height: 160, borderRadius: '50%', position: 'relative',
            backgroundColor: '#eee', border: '3px solid #1976d2', touchAction: 'none'
          }}
          ref={joystickRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={(e) => {
            if (!isDragging) return;
            const rect = joystickRef.current.getBoundingClientRect();
            let x = e.clientX - rect.left - 80;
            let y = e.clientY - rect.top - 80;
            const d = Math.sqrt(x*x + y*y);
            if (d > 50) { x *= 50/d; y *= 50/d; }
            setKnobPos({ x, y });
            handleJoystickMove(x, y);
          }}
          onMouseUp={handleEnd} onMouseLeave={handleEnd}
          onTouchMove={(e) => {
            if (!isDragging) return;
            const rect = joystickRef.current.getBoundingClientRect();
            let x = e.touches[0].clientX - rect.left - 80;
            let y = e.touches[0].clientY - rect.top - 80;
            const d = Math.sqrt(x*x + y*y);
            if (d > 50) { x *= 50/d; y *= 50/d; }
            setKnobPos({ x, y });
            handleJoystickMove(x, y);
          }}
          onTouchStart={() => setIsDragging(true)} onTouchEnd={handleEnd}
        >
          <Box sx={{
            width: 60, height: 60, borderRadius: '50%', bgcolor: '#1976d2',
            position: 'absolute', left: 50, top: 50,
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: isDragging ? 'none' : '0.2s'
          }} />
        </Paper>

        <IconButton sx={{ border: '1px solid #1976d2' }}
          onMouseDown={() => sendDriveCommand('right')} onMouseUp={handleEnd}
          onTouchStart={() => sendDriveCommand('right')} onTouchEnd={handleEnd}>
          <RotateRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default JoystickControl;