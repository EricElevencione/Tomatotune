import React, { useState } from 'react'

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
  presets = [15, 25, 45, 60]
}: MinutesPickerProps): React.JSX.Element {
  const [prevValue, setPrevValue] = useState(value)
  const [text, setText] = useState(String(value))

  if (value !== prevValue) {
    setPrevValue(value)
    setText(String(value))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const raw = e.target.value
    setText(raw)

    const n = Number(raw)
    if (raw !== '' && n >= MIN && n <= MAX) {
      onChange(n)
    }
  }

  function handleBlur(): void {
    const n = Number(text)

    if (text === '' || Number.isNaN(n)) {
      setText(String(value))
      return
    }

    const clamped = Math.min(Math.max(n, MIN), MAX)
    setText(String(clamped))
    onChange(clamped)
  }

  return (
    <div className="mt-2 flex items-center justify-center gap-1.5">
      {presets.map((preset) => {
        const isActive = preset === value
        return (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
              isActive
                ? 'bg-[#e26d6d] text-white shadow-sm'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            {preset}m
          </button>
        )
      })}

      <div className="flex items-center rounded-full bg-white/5 px-2 py-0.5 border border-white/10 focus-within:border-[#e26d6d]/60">
        <input
          type="number"
          min={MIN}
          max={MAX}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-10 bg-transparent text-center text-xs font-medium text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-[10px] text-white/40 mr-1">m</span>
      </div>
    </div>
  )
}
