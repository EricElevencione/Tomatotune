import React from 'react'
import { usePlayer, PlayerState } from '../hooks/usePlayer'

function formatPlayerTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.floor(totalSeconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

type PlayerProps = {
  player?: PlayerState
  onOpenLibrary?: () => void
}

export default function Player({
  player: propPlayer,
  onOpenLibrary
}: PlayerProps): React.JSX.Element {
  // If player is passed as prop from App, use it; otherwise use local hook
  const localPlayer = usePlayer()
  const player = propPlayer ?? localPlayer

  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    previous,
    shuffle,
    currentTime,
    duration,
    progress
  } = player

  const trackTitle = currentTrack?.title ?? 'No track'
  const trackArtist = currentTrack?.artist ?? 'Unknown artist'

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#1e1e24] p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Music</h2>
        <button
          onClick={onOpenLibrary}
          title="Open Music Library"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#e26d6d]/40 text-[#e26d6d] hover:border-[#e26d6d] hover:bg-[#e26d6d]/10 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </button>
      </div>

      {/* Track info subtitle */}
      <p className="mb-2 truncate text-xs text-white/50">
        {currentTrack ? `${trackArtist} - ${trackTitle}` : 'No track selected'}
      </p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#e26d6d] transition-all"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-white/30 tabular-nums">
          <span>{formatPlayerTime(currentTime)}</span>
          <span>
            {Number.isFinite(duration) && duration > 0 ? formatPlayerTime(duration) : '--:--'}
          </span>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="mt-auto flex items-center justify-center gap-3">
        <button
          onClick={shuffle}
          title="Shuffle"
          className="text-white/40 transition hover:text-white/70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
          </svg>
        </button>

        <button
          onClick={previous}
          title="Previous"
          className="text-white/50 transition hover:text-white/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M6 4h2v16H6V4zm12 0l-10 8 10 8V4z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e26d6d] text-white shadow-md shadow-[#e26d6d]/20 transition hover:scale-105 hover:bg-[#ea7878]"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 ml-0.5"
            >
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>

        <button
          onClick={next}
          title="Next"
          className="text-white/50 transition hover:text-white/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M16 4h2v16h-2V4zM6 4l10 8-10 8V4z" />
          </svg>
        </button>

        <button title="Repeat" className="text-white/40 transition hover:text-white/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
          >
            <path d="M17 2l4 4-4 4" />
            <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
            <path d="M7 22l-4-4 4-4" />
            <path d="M21 13v1a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
