"use client"

import { SafariMock } from "@saasflare/ui"

/** A Safari browser frame wrapping an app screenshot, with a URL in the address bar. */
export function Demo() {
    return (
        <div className="w-full max-w-2xl">
            <SafariMock url="https://app.saasflare.io/dashboard">
                <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                    alt="Dashboard screenshot"
                    className="aspect-video size-full object-cover"
                />
            </SafariMock>
        </div>
    )
}
