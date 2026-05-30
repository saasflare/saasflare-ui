"use client"

import { HeroVideoDialog } from "@saasflare/ui"

/** A hero video dialog with a custom 4/3 aspect ratio for the poster and player. */
export function Demo() {
    return (
        <div className="w-full max-w-md">
            <HeroVideoDialog
                videoSrc="https://www.youtube.com/embed/dQw4w9WgXcQ"
                thumbnailSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
                thumbnailAlt="Analytics dashboard tour"
                aspectRatio="4/3"
            />
        </div>
    )
}
