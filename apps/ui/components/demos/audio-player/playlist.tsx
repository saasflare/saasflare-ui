"use client"

import { AudioPlayer } from "@saasflare/ui"

/** A stacked playlist of audio players — one row per track. */
export function Demo() {
    const tracks = [
        { title: "Intro — Why design systems win", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { title: "Tokens, themes, and palettes", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { title: "Shipping the free tier", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    ]
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            {tracks.map((track) => (
                <AudioPlayer key={track.src} src={track.src} title={track.title} />
            ))}
        </div>
    )
}
