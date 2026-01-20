import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { VideoStream } from './compoments/VideoStream'
import { JoystickControl } from './compoments/JoystickControl'
import { SearchItems } from './compoments/SearchItems'
import { ButtonControl } from './compoments/ButtonControl'

function App() {

  return (
    <>
      <VideoStream/>
      {/* <JoystickControl/> */}
      <ButtonControl/>
      <SearchItems/>
  
    </>
  )
}

export default App
