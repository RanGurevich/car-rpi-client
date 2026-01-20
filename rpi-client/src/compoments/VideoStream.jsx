import React, { useState, useEffect, useRef } from 'react';
import { TUNNEL_URL } from '../utils';

export const VideoStream = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      setStatus("Connecting...");
      ws.current = new WebSocket(TUNNEL_URL);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        setStatus("Connected");
      };

      ws.current.onmessage = (event) => {
        setImageSrc(`data:image/jpeg;base64,${event.data}`);
      };

      ws.current.onclose = () => {
        console.log("Disconnected. Reconnecting...");
        setStatus("Disconnected");
        setTimeout(connect, 1000);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket Error:", err);
        ws.current.close();
      };
    };

    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      
      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt="Live Stream" 
          style={{ 
            width: '100%', 
            maxWidth: '800px', 
            border: '2px solid #333',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }} 
        />
      ) : (
        <div style={{ 
          height: '400px', 
          background: '#eee', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          No Signal
        </div>
      )}
    </div>
  );
};

export default VideoStream;
