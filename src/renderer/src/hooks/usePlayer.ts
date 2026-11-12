import { useState, useEffect, useCallback } from 'react'

type Track = Awaited<ReturnType<Window['api']['getTracks']>>[number]

export type PlayerState = {
  tracks: Track[]
  currentIndex: number
  loadTracks: () => Promise<void>
  importTracks: () => Promise<void>
  removeTrack: (id: number) => Promise<void>
  togglePlay: () => void
  playTrack: (index: number) => void
  isPlaying: boolean
  next: () => void
  previous: () => void
  shuffle: () => void
  currentTrack: Track | null
  currentTime: number
  duration: number
  progress: number
}

// Global audio element instance for desktop playback
const audio = new Audio()

export function usePlayer(): PlayerState {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // get array put it in setTracks
  async function loadTracks(): Promise<void> {
    const result = await window.api.getTracks()
    setTracks(result)
  }

  // open file picker, import selected files, then refresh the list
  async function importTracks(): Promise<void> {
    await window.api.importTracks()
    await loadTracks()
  }

  // gets the currentIndex (the one that is playing)
  const currentTrack = tracks[currentIndex] ?? null

  const currentSrc =
    currentTrack === null
      ? null
      : 'tomatune://library/' + encodeURIComponent(currentTrack.file_name)

  function togglePlay(): void {
    setIsPlaying((previousIsPlaying) => !previousIsPlaying)
  }

  function playTrack(index: number): void {
    if (index < 0 || index >= tracks.length) return
    setCurrentIndex(index)
    setIsPlaying(true)
  }

  const next = useCallback((): void => {
    if (tracks.length === 0) return

    setCurrentIndex((i) => (i + 1) % tracks.length)
  }, [tracks.length])

  function previous(): void {
    if (tracks.length === 0) return

    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length)
  }

  function shuffle(): void {
    if (tracks.length <= 1) return

    let randomIndex = Math.floor(Math.random() * tracks.length)

    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * tracks.length)
    }

    setCurrentIndex(randomIndex)
  }

  const progress =
    Number.isFinite(duration) && duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0

  // run after first render
  useEffect(() => {
    let ignore = false
    void window.api.getTracks().then((result) => {
      if (!ignore) {
        setTracks(result)
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (currentSrc === null) return

    audio.src = currentSrc
  }, [currentSrc])

  useEffect(() => {
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSrc])

  useEffect(() => {
    const handler = (): void => {
      if (tracks.length === 1) {
        audio.currentTime = 0
        audio.play().catch(() => {})
        return
      }

      next()
    }

    audio.addEventListener('ended', handler)

    return () => {
      audio.removeEventListener('ended', handler)
    }
  }, [next, tracks.length])

  useEffect(() => {
    const handler = (): void => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', handler)

    return () => {
      audio.removeEventListener('timeupdate', handler)
    }
  }, [])

  // remove a track from the library, then refresh the list
  async function removeTrack(id: number): Promise<void> {
    await window.api.removeTrack(id)

    // if we removed the currently playing track, stop playback
    if (currentTrack !== null && currentTrack.id === id) {
      audio.pause()
      audio.src = ''
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
    }

    await loadTracks()
  }

  return {
    tracks,
    currentIndex,
    loadTracks,
    importTracks,
    removeTrack,
    togglePlay,
    playTrack,
    isPlaying,
    next,
    previous,
    shuffle,
    currentTrack,
    currentTime,
    duration,
    progress
  }
}
