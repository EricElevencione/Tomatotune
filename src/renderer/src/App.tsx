import React, { useState, useEffect } from 'react'
import DurationPicker from './components/DurationPicker'
import { formatTime } from './utils/formatTime'
import ClockDial from './components/ClockDial'
import Player from './components/Player'

export default function App(): React.JSX.Element {
  const [minutes, setMinutes] = useState<number>(25)
  const [isPaused, setIsPaused] = useState(false)
  const [endTime, setEndtime] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSecond] = useState(0)
  const [remainingMs, setRemainingMs] = useState<number>(0)

  // Mock tasks for the Task placeholder card matching the design
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Design', completed: false },
    { id: 2, label: 'Web development', completed: false },
    { id: 3, label: 'Social media content', completed: false }
  ])

  const seconds = minutes * 60
  const isRunning = endTime !== null && !isPaused

  useEffect(() => {
    if (endTime === null || isPaused) {
      return
    }

    const updateRemaining = () => {
      const ms = Math.max(0, endTime - Date.now())
      const second = Math.ceil(ms / 1000)
      setRemainingSecond(second)
      setRemainingMs(ms)

      if (second === 0) {
        setEndtime(null)
      }
    }
    updateRemaining()

    const intervalMs = 100
    const id = setInterval(updateRemaining, intervalMs)

    return () => clearInterval(id)
  }, [endTime, isPaused])

  let displayRemaining: number
  if (isPaused) {
    displayRemaining = Math.ceil(remainingMs / 1000)
  } else if (endTime !== null) {
    displayRemaining = remainingSeconds
  } else {
    displayRemaining = seconds
  }

  const dialRemaining = isPaused
    ? remainingMs / 1000
    : endTime !== null
      ? Math.max(0, endTime - Date.now()) / 1000
      : seconds

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

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#16161a] p-4 text-white select-none">
      {/* ── Top Navigation Bar ── */}
      <header className="mb-3 flex items-center justify-between">
        <nav className="flex items-center gap-2">
          {/* Active Home Tab */}
          <button className="flex items-center gap-2 rounded-xl bg-[#e26d6d] px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#ea7878]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span>Home</span>
          </button>

          <span className="mx-1 h-4 w-px bg-white/10" />

          {/* Settings Tab */}
          <button className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/5 hover:text-white/80">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>
        </nav>
      </header>

      {/* ── Main Dashboard Grid ── */}
      <main className="grid min-h-0 flex-1 grid-cols-[1fr_360px] grid-rows-[1fr_210px] gap-3">
        {/* ── Top-Left: Pomodoro Timer Area ── */}
        <section className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.04] bg-[#1a1a20]/60 p-4">
          <ClockDial totalSeconds={seconds} remainingSeconds={dialRemaining} />

          <p className="mt-1 text-3xl font-bold tracking-tight text-white tabular-nums">
            {formatTime(displayRemaining)}
          </p>

          <DurationPicker value={minutes} onChange={setMinutes} />

          {/* Action buttons */}
          <div className="mt-3 flex items-center gap-2">
            {!isRunning && !isPaused && (
              <button
                onClick={handleStart}
                className="rounded-xl bg-[#e26d6d] px-8 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#e26d6d]/20 transition-all hover:bg-[#ea7878] active:scale-95"
              >
                Start session
              </button>
            )}

            {isRunning && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePause}
                  className="rounded-xl bg-[#e26d6d] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#e26d6d]/20 transition-all hover:bg-[#ea7878] active:scale-95"
                >
                  Pause
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  Reset
                </button>
              </div>
            )}

            {isPaused && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStart}
                  className="rounded-xl bg-[#e26d6d] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#e26d6d]/20 transition-all hover:bg-[#ea7878] active:scale-95"
                >
                  Resume
                </button>
                <button
                  onClick={handleReset}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Top-Right: Calendar Card (Placeholder) ── */}
        <section className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#1e1e24] p-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-white">Calendar</h2>
            <div className="flex items-center gap-1 rounded-full border border-[#e26d6d]/40 px-2.5 py-0.5 text-[11px] text-[#e26d6d]">
              <span>Today</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Days row */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {[
              { day: 'Fri', date: '13', active: true },
              { day: 'Sat', date: '14', active: false },
              { day: 'Sun', date: '15', active: false },
              { day: 'Mon', date: '16', active: false },
              { day: 'Tue', date: '17', active: false }
            ].map((item) => (
              <div
                key={item.date}
                className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition ${
                  item.active
                    ? 'bg-[#c44545] text-white shadow-sm'
                    : 'bg-white/[0.04] text-white/60'
                }`}
              >
                <span className="text-[10px] opacity-70">{item.day}</span>
                <span className="text-xs font-semibold">{item.date}</span>
              </div>
            ))}
          </div>

          {/* Focus Stats bar */}
          <div className="mb-2.5 rounded-lg bg-white/[0.02] p-2 border border-white/[0.03]">
            <div className="flex items-center justify-between text-[11px] text-white/60 mb-1.5">
              <span className="flex items-center gap-2">
                <span>4 ↑</span>
                <span>0 →</span>
                <span>0 ↓</span>
              </span>
              <span className="font-medium text-white/80">3H 55M Focus</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/10 flex">
              <div className="h-full w-2/5 rounded-full bg-[#e26d6d]" />
            </div>
          </div>

          {/* Schedule Slot */}
          <div className="flex-1 flex flex-col justify-center space-y-1 text-[11px] text-white/40">
            <div>9:00 AM</div>
            <div className="rounded-xl bg-[#4a2628] p-2.5 text-center text-white/90 font-medium text-xs">
              Game Design
            </div>
            <div>11:00 AM</div>
          </div>
        </section>

        {/* ── Bottom-Left: Music + Task ── */}
        <div className="grid grid-cols-2 gap-3 min-h-0">
          {/* Music Player Card */}
          <Player />

          {/* Task Placeholder Card */}
          <section className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#1e1e24] p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Task</h2>
              <button
                title="Add task"
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e26d6d]/50 text-[#e26d6d] hover:bg-[#e26d6d]/10 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <path d="M12 5v14" /><path d="M5 12h14" />
                </svg>
              </button>
            </div>

            <ul className="flex-1 space-y-2 pt-1">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/[0.03]"
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                      task.completed
                        ? 'border-[#e26d6d] bg-[#e26d6d] text-white'
                        : 'border-white/20 bg-white/5'
                    }`}
                  >
                    {task.completed && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-xs transition ${
                      task.completed ? 'text-white/30 line-through' : 'text-white/70'
                    }`}
                  >
                    {task.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Bottom-Right: Progress Report Card (Placeholder) ── */}
        <section className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#1e1e24] p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Progress Report</h2>
            <div className="flex items-center gap-1 rounded-full border border-[#e26d6d]/40 px-2.5 py-0.5 text-[11px] text-[#e26d6d]">
              <span>Weekly</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-white/40 mb-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Activity Matrix / Heatmap */}
          <div className="grid grid-cols-7 gap-1.5 flex-1 items-center">
            {[
              '#fadcd5', '#fadcd5', '#fadcd5', '#fadcd5', '#fadcd5', '#fadcd5', '#fadcd5',
              '#7a3235', '#e26d6d', '#fadcd5', '#fadcd5', '#fadcd5', '#e26d6d', '#fadcd5',
              '#fadcd5', '#fadcd5', '#7a3235', '#e26d6d', '#e26d6d', '#7a3235', '#fadcd5',
              '#e26d6d', '#e26d6d', '#fadcd5', '#fadcd5', '#fadcd5', '#fadcd5', '#e26d6d'
            ].map((color, idx) => (
              <div
                key={idx}
                className="aspect-square w-full rounded-md transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
