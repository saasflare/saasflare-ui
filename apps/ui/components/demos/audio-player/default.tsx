"use client"

import { AudioPlayer } from "@saasflare/ui"

/** A styled audio player with play/pause, seek bar, and time display. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <AudioPlayer
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                title="Episode 12 — Shipping faster with Saasflare"
            />
        </div>
    )
}
