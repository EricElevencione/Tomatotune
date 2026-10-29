import React, { useState } from 'react'
import DurationPicker from '../src/components/DurationPicker'
import { formatTime } from './utils/formatTime'
import ClockDial from './components/ClockDial'

function App(): React.JSX.Element {
  const [minutes, setMinutes] = useState<number>(25)
  const [endTime, setEndtime] = useState<number | null>(0)
  const [isPaused, setIsPaused] = useState(false)
  const [remainingMs, setRemainingMs] = useState(0)

  const seconds = minutes * 60

  function handleStart() {
    const duration = isPaused ? remainingMs : minutes * 60 * 1000

    setEndtime(Date.now() + duration)
    setIsPaused(false)
  }

  function handlePause() {
    if (endTime === null) return

    const remaining = Math.max(0, endTime - Date.now())

    setRemainingMs(remaining)
    setIsPaused(true)
  }

  function handleReset() {}

  // function handleComplete() {
  //   setStatus('break') // 'break' needs to be added to the Status type
  // }

  return (
    <div>
      <div>
        <div>
          {isPaused && <p>{formatTime(Math.ceil(remainingMs / 1000))}</p>}
          <DurationPicker value={minutes} onChange={setMinutes} />
          <div>
            <button onClick={handleStart}>Start</button>
            <button onClick={handlePause}>Pause</button>
          </div>
        </div>
        {isPaused && <p>{formatTime(Math.ceil(remainingMs / 1000))}</p>}
        <button>Resume</button>
      </div>

      <p>{formatTime(seconds)}</p>

      <div className="test">
        <ClockDial totalSeconds={60} remainingSeconds={0} />
      </div>

      <nav>
        <ul>
          <li>Home</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  )
}

export default App
