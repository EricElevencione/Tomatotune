import React, { useState } from 'react'
import DurationPicker from '../src/components/DurationPicker'

function App(): React.JSX.Element {
  const [minutes, setMinutes] = useState<number>(25)

  const seconds = minutes * 60

  function formatTime(totalSeconds: number) {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60

    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div>
      <div>
        <DurationPicker value={minutes} onChange={setMinutes} />
      </div>

      <p>{formatTime(seconds)}</p>

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
