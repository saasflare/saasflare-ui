"use client"

import { Compare } from "@saasflare/ui"

/** A draggable before/after slider revealing two overlapping images. */
export function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <Compare
                before={
                    <img
                        src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"
                        alt="Before"
                        className="size-full object-cover"
                    />
                }
                after={
                    <img
                        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&sat=-100"
                        alt="After"
                        className="size-full object-cover"
                    />
                }
            />
        </div>
    )
}
