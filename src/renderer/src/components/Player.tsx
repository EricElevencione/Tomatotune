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
    <>
      {/* Library panel (slides up above the player bar) */}
      {showLibrary && (
        <div className="fixed bottom-[72px] left-0 right-0 z-40 max-h-64 overflow-y-auto border-t border-white/10 bg-[#16161a]/95 backdrop-blur-md">
          <div className="flex items-center justify-between px-5 py-3">
            <h3 className="text-sm font-semibold text-white/80">
              Library ({tracks.length} {tracks.length === 1 ? 'track' : 'tracks'})
            </h3>
            <button
              onClick={handleImport}
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/20"
            >
              {/* Plus icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="M12 5v14" /><path d="M5 12h14" />
              </svg>
              Import Music
            </button>
          </div>

          {hasNoTracks ? (
            <div className="flex flex-col items-center gap-3 px-5 pb-6 pt-2">
              <p className="text-sm text-white/40">No tracks yet</p>
              <button
                onClick={handleImport}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Import your first track
              </button>
            </div>
          ) : (
            <ul className="px-2 pb-2">
              {tracks.map((track) => (
                <li
                  key={track.id}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                    currentTrack?.id === track.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  {/* Playing indicator or track number */}
                  <span className="w-5 text-center text-xs">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <span className="text-green-400">♫</span>
                    ) : (
                      <span className="text-white/30">♪</span>
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{track.title}</p>
                    <p className="truncate text-xs text-white/40">{track.artist}</p>
                  </div>

                  <span className="text-xs text-white/30 tabular-nums">
                    {formatPlayerTime(track.duration)}
                  </span>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTrack(track.id)
                    }}
                    title="Remove track"
                    className="ml-1 rounded p-1 text-white/20 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                      <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Player bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 border-t border-white/10 bg-[#1a1a20]/95 px-5 py-3 backdrop-blur-md">
        {/* Track info */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Album art placeholder */}
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-white/10 text-lg">
            🎵
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white/90">{trackTitle}</p>
            <p className="truncate text-xs text-white/50">{trackArtist}</p>
          </div>
        </div>

        {/* Center controls + progress */}
        <div className="flex flex-1 flex-col items-center gap-1">
          {/* Transport buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={shuffle}
              title="Shuffle"
              className="text-white/50 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M16 3h5v5" /><path d="M4 20 21 3" /><path d="M21 16v5h-5" /><path d="M15 15l6 6" /><path d="M4 4l5 5" />
              </svg>
            </button>

            <button
              onClick={previous}
              title="Previous"
              className="text-white/60 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M6 4h2v16H6V4zm12 0l-10 8 10 8V4z" />
              </svg>
            </button>

            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 hover:bg-white/90"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              )}
            </button>

            <button
              onClick={next}
              title="Next"
              className="text-white/60 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M16 4h2v16h-2V4zM6 4l10 8-10 8V4z" />
              </svg>
            </button>

            <button
              title="Repeat"
              className="text-white/50 transition hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M17 2l4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex w-full max-w-md items-center gap-2 text-[11px] text-white/50">
            <span className="w-9 text-right tabular-nums">{formatPlayerTime(currentTime)}</span>
            <div className="group relative h-1 flex-1 cursor-pointer rounded-full bg-white/15">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-white/70 transition-all group-hover:bg-white"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white opacity-0 shadow transition group-hover:opacity-100"
                style={{ left: `${progress * 100}%` }}
              />
            </div>
            <span className="w-9 tabular-nums">
              {Number.isFinite(duration) && duration > 0 ? formatPlayerTime(duration) : '--:--'}
            </span>
          </div>
        </div>

        {/* Right side — import + library toggle */}
        <div className="flex items-center gap-2">
          {/* Import button (quick access) */}
          <button
            onClick={handleImport}
            title="Import music"
            className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>

          {/* Library toggle */}
          <button
            onClick={() => setShowLibrary((prev) => !prev)}
            title="Toggle library"
            className={`rounded-full p-2 transition ${
              showLibrary
                ? 'bg-white/15 text-white'
                : 'text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
