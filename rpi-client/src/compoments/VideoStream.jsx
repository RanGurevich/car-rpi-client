import React, { useState, useEffect, useRef } from 'react';

export const VideoStream = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState("Disconnected");
  
  // שומרים את החיבור ב-Ref כדי לנהל אותו בין רינדורים
  const ws = useRef(null);

  useEffect(() => {
    const connect = () => {
      // שנה כאן ל-IP של הראסברי שלך
      const socketUrl = 'https://ostensive-uguisu-7724.dataplicity.io'; 
      
      setStatus("Connecting...");
      ws.current = new WebSocket(socketUrl);

      ws.current.onopen = () => {
        console.log("Connected to WebSocket");
        setStatus("Connected");
      };

      ws.current.onmessage = (event) => {
        // השרת שולח רק את ה-Base64, אנחנו מוסיפים את ה-Header
        setImageSrc(`data:image/jpeg;base64,${event.data}`);
      };

      ws.current.onclose = () => {
        console.log("Disconnected. Reconnecting...");
        setStatus("Disconnected");
        // נסה להתחבר מחדש אחרי שנייה
        setTimeout(connect, 1000);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket Error:", err);
        ws.current.close();
      };
    };

    connect();

    // ניקוי ביציאה מהקומפוננטה
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h3>Ran Camera</h3>
      <p style={{ 
        color: status === 'Connected' ? 'green' : 'red', 
        fontWeight: 'bold' 
      }}>
        Status: {status}
      </p>
      
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