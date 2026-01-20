import { useState, useEffect, useRef } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { TUNNEL_URL } from '../utils';

const ITEMS = [
  'airplane',
  'apple',
  'backpack',
  'baseball bat',
  'baseball glove',
  'banana',
  'bear',
  'bed',
  'bench',
  'bicycle',
  'bird',
  'boat',
  'book',
  'bottle',
  'bowl',
  'broccoli',
  'bus',
  'cake',
  'car',
  'carrot',
  'cat',
  'cell phone',
  'chair',
  'clock',
  'couch',
  'cow',
  'cup',
  'dining table',
  'dog',
  'donut',
  'elephant',
  'fire hydrant',
  'fork',
  'frisbee',
  'giraffe',
  'hair drier',
  'handbag',
  'horse',
  'hot dog',
  'keyboard',
  'kite',
  'knife',
  'laptop',
  'microwave',
  'motorcycle',
  'mouse',
  'orange',
  'oven',
  'parking meter',
  'person',
  'pizza',
  'potted plant',
  'refrigerator',
  'remote',
  'sandwich',
  'scissors',
  'sheep',
  'sink',
  'skis',
  'skateboard',
  'snowboard',
  'spoon',
  'sports ball',
  'stop sign',
  'suitcase',
  'surfboard',
  'teddy bear',
  'tennis racket',
  'tie',
  'toilet',
  'toaster',
  'toothbrush',
  'traffic light',
  'train',
  'truck',
  'tv',
  'umbrella',
  'vase',
  'wine glass',
  'zebra',
];

export const SearchItems = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const ws = useRef(null);
  const [wsStatus, setWsStatus] = useState("Disconnected");

  useEffect(() => {
    const connect = () => {
      setWsStatus("Connecting...");
      try {
        ws.current = new WebSocket(TUNNEL_URL);

        ws.current.onopen = () => {
          console.log("Search WebSocket Connected");
          setWsStatus("Connected");
        };

        ws.current.onclose = () => {
          console.log("Search WebSocket Disconnected. Reconnecting...");
          setWsStatus("Disconnected");
          setTimeout(connect, 2000);
        };

        ws.current.onerror = (err) => {
          console.error("Search WebSocket Error:", err);
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

  const handleSearch = () => {
    if (selectedItem) {
        sendDriveCommand(selectedItem);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: { xs: '10px', sm: '20px' },
        width: { xs: '100%', sm: 'auto' },
        maxWidth: { xs: '100%', sm: '600px' },
      }}
    >
      <FormControl
        sx={{
          flex: 1,
          minWidth: { xs: 0, sm: '200px' },
        }}
      >
        <InputLabel id="search-items-label"> Select item to search </InputLabel>
        <Select
          labelId="search-items-label"
          id="search-items-select"
          value={selectedItem}
          label="select object to search"
          onChange={(e) => setSelectedItem(e.target.value)}
          sx={{
            width: '100%',
          }}
        >
          {ITEMS.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton
        onClick={handleSearch}
        sx={{
          backgroundColor: '#ADFF2F',
          color: '#000',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          '&:hover': {
            backgroundColor: '#9EE02F',
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
};

export default SearchItems;
