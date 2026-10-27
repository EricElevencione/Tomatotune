import { useState, useEffect } from 'react'

// define what the object
type MinutesPickerProps = {
  value: number
  onChange: (minutes: number) => void
  presets?: number[]
}

const MIN = 1
const MAX = 180

export default function DurationPicker({
  value,
  onChange,
  presets = [15, 25, 45]
}: MinutesPickerProps) {
  const [text, setText] = useState(String(value))

  // when the parent's value changes (e.g. a preset click), update the box
  useEffect(() => {
    setText(String(value))
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setText(raw) // always let the box show what they typed

    const n = Number(raw)
    if (raw !== '' && n >= MIN && n <= MAX) {
      onChange(n) // only tell the parent when it's valid
    }
  }

  function handleBlur() {
    const n = Number(text)

    if (text === '' || Number.isNaN(n)) {
      setText(String(value)) // empty or junk: go back to the last good value
      return
    }

    const clamped = Math.min(Math.max(n, MIN), MAX)
    setText(String(clamped))
    onChange(clamped)
  }

  return (
    <div>
      {presets.map((preset) => (
        <button
          key={preset}
          onClick={() => onChange(preset)}
          className={preset === value ? 'font-bold' : 'font-normal'}
        >
          {preset} min
        </button>
      ))}

      <input
        type="number"
        min={MIN}
        max={MAX}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-20 rounded border px-2 py-1"
      />
    </div>
  )
}
