"use client"

import { AspectRatio } from "@saasflare/ui"

/** A 16:9 media frame holding a dashboard preview image. */
export function Demo() {
    return (
        <div className="w-full max-w-sm">
            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md border">
                <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&q=80"
                    alt="Analytics dashboard preview"
                    className="size-full object-cover"
                />
            </AspectRatio>
        </div>
    )
}
