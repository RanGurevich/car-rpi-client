import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { VideoStream } from './compoments/VideoStream'
import { JoystickControl } from './compoments/JoystickControl'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <VideoStream/>
      <JoystickControl/>
    </>
  )
}

export default App
