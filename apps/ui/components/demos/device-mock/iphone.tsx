"use client"

import { IPhoneMock } from "@saasflare/ui"

/** An iPhone device frame wrapping a mobile screenshot, complete with notch and status bar. */
export function Demo() {
    return (
        <IPhoneMock>
            <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600"
                alt="Mobile app screenshot"
                className="aspect-[9/16] size-full object-cover"
            />
        </IPhoneMock>
    )
}
