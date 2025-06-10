import './App.css'
import WordDisplay from './components/WordDisplay'
import Timer from './components/Timer'
import { useState } from 'react'

function App() {
  const [testIsRunning, setTestIsRunning] = useState<boolean>(false);

  return (
    <>
      <Timer timeLimit={30 * 1000} testIsRunning={testIsRunning} setTestIsRunning={setTestIsRunning} />
      <WordDisplay setTestIsRunning={setTestIsRunning} />
    </>
  )
}

export default App
