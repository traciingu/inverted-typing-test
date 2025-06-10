import './App.css'
import WordDisplay from './components/WordDisplay'
import Timer from './components/Timer'
import { useState } from 'react'

function App() {
  const [testIsRunning, setTestIsRunning] = useState<boolean>(false);
  const [testIsCompleted, setTestIsCompleted] = useState<boolean>(false);

  const handleSetTestIsRunning = (isRunning: boolean) => { setTestIsRunning(isRunning) };
  const handleSetTestIsCompleted = (isCompleted: boolean) => { setTestIsCompleted(isCompleted) }

  return (
    <>
      <Timer timeLimit={30 * 1000} testIsRunning={testIsRunning} setTestIsRunning={handleSetTestIsRunning} setTestIsCompleted={handleSetTestIsCompleted} />
      <WordDisplay testIsRunning={testIsRunning} setTestIsRunning={handleSetTestIsRunning} testIsCompleted={testIsCompleted}/>
    </>
  )
}

export default App
