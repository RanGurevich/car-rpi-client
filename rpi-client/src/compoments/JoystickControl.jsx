import React, { useState, useEffect, useRef } from 'react';
import { IconButton, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const JoystickControl = () => {
  const [activeButton, setActiveButton] = useState(null);
  const ws = useRef(null);
  const [wsStatus, setWsStatus] = useState("Disconnected");

  useEffect(() => {
    const connect = () => {
      // כתובת WebSocket לשליטה - משתמש באותו URL כמו VideoStream
      // הערה: השרת יצטרך לתמוך בפקודות שליטה דרך WebSocket
      const socketUrl = 'https://a2c01923ec2fe854.p50.rt3.io';
      
      setWsStatus("Connecting...");
      try {
        ws.current = new WebSocket(socketUrl);

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

  const onButtonParse = (direction, command) => {
    setActiveButton(direction);
    sendDriveCommand(command);
  };

  const handleEnd = () => {
    if (activeButton) {
      sendDriveCommand('q'); // פקודת עצירה
      setActiveButton(null);
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

export default JoystickControl;

