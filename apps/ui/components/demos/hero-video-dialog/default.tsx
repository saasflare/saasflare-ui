"use client"

import { HeroVideoDialog } from "@saasflare/ui"

/** A poster thumbnail with a play button that opens an embedded video in a dialog. */
export function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <HeroVideoDialog
                videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
                thumbnailSrc="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800"
                thumbnailAlt="Product demo walkthrough"
            />
        </div>
    )
}
