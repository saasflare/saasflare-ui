"use client"

import { Compare } from "@saasflare/ui"

/** A before/after comparison with labels and a custom initial divider position. */
export function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <Compare
                before={
                    <img
                        src="https://images.unsplash.com/photo-1487014679447-9f8336841d58?w=800"
                        alt="Old design"
                        className="size-full object-cover"
                    />
                }
                after={
                    <img
                        src="https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=800"
                        alt="New design"
                        className="size-full object-cover"
                    />
                }
                beforeLabel="Before"
                afterLabel="After"
                initialPosition={35}
            />
        </div>
    )
}
