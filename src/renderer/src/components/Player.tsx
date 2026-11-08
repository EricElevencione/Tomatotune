import React, { useState } from 'react'
import { usePlayer } from '../hooks/usePlayer'

function formatPlayerTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.floor(totalSeconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export default function Player(): React.JSX.Element {
  const {
    tracks,
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    previous,
    shuffle,
    importTracks,
    removeTrack,
    currentTime,
    duration,
    progress
  } = usePlayer()

  const [showLibrary, setShowLibrary] = useState(false)

  const trackTitle = currentTrack?.title ?? 'No track'
  const trackArtist = currentTrack?.artist ?? 'Unknown artist'
  const hasNoTracks = tracks.length === 0

  async function handleImport() {
    await importTracks()
  }

  return (
    <div className="relative flex h-full flex-col rounded-2xl border border-white/[0.06] bg-[#1e1e24] p-4">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Music</h2>
        <button
          onClick={() => setShowLibrary((prev) => !prev)}
          title="Toggle music library"
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition ${
            showLibrary
              ? 'border-[#e26d6d] text-[#e26d6d]'
              : 'border-[#e26d6d]/40 text-[#e26d6d] hover:border-[#e26d6d]'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
        </button>
      </div>

      {/* Library overlay dropdown */}
      {showLibrary && (
        <div className="absolute inset-x-0 top-11 bottom-0 z-20 flex flex-col overflow-hidden rounded-b-2xl bg-[#1a1a20]/95 backdrop-blur-md shadow-xl border-t border-white/[0.06]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2">
            <span className="text-[11px] font-medium text-white/60">
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            </span>
            <button
              onClick={handleImport}
              className="flex items-center gap-1 rounded-full bg-[#e26d6d]/20 px-2.5 py-0.5 text-[11px] font-medium text-[#e26d6d] transition hover:bg-[#e26d6d]/30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                <path d="M12 5v14" /><path d="M5 12h14" />
              </svg>
              Import
            </button>
          </div>

          {hasNoTracks ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 p-3 text-center">
              <p className="text-xs text-white/40">No songs yet</p>
              <button
                onClick={handleImport}
                className="rounded-full bg-[#e26d6d] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#ea7878]"
              >
                Import music
              </button>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto px-1 py-1">
              {tracks.map((track) => (
                <li
                  key={track.id}
                  className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition ${
                    currentTrack?.id === track.id
                      ? 'bg-white/[0.08] text-white'
                      : 'text-white/60 hover:bg-white/[0.03] hover:text-white/90'
                  }`}
                >
                  <span className="w-4 text-center text-[10px]">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <span className="text-[#e26d6d]">♫</span>
                    ) : (
                      <span className="text-white/20">♪</span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{track.title}</p>
                    <p className="truncate text-[10px] text-white/40">{track.artist}</p>
                  </div>
                  <span className="text-[10px] text-white/30 tabular-nums">
                    {formatPlayerTime(track.duration)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTrack(track.id)
                    }}
                    title="Remove"
                    className="rounded p-0.5 text-white/0 transition hover:text-red-400 group-hover:text-white/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

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
          <span>{Number.isFinite(duration) && duration > 0 ? formatPlayerTime(duration) : '--:--'}</span>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="mt-auto flex items-center justify-center gap-3">
        <button
          onClick={shuffle}
          title="Shuffle"
          className="text-white/40 transition hover:text-white/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" />
          </svg>
        </button>

        <button
          onClick={previous}
          title="Previous"
          className="text-white/50 transition hover:text-white/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M6 4h2v16H6V4zm12 0l-10 8 10 8V4z" />
          </svg>
        </button>

        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause' : 'Play'}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e26d6d] text-white shadow-md shadow-[#e26d6d]/20 transition hover:scale-105 hover:bg-[#ea7878]"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 ml-0.5">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>

        <button
          onClick={next}
          title="Next"
          className="text-white/50 transition hover:text-white/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M16 4h2v16h-2V4zM6 4l10 8-10 8V4z" />
          </svg>
        </button>

        <button
          title="Repeat"
          className="text-white/40 transition hover:text-white/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
