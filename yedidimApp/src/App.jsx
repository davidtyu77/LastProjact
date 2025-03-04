
import { useState } from 'react'
import './App.css'
import Event from './event.jsx'


function App() {
  const [count, setCount] = useState(0);



  return (
    <>
      <Event />
    </>
  )
}

export default App;
