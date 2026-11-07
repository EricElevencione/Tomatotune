import { useState, useEffect } from 'react'

type Track = Awaited<ReturnType<Window['api']['getTracks']>>[number]

export function usePlayer() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [audio] = useState(() => new Audio())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // get array put it in setTracks
  async function loadTracks() {
    const result = await window.api.getTracks()
    setTracks(result)
  }

  // open file picker, import selected files, then refresh the list
  async function importTracks() {
    await window.api.importTracks()
    await loadTracks()
  }

  // gets the currentIndex (the one that is playing)
  const currentTrack = tracks[currentIndex] ?? null

  const currentSrc =
    currentTrack === null
      ? null
      : 'tomatune://library/' + encodeURIComponent(currentTrack.file_name)

  function togglePlay() {
    setIsPlaying((previousIsPlaying) => !previousIsPlaying)
  }

  function next() {
    if (tracks.length === 0) return

    setCurrentIndex((i) => (i + 1) % tracks.length)
  }

  function previous() {
    if (tracks.length === 0) return

    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length)
  }

  function shuffle() {
    if (tracks.length <= 1) return

    let randomIndex = Math.floor(Math.random() * tracks.length)

    while (randomIndex === currentIndex) {
      randomIndex = Math.floor(Math.random() * tracks.length)
    }

    setCurrentIndex(randomIndex)
  }

  const progress =
    Number.isFinite(duration) && duration > 0 ? Math.max(0, Math.min(1, currentTime / duration)) : 0

  // run after frist render
  useEffect(() => {
    loadTracks()
  }, [])

  useEffect(() => {
    if (currentSrc === null) return

    audio.src = currentSrc
  }, [audio, currentSrc])

  useEffect(() => {
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [audio, isPlaying, currentSrc])

  useEffect(() => {
    const handler = () => {
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
  }, [audio, next, tracks.length])

  useEffect(() => {
    const handler = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', handler)

    return () => {
      audio.removeEventListener('timeupdate', handler)
    }
  }, [audio])

  // remove a track from the library, then refresh the list
  async function removeTrack(id: number) {
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
