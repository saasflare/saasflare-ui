"use client"

import { ImageSwapHover } from "@saasflare/ui"

/** A product image that crossfades to an alternate view on hover. */
export function Demo() {
    return (
        <div className="w-full max-w-xs">
            <ImageSwapHover
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"
                hoverSrc="https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800"
                alt="Sneaker — front and side view"
            />
            <p className="mt-3 text-center text-sm text-muted-foreground">Hover to see the alternate view</p>
        </div>
    )
}
