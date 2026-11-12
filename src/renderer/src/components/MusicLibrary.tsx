import React, { useState } from 'react'
import { PlayerState } from '../hooks/usePlayer'

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.floor(totalSeconds % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

type MusicLibraryProps = {
  player: PlayerState
  onBack?: () => void
}

export default function MusicLibrary({ player, onBack }: MusicLibraryProps): React.JSX.Element {
  const {
    tracks,
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    next,
    previous,
    shuffle,
    importTracks,
    removeTrack,
    currentTime,
    duration,
    progress
  } = player

  const [search, setSearch] = useState('')

  const filteredTracks = tracks.filter((t) => {
    const q = search.toLowerCase()
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a20]/90 backdrop-blur-md">
      {/* ── Library Header ── */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e26d6d]/15 text-[#e26d6d]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">Music Library</h1>
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-xs font-medium text-white/60">
                {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
              </span>
            </div>
            <p className="text-xs text-white/40">Manage and play your local audio tracks</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          {tracks.length > 0 && (
            <div className="flex items-center rounded-xl bg-white/[0.05] px-3 py-1.5 border border-white/[0.06] text-xs text-white focus-within:border-[#e26d6d]/60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="mr-2 h-3.5 w-3.5 text-white/40"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search tracks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-36 bg-transparent text-xs text-white placeholder-white/30 outline-none"
              />
            </div>
          )}

          {/* Import Button */}
          <button
            onClick={() => importTracks()}
            className="flex items-center gap-1.5 rounded-xl bg-[#e26d6d] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#ea7878] active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span>Import Music</span>
          </button>
        </div>
      </div>

      {/* ── Main Track List Area ── */}
      <div className="flex-1 overflow-y-auto px-6 py-3">
        {tracks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-white/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">Your library is empty</p>
              <p className="mt-1 text-xs text-white/40">
                Import local audio files (.mp3, .wav, .flac, .m4a, .ogg) to start listening
              </p>
            </div>
            <button
              onClick={() => importTracks()}
              className="mt-2 rounded-xl bg-[#e26d6d] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#ea7878]"
            >
              Choose Music Files
            </button>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="text-sm text-white/40">No songs matching &quot;{search}&quot;</p>
          </div>
        ) : (
          <table className="w-full table-fixed text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-white/40">
                <th className="w-10 pb-2 text-center font-medium">#</th>
                <th className="w-[45%] pb-2 font-medium">Title</th>
                <th className="w-[30%] pb-2 font-medium">Artist</th>
                <th className="w-20 pb-2 text-right font-medium">Duration</th>
                <th className="w-12 pb-2 text-center font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {filteredTracks.map((track) => {
                const trackIndex = tracks.findIndex((t) => t.id === track.id)
                const isCurrent = currentTrack?.id === track.id

                return (
                  <tr
                    key={track.id}
                    onClick={() => playTrack(trackIndex)}
                    className={`group cursor-pointer transition ${
                      isCurrent
                        ? 'bg-[#e26d6d]/15 text-white'
                        : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    {/* Track Number / Play Indicator */}
                    <td className="py-2.5 text-center">
                      {isCurrent && isPlaying ? (
                        <span className="text-[#e26d6d] font-bold">♫</span>
                      ) : (
                        <span className="text-white/30 group-hover:hidden">{trackIndex + 1}</span>
                      )}
                      <span className="hidden text-[#e26d6d] group-hover:inline">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline h-3.5 w-3.5"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </span>
                    </td>

                    {/* Title */}
                    <td className="truncate py-2.5 pr-4 font-medium">
                      <span className={isCurrent ? 'text-[#e26d6d]' : 'text-white'}>
                        {track.title}
                      </span>
                    </td>

                    {/* Artist */}
                    <td className="truncate py-2.5 pr-4 text-white/50">{track.artist}</td>

                    {/* Duration */}
                    <td className="py-2.5 text-right text-white/40 tabular-nums">
                      {formatTime(track.duration)}
                    </td>

                    {/* Delete button */}
                    <td className="py-2.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeTrack(track.id)
                        }}
                        title="Delete from library"
                        className="rounded p-1 text-white/0 transition hover:bg-white/10 hover:text-red-400 group-hover:text-white/30"
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
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Bottom Persistent Player Bar ── */}
      <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#16161a]/95 px-6 py-3">
        {/* Track Info (Left) */}
        <div className="flex min-w-[200px] max-w-[260px] items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-lg">
            🎵
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-white">
              {currentTrack?.title ?? 'No track selected'}
            </p>
            <p className="truncate text-[11px] text-white/40">
              {currentTrack?.artist ?? 'Unknown artist'}
            </p>
          </div>
        </div>

        {/* Center Controls & Progress Bar */}
        <div className="flex flex-1 max-w-md flex-col items-center gap-1 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={shuffle}
              title="Shuffle"
              className="text-white/40 transition hover:text-white"
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
              className="text-white/60 transition hover:text-white"
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
              className="text-white/60 transition hover:text-white"
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
          </div>

          {/* Progress Slider */}
          <div className="flex w-full items-center gap-2 text-[10px] text-white/40">
            <span className="w-8 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#e26d6d] transition-all"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="w-8 tabular-nums">
              {Number.isFinite(duration) && duration > 0 ? formatTime(duration) : '--:--'}
            </span>
          </div>
        </div>

        {/* Right side: Back to Pomodoro shortcut button */}
        <div className="flex min-w-[200px] justify-end">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-3.5 w-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Back to Timer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
