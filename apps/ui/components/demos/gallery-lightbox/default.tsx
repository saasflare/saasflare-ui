"use client"

import { useState } from "react"
import { GalleryLightbox } from "@saasflare/ui"

const images = [
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
]

/** A clickable thumbnail grid that opens a fullscreen lightbox with keyboard navigation. */
export function Demo() {
    const [open, setOpen] = useState(false)
    const [index, setIndex] = useState(0)

    return (
        <div className="w-full max-w-md">
            <div className="grid grid-cols-2 gap-3">
                {images.map((src, i) => (
                    <button
                        key={src}
                        type="button"
                        onClick={() => {
                            setIndex(i)
                            setOpen(true)
                        }}
                        className="overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <img
                            src={src}
                            alt={`Gallery image ${i + 1}`}
                            className="aspect-square size-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    </button>
                ))}
            </div>

            <GalleryLightbox
                images={images}
                open={open}
                index={index}
                onClose={() => setOpen(false)}
                onIndexChange={setIndex}
            />
        </div>
    )
}
