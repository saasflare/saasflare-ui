// @draft
"use client"

/**
 * @fileoverview Styled audio player with play/pause, seek bar, and time display.
 * @author Saasflare™
 * Pure UI audio player wrapping the native HTML5 audio element.
 * @module packages/ui/components/ui/audio-player
 * @package ui
 *
 * @component
 * @example
 * import { AudioPlayer } from '@saasflare/ui';
 * <AudioPlayer src="/podcast-episode.mp3" title="Episode 12" />
 */

import { useRef, useState, useEffect, useCallback } from "react"
import { PlayIcon, PauseIcon } from "lucide-react"
import { cn } from "../../lib/utils"

/** Props for the AudioPlayer component. */
export interface AudioPlayerProps {
  /** Audio source URL. */
  src: string
  /** Track title. */
  title?: string
  /** Additional class names. */
  className?: string
}

/** Formats seconds as mm:ss. */
function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) return "0:00"
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, "0")}`
}

/**
 * Styled audio player with play/pause, seek, and time display.
 *
 * @component
 * @package ui
 */
export function AudioPlayer({
  src,
  title,
  className,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }, [playing])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrent(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onMeta)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onMeta)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Number(e.target.value)
  }, [])

  const progress = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-card border border-border-subtle bg-glass-2 px-4 py-3",
        "transition-all duration-200 hover:border-border-hover hover:shadow-card-hover",
        className,
      )}
      data-slot="audio-player"
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        type="button"
        onClick={toggle}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <PauseIcon className="size-4" fill="currentColor" />
        ) : (
          <PlayIcon className="ml-0.5 size-4" fill="currentColor" />
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1">
        {title && <span className="text-xs font-medium truncate">{title}</span>}
        <div className="flex items-center gap-2">
          <span className="text-[10px] tabular-nums text-muted-foreground">{formatTime(current)}</span>
          <div className="relative flex-1">
            <div className="h-1 rounded-full bg-muted">
              <div
                className="h-1 rounded-full bg-primary transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={current}
              onChange={seek}
              className="absolute inset-0 h-1 w-full cursor-pointer opacity-0"
              aria-label="Seek"
            />
          </div>
          <span className="text-[10px] tabular-nums text-muted-foreground">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
