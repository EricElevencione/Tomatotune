import React, { useState, useEffect } from 'react'
import DurationPicker from '../src/components/DurationPicker'
import { formatTime } from './utils/formatTime'
import ClockDial from './components/ClockDial'

function App(): React.JSX.Element {
  const [minutes, setMinutes] = useState<number>(25)
  const [isPaused, setIsPaused] = useState(false)
  const [endTime, setEndtime] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSecond] = useState(0)
  const [remainingMs, setRemainingMs] = useState<number>(0)

  const seconds = minutes * 60

  useEffect(() => {
    if (endTime === null || isPaused) {
      return
    }

    const updateRemaining = () => {
      const ms = Math.max(0, endTime - Date.now())
      const second = Math.ceil(ms / 1000)
      setRemainingSecond(second)

      if (second === 0) {
        setEndtime(null)
      }
    }
    updateRemaining()

    const intervalMs = 250

    const id = setInterval(updateRemaining, intervalMs)

    const cleanUp = () => {
      clearInterval(id)
    }

    return cleanUp
  }, [endTime, isPaused])

  let displayRemaining: number

  if (isPaused) {
    displayRemaining = Math.ceil(remainingMs / 1000)
  } else if (endTime !== null) {
    displayRemaining = remainingSeconds
  } else {
    displayRemaining = seconds
  }

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

  function handleReset() {
    setEndtime(null)
    setIsPaused(false)
    setRemainingMs(0)
  }

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
        <button onClick={handleStart}>Resume</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {formatTime(displayRemaining)}

      <div className="test">
        <ClockDial totalSeconds={seconds} remainingSeconds={displayRemaining} />
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
