import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { TUNNEL_URL } from '../utils';

export const ButtonControl = () => {
  const [activeButton, setActiveButton] = useState(null);
  const ws = useRef(null);
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const currentCommandRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      // כתובת WebSocket לשליטה - משתמש באותו URL כמו VideoStream
      // הערה: השרת יצטרך לתמוך בפקודות שליטה דרך WebSocket
      
      setWsStatus("Connecting...");
      try {
        ws.current = new WebSocket(TUNNEL_URL);

        ws.current.onopen = () => {
          console.log("Control WebSocket Connected");
          setWsStatus("Connected");
        };

        ws.current.onclose = () => {
          console.log("Control WebSocket Disconnected. Reconnecting...");
          setWsStatus("Disconnected");
          setTimeout(connect, 2000);
        };

        ws.current.onerror = (err) => {
          console.error("Control WebSocket Error:", err);
          setWsStatus("Error");
        };
      } catch (error) {
        console.error("Failed to connect:", error);
        setWsStatus("Error");
      }
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const sendDriveCommand = (command) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(command);
      console.log("Sent command:", command);
    } else {
      console.warn("WebSocket not connected, command:", command);
    }
  };

  // שליחת פקודה חוזרת כל שנייה כשהכפתור לחוץ
  useEffect(() => {
    if (activeButton && currentCommandRef.current) {
      const interval = setInterval(() => {
        sendDriveCommand(currentCommandRef.current);
      }, 1000); // כל שנייה

      return () => {
        clearInterval(interval);
      };
    }
  }, [activeButton]);

  const onButtonParse = (direction, command) => {
    setActiveButton(direction);
    currentCommandRef.current = command;
    sendDriveCommand(command);
  };

  const handleEnd = () => {
    if (activeButton) {
      sendDriveCommand('q'); // פקודת עצירה
      setActiveButton(null);
      currentCommandRef.current = null;
    }
  };

  // מניעת scroll בעת לחיצה
  const preventDefault = (e) => {
    e.preventDefault();
  };

  const buttonStyle = {
    minWidth: '80px',
    minHeight: '80px',
    width: { xs: '90px', sm: '100px', md: '110px' },
    height: { xs: '90px', sm: '100px', md: '110px' },
    fontSize: { xs: '48px', sm: '56px', md: '64px' },
    border: '2px solid #1976d2',
    borderRadius: '12px',
    backgroundColor: '#fff',
    '&:active': {
      backgroundColor: '#e3f2fd',
      transform: 'scale(0.95)',
    },
    touchAction: 'manipulation', // מניעת zoom
    WebkitTapHighlightColor: 'transparent',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#1976d2',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: { xs: '20px 10px', sm: '30px 20px' },
        gap: 2,
      }}
    >
      <Box
        sx={{
          fontSize: { xs: '14px', sm: '16px' },
          color: wsStatus === 'Connected' ? 'green' : 'red',
          fontWeight: 'bold',
          marginBottom: 1,
        }}
      >
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: { xs: 1, sm: 1.5, md: 2 },
          maxWidth: { xs: '320px', sm: '400px', md: '450px' },
          width: '100%',
          aspectRatio: '1',
        }}
      >
        {/* שורה ראשונה - כפתור למעלה */}
        <Box sx={{ gridColumn: '2', gridRow: '1' }}>
          <IconButton
            sx={activeButton === 'up' ? activeButtonStyle : buttonStyle}
            onMouseDown={() => onButtonParse('up', 'forward')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => {
              preventDefault(e);
              onButtonParse('up', 'forward');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            onTouchCancel={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            disableRipple={false}
          >
            <ArrowUpwardIcon sx={{ fontSize: 'inherit' }} />
          </IconButton>
        </Box>

        {/* שורה שנייה - שמאלה וימינה */}
        <Box sx={{ gridColumn: '1', gridRow: '2' }}>
          <IconButton
            sx={activeButton === 'left' ? activeButtonStyle : buttonStyle}
            onMouseDown={() => onButtonParse('left', 'left')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => {
              preventDefault(e);
              onButtonParse('left', 'left');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            onTouchCancel={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            disableRipple={false}
          >
            <ArrowBackIcon sx={{ fontSize: 'inherit' }} />
          </IconButton>
        </Box>

        {/* מרכז - ריק או כפתור עצירה */}
        <Box sx={{ gridColumn: '2', gridRow: '2' }} />

        <Box sx={{ gridColumn: '3', gridRow: '2' }}>
          <IconButton
            sx={activeButton === 'right' ? activeButtonStyle : buttonStyle}
            onMouseDown={() => onButtonParse('right', 'right')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => {
              preventDefault(e);
              onButtonParse('right', 'right');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            onTouchCancel={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            disableRipple={false}
          >
            <ArrowForwardIcon sx={{ fontSize: 'inherit' }} />
          </IconButton>
        </Box>

        {/* שורה שלישית - כפתור למטה */}
        <Box sx={{ gridColumn: '2', gridRow: '3' }}>
          <IconButton
            sx={activeButton === 'down' ? activeButtonStyle : buttonStyle}
            onMouseDown={() => onButtonParse('down', 'backward')}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => {
              preventDefault(e);
              onButtonParse('down', 'backward');
            }}
            onTouchEnd={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            onTouchCancel={(e) => {
              preventDefault(e);
              handleEnd();
            }}
            disableRipple={false}
          >
            <ArrowDownwardIcon sx={{ fontSize: 'inherit' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ButtonControl;

// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Typography, Paper, IconButton } from '@mui/material';
// import RotateLeftIcon from '@mui/icons-material/RotateLeft';
// import RotateRightIcon from '@mui/icons-material/RotateRight';
// import { TUNNEL_URL } from '../utils';

// export const JoystickControl = () => {
//   const [wsStatus, setWsStatus] = useState("Disconnected");
//   const ws = useRef(null);
//   const joystickRef = useRef(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
//   const lastSentCmd = useRef(null);

//   useEffect(() => {
//     const connect = () => {
//       setWsStatus("Connecting...");
//       ws.current = new WebSocket(TUNNEL_URL);
//       ws.current.onopen = () => setWsStatus("Connected");
//       ws.current.onclose = () => {
//         setWsStatus("Disconnected");
//         setTimeout(connect, 2000);
//       };
//     };
//     connect();
//     return () => ws.current?.close();
//   }, []);

//   const sendDriveCommand = (command) => {
//     // מונע שליחת אותה פקודה פעמיים ברצף - חשוב בגלל ה-sleep(1.0) ב-Python
//     if (command === lastSentCmd.current) return;
//     if (ws.current?.readyState === WebSocket.OPEN) {
//       ws.current.send(command);
//       lastSentCmd.current = command;
//       console.log("Sent:", command);
//     }
//   };

//   const handleJoystickMove = (x, y) => {
//     const dist = Math.sqrt(x * x + y * y);
//     if (dist < 15) return; 

//     const angle = Math.atan2(y, x) * (180 / Math.PI);
//     let command = 'stop';

//     // מיפוי מדויק לפי carControls.py
//     if (angle >= -22.5 && angle < 22.5) command = 'c';          // Strafe Right
//     else if (angle >= 22.5 && angle < 67.5) command = 'k';     // Diag Back-Right
//     else if (angle >= 67.5 && angle < 112.5) command = 'backward';
//     else if (angle >= 112.5 && angle < 157.5) command = 'j';    // Diag Back-Left
//     else if (angle >= 157.5 || angle < -157.5) command = 'z';   // Strafe Left
//     else if (angle >= -157.5 && angle < -112.5) command = 'u';  // Diag Fwd-Left
//     else if (angle >= -112.5 && angle < -67.5) command = 'forward';
//     else if (angle >= -67.5 && angle < -22.5) command = 'i';    // Diag Fwd-Right

//     sendDriveCommand(command);
//   };

//   const handleEnd = () => {
//     setIsDragging(false);
//     setKnobPos({ x: 0, y: 0 });
//     sendDriveCommand('stop'); 
//     lastSentCmd.current = null;
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, gap: 2 }}>
//       <Typography sx={{ color: wsStatus === 'Connected' ? 'green' : 'red', fontWeight: 'bold' }}>
//         {wsStatus}
//       </Typography>

//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
//         <IconButton sx={{ border: '1px solid #1976d2' }} 
//           onMouseDown={() => sendDriveCommand('left')} onMouseUp={handleEnd}
//           onTouchStart={() => sendDriveCommand('left')} onTouchEnd={handleEnd}>
//           <RotateLeftIcon />
//         </IconButton>

//         <Paper
//           elevation={4}
//           sx={{
//             width: 160, height: 160, borderRadius: '50%', position: 'relative',
//             backgroundColor: '#eee', border: '3px solid #1976d2', touchAction: 'none'
//           }}
//           ref={joystickRef}
//           onMouseDown={() => setIsDragging(true)}
//           onMouseMove={(e) => {
//             if (!isDragging) return;
//             const rect = joystickRef.current.getBoundingClientRect();
//             let x = e.clientX - rect.left - 80;
//             let y = e.clientY - rect.top - 80;
//             const d = Math.sqrt(x*x + y*y);
//             if (d > 50) { x *= 50/d; y *= 50/d; }
//             setKnobPos({ x, y });
//             handleJoystickMove(x, y);
//           }}
//           onMouseUp={handleEnd} onMouseLeave={handleEnd}
//           onTouchMove={(e) => {
//             if (!isDragging) return;
//             const rect = joystickRef.current.getBoundingClientRect();
//             let x = e.touches[0].clientX - rect.left - 80;
//             let y = e.touches[0].clientY - rect.top - 80;
//             const d = Math.sqrt(x*x + y*y);
//             if (d > 50) { x *= 50/d; y *= 50/d; }
//             setKnobPos({ x, y });
//             handleJoystickMove(x, y);
//           }}
//           onTouchStart={() => setIsDragging(true)} onTouchEnd={handleEnd}
//         >
//           <Box sx={{
//             width: 60, height: 60, borderRadius: '50%', bgcolor: '#1976d2',
//             position: 'absolute', left: 50, top: 50,
//             transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
//             transition: isDragging ? 'none' : '0.2s'
//           }} />
//         </Paper>

//         <IconButton sx={{ border: '1px solid #1976d2' }}
//           onMouseDown={() => sendDriveCommand('right')} onMouseUp={handleEnd}
//           onTouchStart={() => sendDriveCommand('right')} onTouchEnd={handleEnd}>
//           <RotateRightIcon />
//         </IconButton>
//       </Box>
//     </Box>
//   );
// };

// export default JoystickControl;